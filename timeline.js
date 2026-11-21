/*
 * COLOPHON.md -> swimlane timeline SVG parser & renderer.
 * Zero dependencies. Works in browsers (global ColophonTimeline) and Node (CommonJS).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ColophonTimeline = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MONTHS = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  };

  const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function escapeXml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  function stripMarkdown(str) {
    return String(str == null ? "" : str)
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitPipeRow(line) {
    let s = line.trim();
    if (s.startsWith("|")) s = s.slice(1);
    if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
    const cells = [];
    let cur = "";
    for (let i = 0; i < s.length; i++) {
      if (s[i] === "\\" && s[i + 1] === "|") {
        cur += "|";
        i++;
      } else if (s[i] === "|") {
        cells.push(cur.trim());
        cur = "";
      } else {
        cur += s[i];
      }
    }
    cells.push(cur.trim());
    return cells;
  }

  function isSeparatorRow(cells) {
    return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c.trim()));
  }

  function extractSections(markdown) {
    const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
    const sections = [];
    let current = { heading: "", level: 0, lines: [] };
    let inFence = false;
    for (const line of lines) {
      if (/^```/.test(line.trim())) {
        inFence = !inFence;
        current.lines.push(line);
        continue;
      }
      if (!inFence) {
        const m = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
        if (m) {
          sections.push(current);
          current = { heading: m[2].trim(), level: m[1].length, lines: [] };
          continue;
        }
      }
      current.lines.push(line);
    }
    sections.push(current);
    return sections;
  }

  function extractTables(lines) {
    const tables = [];
    let i = 0;
    while (i < lines.length) {
      if (lines[i].includes("|")) {
        const start = i;
        while (i < lines.length && lines[i].trim() !== "" && lines[i].includes("|")) {
          i++;
        }
        const block = lines.slice(start, i);
        if (block.length >= 2) {
          const header = splitPipeRow(block[0]);
          const sep = splitPipeRow(block[1]);
          if (isSeparatorRow(sep)) {
            const rows = [];
            for (let r = 2; r < block.length; r++) {
              const cells = splitPipeRow(block[r]);
              if (cells.some((c) => c !== "")) rows.push(cells);
            }
            tables.push({ header, rows });
          }
        }
      } else {
        i++;
      }
    }
    return tables;
  }

  function normalizeBuilder(raw) {
    const clean = stripMarkdown(raw);
    if (!clean) return "Unknown";

    // Handle "Committed under a 'Cursor Agent' Git identity" style strings
    const quotedAgent = clean.match(/committed under\s+(?:a|an)?\s*["“]?([^"”]+?)["”]?\s+git identity/i);
    if (quotedAgent) {
      const inner = quotedAgent[1].replace(/\s+agent$/i, "").trim();
      if (inner) return inner;
    }

    // Strip leading articles
    let name = clean.replace(/^(?:a|an|the)\s+/i, "");

    // Handle "Claude for the two on ...; Unknown for ..."
    if (name.includes(";")) {
      const first = name.split(";")[0].trim();
      if (first) name = first;
    }

    // Handle "A collaborator, using Codex" -> keep "Codex" or collaborator? Keep the tool if "using <Tool>"
    const usingMatch = name.match(/^.+?,\s*using\s+(.+)$/i);
    if (usingMatch) {
      name = usingMatch[1].trim();
    }

    // Strip trailing qualifiers
    name = name
      .replace(/,?\s+directed by\b.*$/i, "")
      .replace(/,?\s+at\s+[^,]+?'s request\b.*$/i, "")
      .replace(/,?\s+per\s+.*$/i, "")
      .replace(/,?\s+with\s+.*$/i, "")
      .replace(/\s+for\s+the\s+.*$/i, "")
      .replace(/\s*\([^)]*\)\s*$/g, "")
      .trim();

    if (!name) return clean;

    // Canonicalize minor casing variants like "Grok Bot" vs "Grok bot"
    if (/^grok\s+bot$/i.test(name)) return "Grok bot";

    return name;
  }

  function isHumanLane(laneName, eventsForLane, humanNames) {
    const lower = laneName.toLowerCase();
    if (lower === "you" || lower.startsWith("you (")) return true;
    for (const h of humanNames) {
      if (h && (lower === h.toLowerCase() || lower.includes(h.toLowerCase()))) return true;
    }
    if (eventsForLane.length > 0 && eventsForLane.every((e) => /^not applicable$/i.test(e.model || ""))) {
      return true;
    }
    return false;
  }

  function classifyRole(roleRaw, contributionRaw) {
    const role = stripMarkdown(roleRaw).toLowerCase();
    const contrib = stripMarkdown(contributionRaw).toLowerCase();

    // Explicit "no code written" is always a review/research role, never built or approved
    if (/\bno code written\b/.test(role)) {
      return "reviewed";
    }
    // If role explicitly mentions building/writing alongside review (e.g. "Reviewed and built"), show as built
    if (/\b(built|build|building|wrote|created|authored|added|updated|fixed|migrated|rewrote)\b/.test(role)) {
      return "built";
    }
    if (/\b(review|research|audit|test|check|inspect|investigat)/.test(role)) {
      return "reviewed";
    }
    if (/\b(approv|deploy|releas|propos|merg|ship|publish)/.test(role)) {
      return "approved";
    }
    if (!role || role === "unknown") {
      if (/^(released|merged|approved|deployed|proposed|where it started)\b/.test(contrib)) {
        return "approved";
      }
      if (/^(reviewed|surveyed|found|searched|audited|tested)\b/.test(contrib)) {
        return "reviewed";
      }
    }
    return "built";
  }

  function parseSingleDate(text, fallbackYear) {
    const s = stripMarkdown(text).trim();
    if (!s) return null;

    // 1. ISO date with optional time: 2026-10-15 or 2026-10-15 19:29 or 2026-10-15T19:29
    const iso = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2}))?/);
    if (iso) {
      const y = Number(iso[1]);
      const m = Number(iso[2]) - 1;
      const d = Number(iso[3]);
      let hh = iso[4] != null ? Number(iso[4]) : 12;
      const mm = iso[5] != null ? Number(iso[5]) : 0;
      if (iso[4] == null) {
        if (/\bmorning\b/i.test(s)) hh = 9;
        else if (/\bafternoon\b/i.test(s)) hh = 15;
        else if (/\bevening\b/i.test(s)) hh = 20;
        else if (/\bnight\b/i.test(s)) hh = 22;
      }
      return Date.UTC(y, m, d, hh, mm);
    }

    // 2. Month name + day (+ optional year + optional 12h/24h time): "Sep 28, 9:22 PM", "Oct 30, 2026", "Feb 3"
    const mdy = s.match(/\b([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?(?:,?\s+(?:about\s+)?(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?)?/i);
    if (mdy) {
      const mon = MONTHS[mdy[1].toLowerCase()];
      if (mon != null) {
        const d = Number(mdy[2]);
        const y = mdy[3] ? Number(mdy[3]) : (fallbackYear || new Date().getUTCFullYear());
        let hh = 12;
        let mm = 0;
        if (mdy[4] != null) {
          hh = Number(mdy[4]);
          mm = mdy[5] != null ? Number(mdy[5]) : 0;
          const ap = (mdy[6] || "").toUpperCase();
          if (ap === "PM" && hh < 12) hh += 12;
          if (ap === "AM" && hh === 12) hh = 0;
        }
        return Date.UTC(y, mon, d, hh, mm);
      }
    }

    return null;
  }

  function parseDateField(raw, fallbackYear) {
    const clean = stripMarkdown(raw);
    if (!clean) return { ms: null, approximate: true, isBefore: false };

    const isBefore = /^before\b/i.test(clean);
    const rangeMatch = clean.match(/^(.+?)\s+(?:to|–|—)\s+(.+)$/i);
    if (rangeMatch) {
      const a = parseSingleDate(rangeMatch[1], fallbackYear);
      const b = parseSingleDate(rangeMatch[2], fallbackYear);
      if (a != null && b != null) {
        return { ms: Math.round((a + b) / 2), approximate: true, isBefore: false };
      }
      if (a != null) return { ms: a, approximate: true, isBefore: false };
    }

    const ms = parseSingleDate(clean, fallbackYear);
    if (ms == null) return { ms: null, approximate: true, isBefore };
    return {
      ms: isBefore ? ms - 86400000 : ms,
      approximate: isBefore || /\b(about|approx|around|evening|morning)\b/i.test(clean),
      isBefore,
    };
  }

  function mapColumns(header) {
    const idx = {
      date: -1,
      builder: -1,
      role: -1,
      surface: -1,
      model: -1,
      contribution: -1,
      evidence: -1,
      where: -1,
    };
    header.forEach((cell, i) => {
      const h = stripMarkdown(cell).toLowerCase();
      if (idx.date < 0 && /\b(date|when)\b/.test(h)) idx.date = i;
      else if (idx.builder < 0 && /\b(builder|who|tool|agent|author)\b/.test(h)) idx.builder = i;
      else if (idx.role < 0 && /\b(role|action)\b/.test(h)) idx.role = i;
      else if (idx.surface < 0 && /\b(surface|where it ran)\b/.test(h)) idx.surface = i;
      else if (idx.where < 0 && /^where$/.test(h)) idx.where = i;
      else if (idx.model < 0 && /\b(model|mode|setting)\b/.test(h)) idx.model = i;
      else if (idx.contribution < 0 && /\b(contribution|what|change|scope|summary|happened)\b/.test(h)) idx.contribution = i;
      else if (idx.evidence < 0 && /\b(evidence|proof|source)\b/.test(h)) idx.evidence = i;
    });
    return idx;
  }

  function detectMilestone(contribution, role) {
    const text = stripMarkdown(contribution);
    // Avoid tagging review-only rows with a version milestone if a build/release row carries it
    const r = (role || "").trim();
    if (/\bno code written\b/i.test(r) || (/^reviewed\b/i.test(r) && !/\bbuilt\b/i.test(r))) {
      return null;
    }
    const vMatch = text.match(/\b(?:released?\s+)?(v\d+\.\d+(?:\.\d+)?)\b/i);
    if (vMatch) return vMatch[1];
    const verMatch = text.match(/\bversions?\s+(\d+\.\d+(?:\.\d+)?)(?:\s+to\s+(\d+\.\d+(?:\.\d+)?))?/i);
    if (verMatch) {
      return verMatch[2] ? `v${verMatch[1]}–${verMatch[2]}` : `v${verMatch[1]}`;
    }
    if (/\bapproved\b.*\blaunch\b/i.test(text) || /\bput\b.*\blive\b/i.test(text)) {
      return "Launch";
    }
    if (/\bearliest\b.*\b(credits|colophon)\.md\b/i.test(text)) {
      return "First file";
    }
    return null;
  }

  function shortenWhat(text, maxLen) {
    const clean = stripMarkdown(text);
    if (clean.length <= maxLen) return clean;
    const cut = clean.slice(0, maxLen);
    const dot = cut.indexOf(". ");
    if (dot >= 24) return cut.slice(0, dot + 1);
    const semi = cut.indexOf("; ");
    if (semi >= 24) return cut.slice(0, semi);
    const sp = cut.lastIndexOf(" ");
    return (sp > 20 ? cut.slice(0, sp) : cut) + "…";
  }

  function parseColophon(markdown, options) {
    const opts = Object.assign({ includeOrigins: false }, options || {});
    const sections = extractSections(markdown);
    const warnings = [];

    let project = "";
    let timezone = "";
    const humanNames = new Set();

    // Inspect Snapshot table if present
    const snapshotSec = sections.find((s) => /^snapshot\b/i.test(s.heading));
    if (snapshotSec) {
      const tables = extractTables(snapshotSec.lines);
      if (tables.length > 0) {
        for (const row of tables[0].rows) {
          const key = stripMarkdown(row[0] || "").toLowerCase();
          const val = stripMarkdown(row[1] || "");
          if (!val) continue;
          if (key === "project") {
            project = val.split(":")[0].trim();
          } else if (key === "directed by") {
            const name = val.split(/[(,:;]/)[0].trim();
            if (name && !/^unknown$/i.test(name)) humanNames.add(name);
          } else if (key === "human owner") {
            const name = val.split(/[(,:;]/)[0].trim();
            if (name && !/^unknown$/i.test(name)) humanNames.add(name);
          } else if (key === "era") {
            const tz = val.match(/\(([^)]+)\)\s*$/);
            if (tz) timezone = tz[1].trim();
          }
        }
      }
    }

    // Also detect timezone from Evidence limits if not in Snapshot
    if (!timezone) {
      const evSec = sections.find((s) => /^evidence\s+limits\b/i.test(s.heading));
      if (evSec) {
        const text = evSec.lines.join(" ");
        const tzMatch = text.match(/Dates\s+(?:are|use)\s+([A-Za-z0-9_/+ -]+?)(?:[.;,]|$)/i);
        if (tzMatch) timezone = tzMatch[1].trim();
      }
    }

    // Find Builder history section (or first table with date+builder columns)
    const historySec = sections.find((s) => /builder\s+history/i.test(s.heading));
    const originsSec = sections.find((s) => /^origins\b/i.test(s.heading));
    const hasOrigins = Boolean(originsSec && extractTables(originsSec.lines).length > 0);

    let tablesToRead = [];
    if (historySec) {
      const t = extractTables(historySec.lines);
      if (t.length > 0) tablesToRead.push({ source: "history", table: t[0] });
    }
    if (opts.includeOrigins && hasOrigins) {
      const t = extractTables(originsSec.lines);
      if (t.length > 0) tablesToRead.push({ source: "origins", table: t[0] });
    }
    if (tablesToRead.length === 0) {
      // Fallback: find any table that looks like a history table
      for (const sec of sections) {
        for (const t of extractTables(sec.lines)) {
          const cols = mapColumns(t.header);
          if (cols.date >= 0 && (cols.builder >= 0 || cols.contribution >= 0)) {
            tablesToRead.push({ source: "fallback", table: t });
            break;
          }
        }
        if (tablesToRead.length > 0) break;
      }
    }

    // Find a fallback year from any 4-digit year in the document
    const yearMatch = String(markdown || "").match(/\b(20\d{2})\b/);
    const fallbackYear = yearMatch ? Number(yearMatch[1]) : new Date().getUTCFullYear();

    const rawEvents = [];
    for (const entry of tablesToRead) {
      const cols = mapColumns(entry.table.header);
      // Reverse rows because Builder history & Origins are newest-first
      const rows = entry.table.rows.slice().reverse();
      rows.forEach((cells, idx) => {
        const dateRaw = cols.date >= 0 ? stripMarkdown(cells[cols.date] || "") : "";
        const builderRaw = cols.builder >= 0 ? stripMarkdown(cells[cols.builder] || "") : "Unknown";
        const roleRaw = cols.role >= 0 ? stripMarkdown(cells[cols.role] || "") : "";
        const surfaceRaw = cols.surface >= 0
          ? stripMarkdown(cells[cols.surface] || "")
          : (cols.where >= 0 ? stripMarkdown(cells[cols.where] || "") : "");
        const modelRaw = cols.model >= 0 ? stripMarkdown(cells[cols.model] || "") : "Unknown";
        const contribRaw = cols.contribution >= 0 ? stripMarkdown(cells[cols.contribution] || "") : "";
        const evidenceRaw = cols.evidence >= 0 ? stripMarkdown(cells[cols.evidence] || "") : "";

        // Skip placeholder template rows
        if (/^\{[^}]+\}$/.test(dateRaw) || /^\{[^}]+\}$/.test(builderRaw)) {
          return;
        }
        // Skip "Before YYYY-MM-DD / Unknown / Unknown" rows if Origins is included and covers the same span
        if (opts.includeOrigins && entry.source === "history" && /^unknown$/i.test(builderRaw) && /^before\b/i.test(dateRaw)) {
          return;
        }

        const parsedDate = parseDateField(dateRaw, fallbackYear);
        if (parsedDate.ms == null && dateRaw) {
          warnings.push(`Could not parse date "${dateRaw}" (placed by row order).`);
        }

        const lane = normalizeBuilder(builderRaw);
        const kind = classifyRole(roleRaw, contribRaw);
        const roleLabel = roleRaw || (kind === "approved" ? "approved" : kind === "reviewed" ? "reviewed" : "built");
        const milestone = detectMilestone(contribRaw, roleLabel);

        rawEvents.push({
          source: entry.source,
          order: rawEvents.length,
          dateRaw: dateRaw || "Unknown",
          ms: parsedDate.ms,
          approximate: parsedDate.approximate,
          isBefore: parsedDate.isBefore,
          builderRaw: builderRaw || "Unknown",
          lane,
          role: roleLabel,
          kind,
          surface: surfaceRaw,
          model: modelRaw || "Unknown",
          contribution: contribRaw,
          shortWhat: shortenWhat(contribRaw, 120),
          evidence: evidenceRaw,
          milestone,
        });
      });
    }

    // Sort chronologically if timestamps exist; keep original order for ties or missing timestamps
    const hasDates = rawEvents.filter((e) => e.ms != null).length >= 2;
    const events = rawEvents.slice();
    if (opts.includeOrigins && hasDates) {
      // When merging Origins + Builder history, sort by parsed timestamp (stable on original order)
      events.sort((a, b) => {
        if (a.ms != null && b.ms != null && a.ms !== b.ms) return a.ms - b.ms;
        if (a.source !== b.source) return a.source === "origins" ? -1 : 1;
        return a.order - b.order;
      });
    }

    // Build lane list: non-human lanes in order of appearance, human lanes at bottom
    const laneMap = new Map();
    for (const ev of events) {
      if (!laneMap.has(ev.lane)) laneMap.set(ev.lane, []);
      laneMap.get(ev.lane).push(ev);
    }
    const aiLanes = [];
    const humanLanes = [];
    for (const [lane, list] of laneMap.entries()) {
      if (isHumanLane(lane, list, humanNames)) humanLanes.push(lane);
      else aiLanes.push(lane);
    }
    const lanes = aiLanes.concat(humanLanes);

    return {
      project: project || "Colophon",
      timezone,
      hasOrigins,
      lanes,
      events,
      warnings,
    };
  }

  function formatTickDate(ms, spanDays, showYear) {
    const d = new Date(ms);
    const mon = MONTH_SHORT[d.getUTCMonth()];
    const day = d.getUTCDate();
    if (spanDays > 220) {
      return showYear ? `${mon} ${d.getUTCFullYear()}` : mon;
    }
    return showYear ? `${mon} ${day}, ${d.getUTCFullYear()}` : `${mon} ${day}`;
  }

  function buildTimeTicks(minMs, maxMs, xStart, xEnd) {
    const spanMs = Math.max(1, maxMs - minMs);
    const spanDays = spanMs / 86400000;
    const width = xEnd - xStart;
    const maxTicks = Math.max(2, Math.floor(width / 95));
    const ticks = [];

    if (spanDays <= 1.2) {
      // Hour ticks
      const stepHrs = Math.max(1, Math.ceil((spanMs / 3600000) / maxTicks));
      const startDate = new Date(minMs);
      startDate.setUTCMinutes(0, 0, 0);
      let t = startDate.getTime();
      if (t < minMs) t += stepHrs * 3600000;
      while (t <= maxMs) {
        const d = new Date(t);
        const h = d.getUTCHours();
        const label = h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
        const x = xStart + ((t - minMs) / spanMs) * width;
        ticks.push({ x, label });
        t += stepHrs * 3600000;
      }
      return ticks;
    }

    // Pick nice day or month steps
    const startYear = new Date(minMs).getUTCFullYear();
    const endYear = new Date(maxMs).getUTCFullYear();
    const crossesYear = startYear !== endYear;

    if (spanDays > 140) {
      // Monthly ticks
      const d = new Date(Date.UTC(startYear, new Date(minMs).getUTCMonth(), 1));
      if (d.getTime() < minMs) d.setUTCMonth(d.getUTCMonth() + 1);
      const stepMonths = Math.max(1, Math.ceil((spanDays / 30) / maxTicks));
      while (d.getTime() <= maxMs) {
        const x = xStart + ((d.getTime() - minMs) / spanMs) * width;
        const label = crossesYear && d.getUTCMonth() === 0
          ? `${MONTH_SHORT[0]} ${d.getUTCFullYear()}`
          : MONTH_SHORT[d.getUTCMonth()];
        ticks.push({ x, label });
        d.setUTCMonth(d.getUTCMonth() + stepMonths);
      }
      return ticks;
    }

    const niceSteps = [1, 2, 3, 5, 7, 10, 14, 21, 30];
    let stepDays = 7;
    for (const s of niceSteps) {
      if (spanDays / s <= maxTicks) {
        stepDays = s;
        break;
      }
    }
    const startDay = new Date(minMs);
    startDay.setUTCHours(12, 0, 0, 0);
    let t = startDay.getTime();
    while (t <= maxMs + 43200000) {
      if (t >= minMs - 43200000) {
        const clamped = Math.max(minMs, Math.min(maxMs, t));
        const x = xStart + ((clamped - minMs) / spanMs) * width;
        if (ticks.length === 0 || x - ticks[ticks.length - 1].x >= 68) {
          ticks.push({ x, label: formatTickDate(t, spanDays, crossesYear) });
        }
      }
      t += stepDays * 86400000;
    }
    return ticks;
  }

  function resolveCollisions(coords, minGap, xMin, xMax) {
    // Group by lane and gently separate overlapping same-lane points while preserving chronological order
    const n = coords.length;
    if (n <= 1) return coords;

    // First, enforce a tiny strictly-increasing horizontal order for identical timestamps so lines read cleanly
    for (let i = 1; i < n; i++) {
      if (coords[i].x <= coords[i - 1].x) {
        coords[i].x = coords[i - 1].x + 2.5;
      }
    }

    // Iterative relaxation for same-lane minimum clearance
    for (let iter = 0; iter < 40; iter++) {
      let moved = false;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (coords[i].laneIdx !== coords[j].laneIdx) continue;
          const dx = coords[j].x - coords[i].x;
          if (dx < minGap) {
            const push = (minGap - dx) / 2;
            coords[i].x -= push;
            coords[j].x += push;
            moved = true;
          }
        }
      }
      // Re-enforce left-to-right monotonic order lightly
      for (let i = 1; i < n; i++) {
        if (coords[i].x < coords[i - 1].x) {
          const mid = (coords[i].x + coords[i - 1].x) / 2;
          coords[i - 1].x = mid - 0.5;
          coords[i].x = mid + 0.5;
          moved = true;
        }
      }
      if (!moved) break;
    }

    // Rescale back into [xMin, xMax] if relaxation pushed past bounds
    let lo = Infinity;
    let hi = -Infinity;
    for (const c of coords) {
      if (c.x < lo) lo = c.x;
      if (c.x > hi) hi = c.x;
    }
    if (lo < xMin || hi > xMax) {
      const span = Math.max(1, hi - lo);
      const targetSpan = Math.max(1, xMax - xMin);
      for (const c of coords) {
        c.x = xMin + ((c.x - lo) / span) * targetSpan;
      }
    }
    return coords;
  }

  const THEMES = {
    light: {
      bg: "#F2F3EF",
      ink: "#1C2230",
      muted: "#545B69",
      rule: "#CBCEC6",
      gilt: "#9C762B",
      built: "#23443D",
      dotStroke: "#F2F3EF",
    },
    dark: {
      bg: "#15181D",
      ink: "#E6E5DE",
      muted: "#A3A8B2",
      rule: "#323741",
      gilt: "#C9A95E",
      built: "#6FA796",
      dotStroke: "#15181D",
    },
    transparent: {
      bg: "none",
      ink: "#1C2230",
      muted: "#545B69",
      rule: "#CBCEC6",
      gilt: "#9C762B",
      built: "#23443D",
      dotStroke: "#F2F3EF",
    },
  };

  function renderTimelineSVG(parsed, options) {
    const opts = Object.assign({
      spacing: "time",      // "time" | "even"
      theme: "light",       // "light" | "dark" | "transparent"
      standalone: true,     // true = downloadable SVG with <style>, bg, title, legend; false = inline interactive
      showMilestones: true,
      title: "",
      width: 980,
    }, options || {});

    const events = parsed.events || [];
    const lanes = parsed.lanes || [];
    if (events.length === 0 || lanes.length === 0) {
      return "";
    }

    const palette = THEMES[opts.theme] || THEMES.light;
    const width = opts.width;

    // Estimate left label column width from longest lane label
    const maxLabelChars = Math.max(10, ...lanes.map((l) => l.length));
    const labelWidth = Math.min(220, Math.max(136, Math.round(maxLabelChars * 8.2) + 24));
    const xAxisStart = labelWidth + 10;
    const xAxisEnd = width - 36;
    const xPlotStart = xAxisStart + 18;
    const xPlotEnd = xAxisEnd - 24;

    const topPad = opts.standalone ? 92 : 48;
    const laneGap = 44;
    const laneY = (idx) => topPad + idx * laneGap;
    const axisY = topPad + (lanes.length - 1) * laneGap + 24;
    const bottomPad = opts.standalone ? 84 : 44;
    const height = axisY + bottomPad;

    // Determine whether we can use time scaling
    const dated = events.filter((e) => e.ms != null);
    let minMs = Infinity;
    let maxMs = -Infinity;
    for (const e of dated) {
      if (e.ms < minMs) minMs = e.ms;
      if (e.ms > maxMs) maxMs = e.ms;
    }
    const useTimeScale = opts.spacing === "time" && dated.length >= 2 && maxMs > minMs;

    // Compute initial X positions
    const coords = events.map((ev, i) => {
      let x;
      if (useTimeScale) {
        let ms = ev.ms;
        if (ms == null) {
          // Interpolate between neighbors
          const prev = events.slice(0, i).reverse().find((p) => p.ms != null);
          const next = events.slice(i + 1).find((p) => p.ms != null);
          if (prev && next) ms = (prev.ms + next.ms) / 2;
          else if (prev) ms = prev.ms;
          else if (next) ms = next.ms;
          else ms = minMs;
        }
        x = xPlotStart + ((ms - minMs) / (maxMs - minMs)) * (xPlotEnd - xPlotStart);
      } else {
        x = events.length === 1
          ? (xPlotStart + xPlotEnd) / 2
          : xPlotStart + (i / (events.length - 1)) * (xPlotEnd - xPlotStart);
      }
      return {
        ev,
        x,
        laneIdx: lanes.indexOf(ev.lane),
        y: laneY(lanes.indexOf(ev.lane)),
      };
    });

    // Prevent overlapping circles on the same lane
    resolveCollisions(coords, 18.5, xPlotStart, xPlotEnd);

    // Axis ticks
    let ticks = [];
    if (useTimeScale) {
      ticks = buildTimeTicks(minMs, maxMs, xPlotStart, xPlotEnd);
    } else {
      const crossesYear = dated.length >= 2 &&
        new Date(minMs).getUTCFullYear() !== new Date(maxMs).getUTCFullYear();
      const formatEvenLabel = (ev) => {
        if (ev.ms != null && !ev.isBefore) {
          return formatTickDate(ev.ms, 30, crossesYear);
        }
        return ev.dateRaw.replace(/,\s*\d{1,2}:\d{2}.*$/, "").replace(/^Before\s+/i, "≤ ");
      };
      const maxTicks = Math.max(2, Math.floor((xPlotEnd - xPlotStart) / 95));
      const step = Math.max(1, Math.ceil(coords.length / maxTicks));
      for (let i = 0; i < coords.length; i += step) {
        const label = formatEvenLabel(coords[i].ev);
        const prev = ticks[ticks.length - 1];
        if (!prev || (coords[i].x - prev.x >= 68 && label !== prev.label)) {
          ticks.push({ x: coords[i].x, label });
        }
      }
      // Ensure last point has a tick if room and distinct from previous label
      const last = coords[coords.length - 1];
      const lastLabel = formatEvenLabel(last.ev);
      const prev = ticks[ticks.length - 1];
      if (prev && last.x - prev.x >= 72 && lastLabel !== prev.label) {
        ticks.push({ x: last.x, label: lastLabel });
      }
    }

    // Milestones (deduplicated so labels at top never overlap)
    const milestones = [];
    if (opts.showMilestones) {
      const seenLabels = new Set();
      for (const c of coords) {
        const label = c.ev.milestone;
        if (!label || seenLabels.has(label.toLowerCase())) continue;
        if (milestones.length > 0 && Math.abs(c.x - milestones[milestones.length - 1].x) < 62) {
          continue;
        }
        seenLabels.add(label.toLowerCase());
        milestones.push({ x: c.x, label });
      }
    }

    const chartTitle = opts.title || `How ${parsed.project} was made`;
    const descText = `Swimlane timeline for ${parsed.project}: ${lanes.join(", ")}. ${events.length} recorded events.`;

    const out = [];
    if (opts.standalone) {
      out.push(
        `<svg class="timeline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="group" aria-labelledby="ct-title ct-desc">`
      );
      out.push(`<title id="ct-title">${escapeXml(chartTitle)}</title>`);
      out.push(`<desc id="ct-desc">${escapeXml(descText)}</desc>`);
      out.push(`<style>`);
      if (palette.bg !== "none") out.push(`  .bg { fill: ${palette.bg}; }`);
      out.push(`  .title { fill: ${palette.ink}; font: 400 22px "IM Fell English", Georgia, "Times New Roman", serif; }`);
      out.push(`  .tl-lane, .tl-axis-line { stroke: ${palette.rule}; stroke-width: 1; }`);
      out.push(`  .tl-label { fill: ${palette.ink}; font: 500 13.5px "IBM Plex Sans", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }`);
      out.push(`  .tl-tick { stroke: ${palette.muted}; stroke-width: 1.5; }`);
      out.push(`  .tl-month, .leg { fill: ${palette.muted}; font: 400 12.5px "IBM Plex Sans", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }`);
      out.push(`  .tl-release { stroke: ${palette.gilt}; stroke-width: 1.5; stroke-dasharray: 3 4; }`);
      out.push(`  .tl-release-label { fill: ${palette.gilt}; font: 500 12.5px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace; }`);
      out.push(`  .tl-path { fill: none; stroke: ${palette.muted}; stroke-width: 2; stroke-linejoin: round; opacity: .5; }`);
      out.push(`  .tl-built { fill: ${palette.built}; stroke: ${palette.dotStroke}; stroke-width: 2.5; }`);
      out.push(`  .tl-reviewed { fill: ${palette.bg === "none" ? "#F2F3EF" : palette.bg}; stroke: ${palette.gilt}; stroke-width: 3; }`);
      out.push(`  .tl-approved { fill: ${palette.ink}; stroke: ${palette.dotStroke}; stroke-width: 2.5; }`);
      out.push(`</style>`);
      if (palette.bg !== "none") {
        out.push(`<rect class="bg" width="${width}" height="${height}" rx="6"/>`);
      }
      out.push(`<text class="title" x="24" y="40">${escapeXml(chartTitle)}</text>`);
    } else {
      out.push(
        `<svg class="timeline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="group" aria-label="${escapeXml(chartTitle)}" aria-describedby="gen-desc">`
      );
      out.push(`<desc id="gen-desc">${escapeXml(descText)}</desc>`);
    }

    // Swimlanes
    lanes.forEach((lane, idx) => {
      const y = laneY(idx);
      out.push(`<line class="tl-lane" x1="${xAxisStart}" y1="${y}" x2="${xAxisEnd}" y2="${y}"/>`);
      out.push(`<text class="tl-label" x="${xAxisStart - 10}" y="${(y + 4.5).toFixed(1)}" text-anchor="end">${escapeXml(lane)}</text>`);
    });

    // Axis & ticks
    out.push(`<line class="tl-axis-line" x1="${xAxisStart}" y1="${axisY}" x2="${xAxisEnd}" y2="${axisY}"/>`);
    for (const tk of ticks) {
      const x = tk.x.toFixed(1);
      out.push(
        `<line class="tl-tick" x1="${x}" y1="${axisY - 4}" x2="${x}" y2="${axisY + 4}"/>` +
        `<text class="tl-month" x="${x}" y="${axisY + 20}" text-anchor="middle">${escapeXml(tk.label)}</text>`
      );
    }

    // Handoff polyline
    if (coords.length >= 2) {
      const pts = coords.map((c) => `${c.x.toFixed(1)},${c.y}`).join(" ");
      out.push(`<polyline class="tl-path" points="${pts}"/>`);
    }

    // Milestones
    const releaseTop = topPad - 20;
    for (const ms of milestones) {
      const x = ms.x.toFixed(1);
      out.push(`<line class="tl-release" x1="${x}" y1="${releaseTop}" x2="${x}" y2="${axisY}"/>`);
      out.push(`<text class="tl-release-label" x="${x}" y="${releaseTop - 9}" text-anchor="middle">${escapeXml(ms.label)}</text>`);
    }

    // Marks
    for (let i = 0; i < coords.length; i++) {
      const c = coords[i];
      const ev = c.ev;
      const x = c.x;
      const y = c.y;
      const xf = x.toFixed(1);
      const summary = `${ev.dateRaw}. ${ev.builderRaw}, ${ev.role}. ${ev.shortWhat || "Update."} Model: ${ev.model}.${ev.surface ? " " + ev.surface + "." : ""}`;

      let mark;
      if (ev.kind === "approved") {
        const r = 7.5;
        mark = `<path class="tl-approved" d="M${xf} ${(y - r).toFixed(1)} L${(x + r).toFixed(1)} ${y} L${xf} ${(y + r).toFixed(1)} L${(x - r).toFixed(1)} ${y} Z"/>`;
      } else if (ev.kind === "reviewed") {
        mark = `<circle class="tl-reviewed" cx="${xf}" cy="${y}" r="5.5"/>`;
      } else {
        mark = `<circle class="tl-built" cx="${xf}" cy="${y}" r="7"/>`;
      }

      if (opts.standalone) {
        out.push(`<g><title>${escapeXml(summary)}</title>${mark}</g>`);
      } else {
        // Compute safe invisible hit radius so it never covers a neighbor
        let nearest = 999;
        for (let j = 0; j < coords.length; j++) {
          if (i === j) continue;
          const dist = Math.hypot(x - coords[j].x, y - coords[j].y);
          if (dist < nearest) nearest = dist;
        }
        const hitR = Math.min(15, Math.max(7.5, nearest / 2 - 0.5)).toFixed(1);
        out.push(
          `<g class="pt" tabindex="0" role="img" aria-label="${escapeXml(summary)}" ` +
          `data-when="${escapeXml(ev.dateRaw)}" data-who="${escapeXml(ev.builderRaw)}" ` +
          `data-role="${escapeXml(ev.role)}" data-what="${escapeXml(ev.shortWhat)}" ` +
          `data-model="${escapeXml(ev.model)}" data-where="${escapeXml(ev.surface)}">` +
          `${mark}<circle cx="${xf}" cy="${y}" r="${hitR}" fill="transparent"/></g>`
        );
      }
    }

    // Legend & timezone footer for standalone SVG
    if (opts.standalone) {
      const legY = height - 24;
      out.push(`<circle class="tl-built" cx="31" cy="${legY - 4}" r="6.5" style="stroke-width:0"/><text class="leg" x="44" y="${legY}">Built</text>`);
      out.push(`<circle class="tl-reviewed" cx="109" cy="${legY - 4}" r="5.5"/><text class="leg" x="122" y="${legY}">Reviewed or researched</text>`);
      out.push(`<path class="tl-approved" d="M305 ${legY - 11} L312 ${legY - 4} L305 ${legY + 3} L298 ${legY - 4} Z" style="stroke-width:0"/><text class="leg" x="318" y="${legY}">Approved, deployed, or proposed</text>`);
      if (milestones.length > 0) {
        out.push(`<line class="tl-release" x1="566" y1="${legY - 12}" x2="566" y2="${legY + 4}"/><text class="leg" x="577" y="${legY}">Milestone</text>`);
      }
      const rightNote = parsed.timezone ? `Dates: ${parsed.timezone}` : "colophon.md";
      out.push(`<text class="leg" x="${xAxisEnd}" y="${legY}" text-anchor="end">${escapeXml(rightNote)}</text>`);
    }

    out.push(`</svg>`);
    return out.join("\n");
  }

  return {
    parseColophon,
    renderTimelineSVG,
    normalizeBuilder,
  };
});

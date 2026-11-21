import ColophonTimeline from "../../../timeline.js";

const VALID_SLUG = /^[A-Za-z0-9_.-]{1,100}$/;
const VALID_BRANCH = /^[A-Za-z0-9_./-]{1,100}$/;
const VALID_PATH = /^[A-Za-z0-9_./-]{1,160}\.md$/i;
const MAX_MD_BYTES = 256 * 1024;

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function errorSvg(message, theme) {
  const dark = theme === "dark";
  const bg = theme === "transparent" ? "none" : (dark ? "#15181D" : "#F2F3EF");
  const ink = dark ? "#E6E5DE" : "#1C2230";
  const muted = dark ? "#A3A8B2" : "#545B69";
  const rule = dark ? "#323741" : "#CBCEC6";
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 112" width="640" height="112" role="img" aria-label="${escapeXml(message)}">`,
    bg !== "none" ? `<rect width="640" height="112" rx="6" fill="${bg}" stroke="${rule}" stroke-width="1"/>` : "",
    `<text x="24" y="44" fill="${ink}" font-family="Georgia, serif" font-size="20">COLOPHON.md</text>`,
    `<text x="24" y="76" fill="${muted}" font-family="-apple-system, Segoe UI, Helvetica, Arial, sans-serif" font-size="14">${escapeXml(message)}</text>`,
    `</svg>`,
  ].filter(Boolean).join("\n");
}

function svgResponse(body, status, cacheControl) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function onRequestGet(context) {
  const { params, request } = context;
  const url = new URL(request.url);

  const rawOwner = String(params.owner || "");
  const rawRepo = String(params.repo || "").replace(/\.svg$/i, "");

  const themeParam = (url.searchParams.get("theme") || "light").toLowerCase();
  const theme = ["light", "dark", "transparent"].includes(themeParam) ? themeParam : "light";
  const spacingParam = (url.searchParams.get("spacing") || "time").toLowerCase();
  const spacing = spacingParam === "even" ? "even" : "time";
  const showMilestones = url.searchParams.get("milestones") !== "0";
  const includeOrigins = url.searchParams.get("origins") === "1";

  if (!VALID_SLUG.test(rawOwner) || !VALID_SLUG.test(rawRepo) || rawOwner.includes("..") || rawRepo.includes("..")) {
    return svgResponse(errorSvg("Invalid repository name.", theme), 400, "public, max-age=60");
  }

  const branchParam = url.searchParams.get("branch");
  if (branchParam && (!VALID_BRANCH.test(branchParam) || branchParam.includes(".."))) {
    return svgResponse(errorSvg("Invalid branch name.", theme), 400, "public, max-age=60");
  }

  const pathParam = url.searchParams.get("path") || "COLOPHON.md";
  if (!VALID_PATH.test(pathParam) || pathParam.includes("..") || pathParam.startsWith("/")) {
    return svgResponse(errorSvg("Invalid file path (must be a relative .md file).", theme), 400, "public, max-age=60");
  }

  const branches = branchParam ? [branchParam] : ["HEAD", "main", "master"];
  let markdown = null;

  const encodedPath = pathParam.split("/").map(encodeURIComponent).join("/");
  for (const ref of branches) {
    const encodedRef = ref.split("/").map(encodeURIComponent).join("/");
    const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(rawOwner)}/${encodeURIComponent(rawRepo)}/${encodedRef}/${encodedPath}`;
    try {
      const res = await fetch(rawUrl, {
        headers: { "User-Agent": "colophon.md-svg/1.0" },
        cf: { cacheTtl: 600, cacheEverything: true },
      });
      if (res.ok) {
        const text = await res.text();
        if (text.length <= MAX_MD_BYTES) {
          markdown = text;
          break;
        }
        return svgResponse(errorSvg("COLOPHON.md is too large to render.", theme), 413, "public, max-age=300");
      }
    } catch {
      // Try next branch
    }
  }

  if (!markdown) {
    return svgResponse(
      errorSvg(`Could not find ${pathParam} in ${rawOwner}/${rawRepo}.`, theme),
      404,
      "public, max-age=120"
    );
  }

  const parsed = ColophonTimeline.parseColophon(markdown, { includeOrigins });
  if (parsed.events.length === 0) {
    return svgResponse(
      errorSvg(`No Builder history rows found in ${rawOwner}/${rawRepo}/${pathParam}.`, theme),
      422,
      "public, max-age=120"
    );
  }

  const svg = ColophonTimeline.renderTimelineSVG(parsed, {
    spacing,
    theme,
    standalone: true,
    showMilestones,
  });

  return svgResponse(svg, 200, "public, max-age=600, stale-while-revalidate=3600");
}

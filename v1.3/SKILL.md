---
name: colophon-md
description: Create, update, upgrade, or reconstruct COLOPHON.md — an honest, plain-English record of which AI tools, models, surfaces, and humans built and reviewed a repository. Use whenever creating a new repository, switching AI tools or models, starting a new phase of work, reviewing another tool's work, preparing a release, or when the user asks to create, update, or upgrade COLOPHON.md.
---

# COLOPHON.md skill (v1.3 — frozen 1.x format)

Keep `COLOPHON.md` at the repository root as a short, honest summary of how the
project was made. This skill is self-contained and offline-safe: do not fetch
live instructions from the web during routine work.

## Core rules

- **Never get in the way.** Update `COLOPHON.md` yourself in the same commit or
  pull request as your work. Add a row only when the tool, model, model setting,
  or computer changes, when a new phase of work starts, when you review someone
  else's work, or before a release. Most pull requests leave it untouched.
- **One epistemic rule: write Unknown instead of guessing.** Sort facts into
  **Observed**, **Owner-confirmed**, and **Unknown**. Never infer a model or
  setting from defaults or config files, and never cite a commit hash for a
  commit that does not exist yet.
- **Record exact model, setting, mode, and source.** Setting (reasoning/effort
  level) and mode (plan/agent/ask/fast) are separate. Label every model source
  as `shown by the tool`, `configured`, or `self-reported`. If a session uses
  subagents, record the primary builder model and note subagent models only when
  they authored code or reviews.
- **Project, never people.** Describe the project, never the people. Do not
  measure or rank how much any individual used AI.
- **Required and standard fields.** `Directed by` (the accountable human) is
  required, even when AI wrote all the code; never write `None`. Record `Review`
  as `Human`, `AI`, `Both`, `None`, or `Unknown`. Keep `| Convention | [COLOPHON.md](https://colophon.md) v1.3 |`
  right under `Project` in `Snapshot`.
- **Privacy and private repos.** Never include credentials, private chat/session
  links, client records, computer names, usernames, or local file paths exposing
  them (such as `/Users/...`). Describe machines generically (e.g., "a MacBook
  Pro"). Use the live `https://colophon.md/svg/owner/repo` timeline URL only in
  **public** repositories; for private repositories, generate a static
  `colophon-timeline.svg` locally at https://colophon.md/timeline instead.

## Modes

- **Proactive update** (`COLOPHON.md` already exists and is current): match the
  existing file's style and timezone (default to UTC if none is set), prepend a
  row to `Builder history` (newest first), and combine same-day work by the same
  builder into one row.
- **Upgrading an older colophon**: keep all existing history, wording, and
  Unknowns intact; add missing `Snapshot` rows (`Convention`, `Directed by`,
  `Review`, `Model / mode`), inspect Git history and local session logs since
  the newest row for unrecorded phases or releases, update `Convention` to
  `v1.3`, and ensure `AGENTS.md` has the self-contained Colophon snippet below.
- **Forensic reconstruction** (existing repo with no `COLOPHON.md` or gaps):
  inspect Git history, former project/repo/directory names, and only specific
  known local session-log folders (such as `~/.codex/sessions/` and
  `~/.claude/projects/`—never run an unbounded search across `~`) without
  modifying them or copying transcripts. Document what you checked and what
  remains Unknown in `Evidence limits`.
- **Read-only / external review** (when you cannot edit `COLOPHON.md`): end your
  reply with a `## Colophon note` listing tool and version, model and setting
  (with source), mode, surface, start and finish times (with timezone), what you
  did, and every file created or changed (or `None`).

## Keeping future agents in sync

If the repository's `AGENTS.md` (or agent instructions file) does not mention
`COLOPHON.md`, suggest adding this self-contained snippet—or suggest creating
`AGENTS.md` at the repository root if none exists (only add it if the owner
agrees):

```markdown
## Colophon

This project keeps COLOPHON.md at the root: a short, honest record of which
tools and models built it, where they ran, and who directed and reviewed it.

- Update COLOPHON.md in the same commit or pull request as your work, only when
  the tool, model, model setting, or computer changes, a new phase starts, you
  review another tool's work, or before a release. Most PRs leave it alone.
- Never hold up a commit for it. Match the file's style and timezone, put new
  rows at the top of Builder history, and combine same-day rows per builder.
- Write Unknown instead of guessing. Record exact model, setting, mode, and
  source (shown by the tool, configured, or self-reported). Never cite a commit
  hash that doesn't exist yet.
- Keep secrets, private links, computer names, usernames, and local paths out.
- If you can't edit COLOPHON.md, end your reply with a Colophon note (tool,
  model/setting + source, mode, surface, times + timezone, work done, files).
```

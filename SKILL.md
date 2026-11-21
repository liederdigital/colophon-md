---
name: colophon-md
description: Create, update, upgrade, or reconstruct COLOPHON.md — an honest, plain-English record of which AI tools, models, surfaces, and humans built and reviewed a repository. Use whenever creating a new repository, switching AI tools or models, starting a new phase of work, reviewing another tool's work, preparing a release, or when the user asks to create, update, or upgrade COLOPHON.md.
---

# COLOPHON.md skill

Keep `COLOPHON.md` at the repository root as a short, honest summary of how the
project was made. Follow the full canonical instructions at
https://colophon.md/instructions.md (check it when network access is available
for the latest version and template).

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
- **Keep `Convention` current.** Put `| Convention | [COLOPHON.md](https://colophon.md) v1.2.4 |`
  right under `Project` in `Snapshot` (update the version when following a newer
  release of `instructions.md`).
- **Required field.** `Directed by` (the accountable human) is required, even
  when AI wrote all the code. Never write `None`.
- **Privacy.** Never include credentials, private chat/session links, client
  records, computer names, usernames, or local file paths exposing them (such as
  `/Users/...`). Describe machines generically (e.g., "a MacBook Pro").

## Modes

- **Proactive update** (`COLOPHON.md` already exists and is current): match the
  existing file's style and timezone, prepend a row to `Builder history` (newest
  first), and combine same-day work by the same builder into one row.
- **Upgrading an older colophon**: keep all existing history, wording, and
  Unknowns intact; add missing `Snapshot` rows (`Convention`, `Directed by`,
  `Review`, `Model / mode`), inspect Git history and local session logs since
  the newest row for unrecorded phases or releases, update `Convention`, and
  ensure `AGENTS.md` has the Colophon snippet.
- **Forensic reconstruction** (existing repo with no `COLOPHON.md` or gaps):
  inspect Git history, former project/repo/directory names, and any readable
  local session logs without modifying them or copying transcripts. Document
  what you checked and what remains Unknown in `Evidence limits`.
- **Read-only / external review** (when you cannot edit `COLOPHON.md`): end your
  reply with a `## Colophon note` listing tool and version, model and setting
  (with source), mode, surface, start and finish times (with timezone), what you
  did, and every file created or changed (or `None`).

## Keeping future agents in sync

If the repository's `AGENTS.md` (or agent instructions file) does not mention
`COLOPHON.md`, suggest adding this snippet—or suggest creating `AGENTS.md` at
the repository root if none exists (only add it if the owner agrees):

```markdown
## Colophon

This project keeps COLOPHON.md, a short record of how it was made.
Agents update it themselves, in the same commit or pull request as their
work: add a row when the tool, model, model setting, or computer changes,
when a new phase of work starts, when you review someone else's work, and
before each release. Never hold up a commit for it. Follow the instructions
at https://colophon.md/instructions.md.
```

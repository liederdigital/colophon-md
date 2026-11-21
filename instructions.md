# COLOPHON.md: instructions for AI agents

Create or update `COLOPHON.md` at the repository root: a short, honest record of
which tools and models built the project, where they ran, what each contributed,
and who directed and reviewed it.

Version 1.3 (November 21, 2026) — frozen `1.x` format. Pinned copy:
https://colophon.md/v1.3/instructions.md. Public domain (CC0 1.0). For forensic
reconstruction of an older repo, upgrading legacy files, or timeline embeds, see
`guide.md` (https://colophon.md/v1.3/guide.md).

## Core principles

- **Scope:** Context files (`AGENTS.md`, `CLAUDE.md`, rules) describe what tools
  were told to do; `COLOPHON.md` records what they actually did. Keep licenses
  and dependency notices in their own files.
- **Project, never people:** Describe the project, never the people. Don't
  record, measure, or rank how much any individual used AI.
- **The one rule:** Sort every fact into **Observed** (seen directly in this
  session, files, or history), **Owner-confirmed** (stated by the accountable
  human), or **Unknown**. Write **Unknown** instead of guessing.

## Keeping COLOPHON.md current

- **Never get in the way.** Update `COLOPHON.md` yourself in the same commit or
  pull request as your work. Never hold up a commit, merge, or release for it.
- **Summary, not a log.** Add a row only when the tool, model, model setting, or
  computer changes, when a new phase of work starts, when you review another
  tool's work, or before a release. Most pull requests leave it untouched.
- **Format and ordering.** For a new file, adapt the template below and omit
  sections that don't apply. For an existing file, match its style and timezone
  (use UTC if none is set), put new rows at the top of `Builder history` (newest
  first), and combine same-day work by the same builder into one row.
- **Exact model, setting, mode, and source.** Record model name and version,
  setting (reasoning or effort level), and tool mode (such as plan, agent, ask,
  or fast) separately. Label each model value's source: `shown by the tool`,
  `configured`, or `self-reported` (not Observed). Never infer a model from
  defaults or config files. In multi-model or subagent sessions, record the
  primary builder model and note subagent models only when they authored code or
  reviews.
- **Required and standard fields.** `Directed by` (the accountable human) is
  required even when AI wrote all the code; never write `None`. Record `Review`
  as `Human`, `AI`, `Both`, `None`, or `Unknown`. Name release versions (e.g.,
  `v1.2`) in the row that covers them.
- **Evidence and history.** Cite commits, paths, pull requests, or
  `Owner-confirmed`, but never cite a commit hash for a commit that doesn't
  exist yet. Keep earlier history intact; record later confirmations as a new
  row or correction instead of silently rewriting history.
- **Privacy.** Omit credentials, private chat/session links, client records,
  computer names, usernames, and local paths that expose them (like
  `/Users/...`). Describe machines generically (for example, "a MacBook Pro").
- **Asking the owner.** Ask at most one short yes-or-no question, and only if
  the answer would materially change attribution. Otherwise write **Unknown**,
  save the file, and tell the owner what remains Unknown.

## When you can't edit the file

If you can't or shouldn't edit `COLOPHON.md` (such as a read-only review or a
chat without repo access), end your reply with a Colophon note so whoever keeps
the file can copy it into a row:

```markdown
## Colophon note

- Tool and version: {as shown by the tool, or Unknown}
- Model and setting: {model, version, and reasoning level, with source: shown by the tool, configured, or self-reported; or Unknown}
- Mode: {plan, agent, ask, fast, or similar; or Unknown}
- Surface: {desktop app / browser or cloud workspace / CLI / IDE extension / hosted agent}
- Started and finished: {date and time, with time zone}
- What I did: {reviewed, researched, or built; and what, such as a commit range or file}
- Files created or changed: {every one, including scratch files; or None}
```

## Keeping future agents in sync

If the repository's `AGENTS.md` (or agent instructions file) doesn't mention
`COLOPHON.md`, suggest adding this self-contained snippet—or creating
`AGENTS.md` at the root if none exists. Add it only if the owner agrees:

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

## Versioning

The `1.x` format is frozen: wording clarifications don't bump the version, and
published version URLs never change. See `CHANGELOG.md` for version history.

## Template

```markdown
# Colophon

How this repository was made: which tools did the work, where they ran, what
each contributed, and who directed it. License and third-party notices live
elsewhere.

## Snapshot

| | |
|---|---|
| Project | {project name, plus former repo or working names if renamed} |
| Convention | [COLOPHON.md](https://colophon.md) v1.3 |
| Primary builder | {tool, or Unknown} |
| Surface | {desktop app / browser or cloud workspace / CLI / IDE extension / hosted agent, or Unknown} |
| Model / mode | {model and setting, plus the tool's mode if it has one, each with its source: shown by the tool, configured, or self-reported; or Unknown} |
| Editor | {editor, or Unknown} |
| Review | {Human / AI / Both / None / Unknown}, {who or what reviewed, if known} |
| Directed by | {the accountable human; required even when AI did all the work; never None, and Unknown only if truly unknown} |
| Human owner | {name}, {direction / review / testing role, only as established} |
| Era | {first date} to {latest date} ({timezone}) |
| Status | {active / maintained / archived} |

## How the work was done

{Two to four sentences: how the owner directed the work, which tools wrote what,
and how changes were reviewed, tested, or deployed, only as far as established.}

## Builder history (newest first)

| Date | Builder | Role | Surface | Model / mode | Contribution | Evidence |
|---|---|---|---|---|---|---|
| {YYYY-MM-DD} | {tool or person} | {built / reviewed / tested / approved / deployed} | {surface} | {model, version, and setting, plus mode if any (source), or Unknown} | {phase, scope, or release} | {commits, paths, PRs, or Owner-confirmed} |

## Evidence limits

{What was inspected, and what remains Unknown.}
```

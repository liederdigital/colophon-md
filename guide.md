# COLOPHON.md: full guide (forensic reconstruction, upgrades, and edge cases)

This guide expands on the core instructions in `instructions.md` for
reconstructing history after the fact, upgrading an older `COLOPHON.md`,
handling evidence traps, and embedding a timeline chart.

Format 1.x (frozen at v1.3). This living guide holds editorial clarifications
and examples for `1.x`; the immutable v1.3 snapshot is at
https://colophon.md/v1.3/guide.md. Public domain (CC0 1.0).

## Forensic reconstruction (existing repositories)

When a repository already has history and no colophon—or its colophon has
gaps—rebuild the record from evidence.

### Where to look

1. **Repository files:** Read `AGENTS.md` (or other agent instructions), any
   existing `COLOPHON.md`, `README.md`, history documents, and enough of the Git
   history and diffs to see the main phases of work.
2. **Former names:** Check early commits, `README` history, and package or
   project files for former project, repository, or directory names. Coding
   agents often index local session logs by the folder path or repo slug in use
   at the time, so searching only for the current name can miss earlier
   sessions. Record former names in the Snapshot `Project` field and note the
   rename in the Builder history row where it happened.
3. **Local session logs:** Look only in specific known session-log directories
   that coding agents saved on this computer, if you can read them (for example,
   Codex keeps sessions under `~/.codex/sessions/` and Claude Code under
   `~/.claude/projects/`). Never run an unbounded search across the home
   directory. Read logs without changing them, and never copy transcript text
   into the colophon.
4. **Line-level attribution and trailers:** If the repository has line-level
   attribution (such as Git AI or Agent Trace records) or commit trailers (such
   as `Co-Authored-By` or `Assisted-by`), use them as evidence and cite them.
   The colophon summarizes those records; it doesn't replace them.

Session logs stay on the computer where the work happened. Say in **Evidence
limits** which computers and tools you checked, and tell the owner that running
the same pass on their other computers may fill more gaps. Expect more
**Unknown** values than in a colophon kept as you go; that is normal.

### Evidence traps to avoid

- **Dates never come from model memory.** Always take dates from Git, session
  logs, or the system clock—never from an AI model's own sense of the date.
  Models routinely hallucinate the wrong year (for example, writing `2025` for
  a `2026` commit using a model that didn't exist in `2025`).
- A commit's author is the Git identity that made the commit, not necessarily
  the person or tool that wrote the change.
- A missing AI trailer (`Co-Authored-By`, `Assisted-by`) does not prove a human
  wrote the change alone.
- A tool's config file (`AGENTS.md`, `CLAUDE.md`, `.cursor/`, editor settings)
  shows the tool was set up, not that it was used.
- A linked repository, or another project's colophon, is not evidence about
  this one.
- Session logs on one computer say nothing about work done on another.
- Do not infer an exact model or setting from a list of available models, a
  default preference, or another project's colophon. Record a model only with
  its source (`shown by the tool`, `configured`, or `self-reported`) or as
  confirmed by the owner.
- Owning a repository does not make someone the author of its code. Describe the
  owner's direction, review, testing, and deployment only as far as the evidence
  supports.

### Naming surfaces, tools, models, and modes

Name the surface where each tool ran as precisely as you can: desktop app,
browser or cloud workspace, command line (CLI), IDE extension, or a hosted agent
on a code platform. A desktop agent that runs shell commands is still a desktop
agent, not a separate CLI tool.

Keep tools, models, settings, modes, surfaces, and editors separate:

- **Tool version string:** When available, record the tool's own reported
  version (for example, from `claude --version` or the tool's About panel)
  instead of a vague label—stripping any usernames or hostnames.
- **Model:** exact name and version.
- **Setting:** how hard the model was told to think (reasoning, thinking, or
  effort level, such as `high` or `xhigh`).
- **Mode:** how the tool itself ran, if it has modes (such as `plan`, `agent`,
  `ask`, or `fast`).
- **Source:** `shown by the tool` (interface, logs, or commit trailer),
  `configured` (setting or config file), or `self-reported` (the model named
  itself—not Observed).

Don't claim a complete list of builders when you only know one session or phase.

### Toolkits and templates

If the repository is a toolkit or template, keep the toolkit's own history
separate from products built with it.

## Upgrading an older COLOPHON.md

When an existing `COLOPHON.md` follows an older version of the convention (or
has no `Convention` row yet):

1. Keep all existing history, wording, and Unknowns intact.
2. Add any missing `Snapshot` rows (such as `Convention`, `Directed by`,
   `Review`, or `Model / mode`).
3. Check Git history and local session logs since the newest Builder history row
   for any unrecorded phases, model switches, or releases.
4. Update `Convention` to `[COLOPHON.md](https://colophon.md) v1.3`.
5. Check that `AGENTS.md` exists and includes the self-contained Colophon
   snippet from `instructions.md` (with no live remote URL fetch).
6. Keep the file's existing timezone convention unless converting to UTC. If you
   convert to UTC, leave rows with no backing commit in their original timezone
   (and note their UTC date as Unknown), and do not rewrite dates quoted inside
   older Corrections.

## Roles, releases, and corrections

- Give each row a role in a word or two: `built`, `reviewed`, `tested`,
  `approved`, or `deployed`.
- When you review work another tool or model built, add a `reviewed` row naming
  what you reviewed (a pull request or commit range) and your model.
- Approvals usually show in Git already because a merge records who merged it;
  fill them in at your next update instead of asking.
- When a release is prepared (version bump, tag, release branch, or owner says
  so), name the release version (for example, `v1.1.8`) in the row that covers
  it. Once the release commit or tag exists (never before—do not cite a hash
  that doesn't exist yet), tie the release row to its tag or commit hash in the
  `Evidence` column.
- When later confirmation settles an earlier `Unknown`, add a note under
  `## Corrections` or a new row instead of silently rewriting history as if it
  had always been known.

## Writing useful prose and optional fields

- **Concrete human direction:** In `How the work was done`, prefer specific
  human contributions (architecture choices, bug reports, acceptance checks, or
  key feedback) over generic labels like "direction, approval."
- **Plain-English accountability:** If it helps readers—especially clients,
  buyers, or students—include a clear accountability sentence matching
  `Directed by`, for example: *"The maintainers remain responsible for the
  published code, including any errors that made it through review."*
- **Optional `Verified by` row:** The template is a starting point; you can add
  a `Verified by` row to `Snapshot` when useful to record how changes were
  checked (automated test suite, preview screenshots, manual QA, or `Unknown`).

## Scope: forks, translations, vendored code, and automated tools

- **What a colophon does not cover:** A colophon covers only this repository's
  own work—not upstream dependencies, vendored code, or Git submodules. Do not
  copy a course repository's or starter template's `COLOPHON.md` as provenance
  for a student assignment or downstream project.
- **Forks and translations:** Link to the upstream `COLOPHON.md` (if one
  exists) and start a fresh `Builder history` for your own work instead of
  copying upstream rows or omitting the upstream link.
- **Automated non-AI tools:** Dependency bots (Dependabot, Renovate),
  formatters (Prettier, Black), linters, and deterministic code generators are
  not builders in `Builder history`. Mention them once in `How the work was
  done` (or `Snapshot`) if they matter to how the repository is maintained.

## Embedding a timeline chart

For **public** repositories only, you can embed an auto-updating swimlane
timeline just above `## Snapshot` in `COLOPHON.md` (and optionally in
`README.md`):

```html
<a href="https://colophon.md/timeline?repo=OWNER/REPO"><picture><source media="(prefers-color-scheme: dark)" srcset="https://colophon.md/svg/OWNER/REPO?theme=dark"><source media="(prefers-color-scheme: light)" srcset="https://colophon.md/svg/OWNER/REPO"><img alt="Timeline of how PROJECT was made" src="https://colophon.md/svg/OWNER/REPO"></picture></a>
```

For **private** repositories, never use the live `/svg/` URL. Generate a static
`colophon-timeline.svg` locally in your browser at https://colophon.md/timeline
(nothing is sent to a server) and commit that file instead.

## Scope and boundaries

- Stay within what you were asked to do. Commit, push, or open a pull request
  only if the owner has already allowed it.
- Don't change licenses, repository visibility, dependencies, or unrelated files
  while documenting how the project was made.
- For a client's private project, leave it to the owner and the client whether
  `COLOPHON.md` is published.
- Optionally add a one-line link from `README.md` to `COLOPHON.md`. Keep the
  detail in the colophon.

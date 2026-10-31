# COLOPHON.md: instructions for AI agents

Follow these instructions to create or update `COLOPHON.md`, a short record of
how a repository was made: which tools did the work, where they ran, what each
contributed, and who directed it.

Version 1.0, published October 30, 2026. The convention lives at
https://github.com/liederdigital/colophon-md and is in the public domain
(CC0 1.0).

## What a colophon is for

A colophon answers five questions for the next person who opens the repository:

1. Which tools and models built this?
2. Where did they run?
3. When did each one start and stop?
4. What did each one contribute?
5. Who directed or reviewed the work?

Like the credits at the end of a film, it lists everyone and everything
involved. Like a maintenance log, it lets someone trace a problem, or an
improvement, back to the tools and models in use at the time: for example,
seeing that a weaker release followed a switch to a different model.

It is not a license, a dependency list, or a list of contributors. Keep license
and third-party notices in their own files.

Save it as `COLOPHON.md` at the repository root, unless the project already
uses another name for this record or the owner asks for one.

## Never get in the way

A colophon must never slow down a commit or a pull request. If keeping it
becomes a chore, people stop keeping it. So the agent doing the work keeps it:

- Update `COLOPHON.md` yourself, in the same commit or pull request as the
  work it describes.
- Fill in everything you can observe. Never ask the owner to type an entry.
- When something needs the owner, ask one yes-or-no question with your best
  evidence already filled in. If there's no answer, write Unknown and carry on.
- Don't hold up a commit, a merge, or a release waiting on the colophon.

A person reviewing the pull request sees the colophon change next to the code,
so approving the pull request approves the entry. There is no separate
sign-off.

## Keep it current, or reconstruct it

A colophon is either kept as the work happens or reconstructed afterward.
Decide which one applies before you start; a project can need both.

**Keeping it current.** When the project is new, or its colophon is up to
date, record what you can observe in this session: your tool, where you are
running, and your model if you can see it. Add a row whenever the tool, model,
model setting, or computer changes, or a new phase of work starts. Don't add a
row for every commit; a colophon is a summary, not a log.

Record the exact model name and version, and any setting such as a reasoning
level, exactly as the tool shows them, along with the date of every switch.
That precision is what lets someone line up a problem with the model that was
in use when it was introduced. Git already records when each commit happened;
the colophon records which model was active then.

Before each release, check the file and name the release version (for example,
v1.1.8) in the row that covers it, so releases can be compared with model
switches.

If the repository's agent instructions (such as `AGENTS.md`) don't mention
`COLOPHON.md`, suggest adding these lines, and add them only if the owner
agrees:

```markdown
## Colophon

This project keeps COLOPHON.md, a short record of how it was made.
Agents update it themselves, in the same commit or pull request as their
work: add a row when the tool, model, model setting, or computer changes,
when you review someone else's work, and before each release. Never hold
up a commit for it. Follow the instructions at
https://colophon-md.pages.dev/instructions.md.
```

**Reconstructing it.** When the project already has history and no colophon,
or the colophon has gaps, rebuild the record from evidence. Besides Git
history, look for session logs that coding agents saved on this computer, if
you are able to read them (for example, Codex keeps sessions under
`~/.codex/sessions/` and Claude Code under `~/.claude/projects/`). Read them
without changing them, and don't copy transcript text into the colophon.

Session logs stay on the computer where the work happened. Say in "Evidence
limits" which computers and tools you checked, and tell the owner that running
the same pass on their other computers may fill more gaps. Expect more
Unknowns than in a colophon kept as you go; that is normal.

## Gather the record

Read the repository's instructions for agents (such as `AGENTS.md`), any
existing colophon, the README, any history documents, and enough of the Git
history and diffs to see the main phases of work. Use what the owner tells you
in the conversation. A complete forensic audit is not needed; say what you
inspected.

Sort every fact into one of three kinds:

- **Observed**: you saw it directly, in this session or in the files and
  history you inspected.
- **Owner-confirmed**: the human owner told you. Label the important ones.
- **Unknown**: not established. Write "Unknown". Never fill in a plausible
  guess.

Watch for these traps:

- A commit's author is the Git identity that made the commit, not necessarily
  the person or tool that wrote the change.
- A missing AI trailer (such as `Co-Authored-By` or `Assisted-by`) does not
  prove a human wrote the change alone.
- A tool's config file (`AGENTS.md`, `CLAUDE.md`, `.cursor/`, editor settings)
  shows the tool was set up, not that it was used.
- A linked repository, or another project's colophon, is not evidence about
  this one.
- Session logs on one computer say nothing about work done on another.
- Do not infer an exact model or setting from a list of available models, a
  default preference, or a commit signature. Record a model only when it was
  observed in the session or confirmed by the owner.

Name the surface where each tool ran as precisely as you can: desktop app,
browser or cloud workspace, command line (CLI), IDE extension, or a hosted
agent on a code platform. A desktop agent that runs shell commands is still a
desktop agent, not a separate CLI tool. Keep tools, models, surfaces, and
editors separate. Record known switches and their dates. Don't claim a complete
list of builders when you only know one session or phase.

## Write or update the file

For a new file, adapt the template at the end of these instructions. It shows
the shape of the output; it is not a form the owner must fill in. Replace each
placeholder with evidence or "Unknown", and leave out sections that don't
apply. When a colophon already exists, match its style instead of replacing it
with the template.

Include:

- a short snapshot table,
- two to four sentences on how the work was done,
- a builder history, newest first,
- the limits of your evidence.

Add a history row for a new builder, a change of surface, model, or model
setting, a review, a release, or a meaningful phase of work, not for every
small edit. Cite commit hashes, paths, pull requests, or "Owner-confirmed" as
evidence. If the repository is a toolkit
or template, keep the toolkit's own history separate from products built with
it.

Give each row a role in a word or two: built, reviewed, tested, approved, or
deployed. When you review work that another tool or model built, add a
"reviewed" row that names what you reviewed (a pull request or a range of
commits) and your model. Approvals usually show in Git already, because a merge
records who merged it; fill them in at your next update instead of asking.

Write dates in the project's timezone (follow the repository's convention, or
ask the owner). Don't substitute the clock of the machine you are running on.
Don't cite a commit hash for the commit that will contain your own edit; it
doesn't exist yet. The commit that created the file can be found later with
`git log -- COLOPHON.md`.

Keep older history. When a new confirmation settles an earlier Unknown, add a
correction or a new row instead of silently rewriting history as if it had
always been known.

Describe the owner's direction, review, testing, and deployment only as far as
the evidence supports. Don't say the owner reviewed every change unless that
was established. Owning a repository does not make someone the author of its
code.

When information is incomplete, still write a useful file. Ask the owner one
short question only if the answer would materially change the attribution;
otherwise record Unknown and finish.

## Before you finish

- Check dates, names, and references against what you inspected.
- Remove any leftover placeholders.
- Note in "Evidence limits" which version of these instructions you followed
  (for example, "COLOPHON.md instructions v1.0").
- Keep out credentials, private session or chat links, client or customer
  records, signing secrets, and unrelated personal details.
- Optionally add a one-line link from the README to `COLOPHON.md`. Keep the
  detail in the colophon.

Save the file and tell the owner what remains Unknown.

Stay within what you were asked to do. Commit, push, or open a pull request only
if the owner has already allowed it. Don't change licenses, repository
visibility, dependencies, or unrelated files while documenting how the project
was made.

## Template

```markdown
# Colophon

How this repository was made: which tools did the work, where they ran, what
each contributed, and who directed it. License and third-party notices live
elsewhere.

## Snapshot

| | |
|---|---|
| Project | {project name} |
| Primary builder | {tool, or Unknown} |
| Surface | {desktop app / browser or cloud workspace / CLI / IDE extension / hosted agent, or Unknown} |
| Model / mode | {model and setting, as observed or owner-confirmed, or Unknown} |
| Editor | {editor, or Unknown} |
| Human owner | {name}, {direction / review / testing role, only as established} |
| Era | {first date} to {latest date} ({timezone}) |
| Status | {active / maintained / archived} |

## How the work was done

{Two to four sentences: how the owner directed the work, which tools wrote what,
and how changes were reviewed, tested, or deployed, only as far as established.}

## Builder history (newest first)

| Date | Builder | Role | Surface | Model / mode | Contribution | Evidence |
|---|---|---|---|---|---|---|
| {YYYY-MM-DD} | {tool or person} | {built / reviewed / tested / approved / deployed} | {surface} | {model, version, and setting, or Unknown} | {phase, scope, or release} | {commits, paths, PRs, or Owner-confirmed} |

## Evidence limits

{What was inspected, and what remains Unknown.}
```

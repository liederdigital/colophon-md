# Changelog

The `COLOPHON.md` file format is frozen for `1.x`. Wording clarifications,
examples, and editorial fixes do not change the version number. Breaking format
changes—if any are ever needed—would be `2.0`.

Published version snapshots (such as `/v1.3/instructions.md`) are immutable and
never change after release.

## 1.3 (November 21, 2026)

- Frozen `1.x` format and explicit versioning policy.
- Made the `AGENTS.md` snippet, `SKILL.md`, and Colophon note prompt completely
  self-contained (no live remote URL fetches by agents).
- Added immutable versioned snapshots under `/v1.3/` (`instructions.md`,
  `template.md`, `guide.md`, `SKILL.md`).
- Split the instructions into a lean core spec (`instructions.md`, ~1,180 words
  including the template and copyable snippets—down from ~3,550 words) and a
  separate full guide (`guide.md`) for forensic reconstruction, upgrading older
  colophons, and timeline SVG embeds, with version history moved here to
  `CHANGELOG.md`.

SHA-256 checksums for the immutable `/v1.3/` files:

```text
226e857a58760457d0206c9358bfa7153d3ea7c0d7300f74bb77bea47db7aa9b  v1.3/instructions.md
6c2b187dca849fe0c6d5cf317cd270460f8355d861213b46bebd84e7f5dc15b7  v1.3/template.md
64f383be9b5fc6666eb4e71eaf4fc6225e846d4f9ad892fbbfa4e8855c79c6ad  v1.3/guide.md
e84b89f936abc9a5d47698dc53635a54f2fe18868fa052e9556cec9add9e13df  v1.3/SKILL.md
```

## 1.2.4 (November 20, 2026)

- Added explicit guidance for upgrading an older `COLOPHON.md` to the current
  format without rewriting existing history or Unknowns, while catching up
  unrecorded phases and syncing `AGENTS.md`.

## 1.2.3 (November 20, 2026)

- Moved the instructions version out of the bottom of `Evidence limits` into a
  `Convention` row at the top of `Snapshot` (linked to https://colophon.md), so
  anyone opening a `COLOPHON.md` can see at a glance which version of the
  convention it follows.

## 1.2.2 (November 20, 2026)

- Added a short "Quick rules (proactive update)" summary at the top of
  `instructions.md`, a rule for multi-model and subagent sessions, and an
  explicit reminder to strip local file paths that expose usernames.

## 1.2.1 (November 19, 2026)

- Check early commits and project files for former project, repository, or
  directory names so forensic passes don't miss local session logs indexed under
  an older folder path or repo slug; record former names in the Snapshot
  `Project` field and note the rename in Builder history.

## 1.2 (November 13, 2026)

- Added the Colophon note for work done where the colophon can't be edited,
  such as a review in another tool.
- Defined setting (reasoning/effort level) and mode (how the tool ran) as
  separate things.
- Suggested creating `AGENTS.md` when a repository has no agent instructions
  file.

## 1.1.2 (October 31, 2026)

- Clarified that most pull requests leave the colophon untouched; add a row
  only for a change of tool, model, setting, or computer, a new phase of work,
  a review, or a release. Added new phases of work to the `AGENTS.md` snippet.

## 1.1.1 (October 31, 2026)

- Made `Directed by` required for the accountable human.
- Added a note that context files and shared prompts describe what tools were
  told to do, while the colophon records what they actually did.

## 1.1 (October 31, 2026)

- Added the rule that a colophon describes the project, never the people.
- Added a `Review` field (`Human`, `AI`, `Both`, `None`, or `Unknown`).
- Made "write Unknown and keep going" the default, with asking the owner as the
  exception. Named proactive and forensic modes.

## 1.0 (October 30, 2026)

- First public version.

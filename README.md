# COLOPHON.md

**Current version: v1.2.4** (November 20, 2026) · [colophon.md](https://colophon.md) · [Instructions](instructions.md) · [Template](template.md) · [Skill](SKILL.md) · [Timeline generator](https://colophon.md/timeline)

A credits file for AI-built code: a short, honest record of which tools and
models built a project, when, where they ran, and who signed off. When
something breaks months later, it tells you where to look.

<a href="https://colophon.md/timeline?repo=liederdigital/colophon-md"><picture><source media="(prefers-color-scheme: dark)" srcset="https://colophon.md/svg/liederdigital/colophon-md?theme=dark&amp;origins=1"><source media="(prefers-color-scheme: light)" srcset="https://colophon.md/svg/liederdigital/colophon-md?origins=1"><img alt="Timeline of how colophon-md was made" src="https://colophon.md/svg/liederdigital/colophon-md?origins=1"></picture></a>

Books have always had a colophon, the note at the back that tells you how the
book was made. `COLOPHON.md` does the same for a repository, so whoever
inherits it (a client, the next developer, or you in a year) doesn't have to
guess.

## Add one to your project

Start one when you create the repository. It takes a minute on day one.
Reconstructing this repository's own history afterward took an evening, three
AI tools, and a lot of digging (see [`COLOPHON.md`](COLOPHON.md)).

- **Ask your agent.** Give it [`instructions.md`](instructions.md), or tell it:
  *"Read https://colophon.md/instructions.md and follow it to create or update
  COLOPHON.md for this repository."*
- **Write it yourself.** Copy [`template.md`](template.md) to your repository
  root as `COLOPHON.md` and fill it in.
- **Keep it current.** Add the short Colophon snippet from `instructions.md` to
  your `AGENTS.md` (create one at the repository root if you don't have it), or
  install [`SKILL.md`](SKILL.md) once in your agent's skills folder.
  Every agent then updates the file itself, in the same commit
  or pull request as its work, and approving the pull request approves the
  entry. Nobody fills in a form, and nothing waits on it.

Like the credits at the end of a film, it lists everyone and everything
involved. Like a maintenance log, it lets you trace a bug, or a weaker release,
back to the models in use at the time.

Already have a project with history? The same instructions cover forensic
mode: reconstructing a colophon from Git history and the session logs your agents
saved. Those logs stay on each computer, so run it on every computer you used.

The one rule: write **Unknown** instead of guessing.

## How it's different

AI declaration files, such as AI-DECLARATION.md, state how much AI was
involved, as a single level. Line-by-line tools, such as Agent Trace and Git AI,
record which lines an agent wrote. Commit trailers like `Co-Authored-By` name
the tool on each commit, but they're optional and often turned off.

COLOPHON.md is the readable summary on top of those records: which tools and
models did the work, where, in what role, and who signed off. Agents cite
commit trailers, Git AI, and Agent Trace records as evidence where they exist,
and fill in the gaps where they don't. It also works after the fact.

The current instructions are version 1.2.4 (November 20, 2026); see the
[version history](instructions.md#version-history) for what changed. Each
project's `COLOPHON.md` records the version it follows in its `Snapshot` table
(`Convention | [COLOPHON.md](https://colophon.md) v1.2.4`) so you can spot
older files at a glance.

## What's in this repository

| File | What it is |
|---|---|
| `index.html` | The website: one static page, no build step |
| `timeline.html`, `timeline.js` | Browser-based `COLOPHON.md` → swimlane timeline SVG generator (zero dependencies) |
| `functions/svg/[owner]/[repo].js` | Cloudflare Pages Function that renders a live `image/svg+xml` timeline at `/svg/owner/repo` |
| `instructions.md` | Tool-neutral instructions for AI agents |
| `template.md` | The blank template |
| `SKILL.md` | Drop-in agent skill for Claude Code, Codex, Cursor, Antigravity, and other skill-aware tools |
| `COLOPHON.md` | How this repository was made |
| `AGENTS.md` | Notes for agents working on this repository |
| `CONTRIBUTING.md` | How to suggest a change or add your project |
| `_headers` | Cloudflare Pages headers so `.md` files display as plain text |
| `fonts/` | Self-hosted IM Fell English and IBM Plex fonts |
| `og.png` | The image shown when the site is shared on social media |
| `favicon.ico`, `favicon.svg`, `favicon-96.png`, `apple-touch-icon.png` | The site icon, as real files so search engines can find it |
| `colophon-timeline.svg` | A timeline of how COLOPHON.md itself was made, shown in `COLOPHON.md` |

## Live timeline SVG

Generate a swimlane chart from any `COLOPHON.md` at
https://colophon.md/timeline, or embed an auto-updating chart for any public
GitHub repository:

```markdown
[![Colophon timeline](https://colophon.md/svg/owner/repo)](https://colophon.md/timeline?repo=owner/repo)
```

Optional query parameters: `theme=light|dark|transparent`,
`spacing=time|even`, `milestones=0`, `origins=1`, `branch=...`, and
`path=...` (relative `.md` path, defaults to `COLOPHON.md`).

## Deploying

It's a static site with no build step. On Cloudflare Pages, connect this
repository and use:

- Framework preset: None
- Build command: *(leave blank)*
- Build output directory: `/`

To preview locally, open `index.html` in a browser, or run `npx serve` in this
folder so the copy button can load `instructions.md`.

## Contributing

Ideas and fixes are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

The instructions, template, and site are dedicated to the public domain under
[CC0 1.0](LICENSE): use, copy, and change them, no attribution required. The
fonts in `fonts/` are under the SIL Open Font License; see the license files in
that folder.

Live at https://colophon.md. Started by
[Ron Stauffer](https://github.com/ronstauffer) of
[Lieder Digital](https://liederdigital.com).

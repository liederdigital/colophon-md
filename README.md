# COLOPHON.md

**Format v1.3 (frozen 1.x · November 21, 2026)** · [colophon.md](https://colophon.md) · [Core instructions](instructions.md) · [Full guide](guide.md) · [Template](template.md) · [Skill](SKILL.md) · [Changelog](CHANGELOG.md) · [Timeline generator](https://colophon.md/timeline)

A credits file for AI-built code: a short, honest record of which tools and
models built a project, where they ran, and who signed off — built for client
handoffs, codebase due diligence, and whoever inherits the repo next.

<a href="https://colophon.md/timeline?repo=liederdigital/colophon-md"><picture><source media="(prefers-color-scheme: dark)" srcset="https://colophon.md/svg/liederdigital/colophon-md?theme=dark&amp;origins=1"><source media="(prefers-color-scheme: light)" srcset="https://colophon.md/svg/liederdigital/colophon-md?origins=1"><img alt="Timeline of how colophon-md was made" src="https://colophon.md/svg/liederdigital/colophon-md?origins=1"></picture></a>

Books have always had a colophon, the note at the back that tells you how the
book was made. `COLOPHON.md` does the same for a repository, so a client taking
delivery, a buyer checking a codebase, the next engineer, or you a year from now
doesn't have to guess.

## Add one to your project

Start one when you create the repository. It takes a minute on day one.
Reconstructing this repository's own history afterward took an evening, three
AI tools, and a lot of digging (see [`COLOPHON.md`](COLOPHON.md)).

- **Keep it local and self-contained (recommended).** Install [`SKILL.md`](SKILL.md)
  in your agent's skills folder, or copy [`instructions.md`](instructions.md)
  into your session. Add the self-contained Colophon snippet from
  `instructions.md` to your `AGENTS.md` (create one at the repository root if
  you don't have it). Neither `SKILL.md` nor the `AGENTS.md` snippet tells your
  agent to fetch instructions from a live web page.
- **One-time pinned URL prompt.** If you want an agent with web access to
  bootstrap a colophon once, point it at an immutable version URL (published
  version URLs never change):
  *"Read https://colophon.md/v1.3/instructions.md and follow it to create or
  update COLOPHON.md for this repository."*
- **Write it yourself.** Copy [`template.md`](template.md) to your repository
  root as `COLOPHON.md` and fill it in.

Once set up, agents update `COLOPHON.md` in the same commit or pull request as
their work, and approving the pull request approves the entry. Nobody fills in
a form, and nothing waits on it.

Already have a project with history? Read [`guide.md`](guide.md) (pinned at
`https://colophon.md/v1.3/guide.md`) for forensic mode: reconstructing a
colophon from Git history and the session logs your agents saved, upgrading an
older file, or embedding a timeline chart.

The one rule: write **Unknown** instead of guessing.

## Stability and versioning

The `1.x` format is frozen at `v1.3`. Clarifying edits and examples do not bump
the format version; any future breaking format change would be `2.0`. Published
version snapshots under `/v1.3/` are immutable and never change after release.
See [`CHANGELOG.md`](CHANGELOG.md) for the full version history.

## How it's different

AI declaration files, such as AI-DECLARATION.md, state how much AI was
involved, as a single level. Line-by-line tools, such as Agent Trace and Git AI,
record which lines an agent wrote. Commit trailers like `Co-Authored-By` name
the tool on each commit, but they're optional and often turned off.

COLOPHON.md is the readable summary on top of those records: which tools and
models did the work, where, in what role, and who signed off. Agents cite
commit trailers, Git AI, and Agent Trace records as evidence where they exist,
and fill in the gaps where they don't. It also works after the fact.

## What's in this repository

| File | What it is |
|---|---|
| `index.html` | The website: one static page, no build step |
| `timeline.html`, `timeline.js` | Browser-based `COLOPHON.md` → swimlane timeline SVG generator (zero dependencies) |
| `functions/svg/[owner]/[repo].js` | Cloudflare Pages Function that renders a live `image/svg+xml` timeline at `/svg/owner/repo` |
| `instructions.md` | Lean, tool-neutral core instructions for AI agents |
| `guide.md` | Full guide for forensic reconstruction, upgrades, evidence traps, and timeline embeds |
| `template.md` | The blank template |
| `SKILL.md` | Self-contained, offline-safe agent skill for skill-aware tools |
| `v1.3/` | Immutable published snapshot of `instructions.md`, `template.md`, `guide.md`, and `SKILL.md` |
| `CHANGELOG.md` | Versioning policy and release history |
| `COLOPHON.md` | How this repository was made |
| `AGENTS.md` | Notes for agents working on this repository |
| `CONTRIBUTING.md` | How to suggest a change or add your project |
| `_headers` | Cloudflare Pages headers so `.md` files display as plain text and `/v1.3/*` is cached as immutable |
| `fonts/` | Self-hosted IM Fell English and IBM Plex fonts |
| `og.png` | The image shown when the site is shared on social media |
| `favicon.ico`, `favicon.svg`, `favicon-96.png`, `apple-touch-icon.png` | The site icon, as real files so search engines can find it |
| `colophon-timeline.svg` | Static launch-day timeline SVG (September 28 to October 30, 2026) |

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

The instructions, guide, template, and site are dedicated to the public domain
under [CC0 1.0](LICENSE): use, copy, and change them, no attribution required.
The fonts in `fonts/` are under the SIL Open Font License; see the license
files in that folder.

Live at https://colophon.md. Started by
[Ron Stauffer](https://github.com/ronstauffer) of
[Lieder Digital](https://liederdigital.com).

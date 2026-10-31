# COLOPHON.md

A credits file for AI-built code: a short, honest record of which tools and
models built a project, when, where they ran, and who signed off. When
something breaks months later, it tells you where to look.

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
  your `AGENTS.md`. Every agent then updates the file itself, in the same commit
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

The current instructions are version 1.1 (October 31, 2026).

## What's in this repository

| File | What it is |
|---|---|
| `index.html` | The website: one static page, no build step |
| `instructions.md` | Tool-neutral instructions for AI agents |
| `template.md` | The blank template |
| `COLOPHON.md` | How this repository was made |
| `AGENTS.md` | Notes for agents working on this repository |
| `_headers` | Cloudflare Pages headers so `.md` files display as plain text |
| `fonts/` | Self-hosted IM Fell English and IBM Plex fonts |
| `og.png` | The image shown when the site is shared on social media |
| `favicon.ico`, `favicon.svg`, `favicon-96.png`, `apple-touch-icon.png` | The site icon, as real files so search engines can find it |
| `colophon-timeline.svg` | A timeline of how COLOPHON.md itself was made, shown in `COLOPHON.md` |

## Deploying

It's a static site with no build step. On Cloudflare Pages, connect this
repository and use:

- Framework preset: None
- Build command: *(leave blank)*
- Build output directory: `/`

To preview locally, open `index.html` in a browser, or run `npx serve` in this
folder so the copy button can load `instructions.md`.

## License

The instructions, template, and site are dedicated to the public domain under
[CC0 1.0](LICENSE): use, copy, and change them, no attribution required. The
fonts in `fonts/` are under the SIL Open Font License; see the license files in
that folder.

Live at https://colophon.md. Started by
[Ron Stauffer](https://github.com/ronstauffer) of
[Lieder Digital](https://liederdigital.com).

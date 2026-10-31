# COLOPHON.md

A simple, open convention for recording how a software project was made:
which AI tools built it, where they ran, what each contributed, and who
directed the work.

Books have always had a colophon, the note at the back that tells you how the
book was made. `COLOPHON.md` does the same for a repository, so whoever
inherits it (a client, the next developer, or you in a year) doesn't have to
guess.

## Add one to your project

- **Ask your agent.** Give it [`instructions.md`](instructions.md), or tell it:
  *"Read instructions.md from github.com/liederdigital/colophon-md and follow
  it to create COLOPHON.md for this repository."*
- **Write it yourself.** Copy [`template.md`](template.md) to your repository
  root as `COLOPHON.md` and fill it in.

The one rule: write **Unknown** instead of guessing.

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

Started by Ron Stauffer of [Lieder Digital](https://liederdigital.com).

# Notes for agents

- This is a static site: no build step, no dependencies. Serve the folder with
  any static server (for example `npx serve`) to preview it.
- The Template section of `instructions.md` must match `template.md` exactly.
  Change both together.
- Published version directories (such as `v1.3/`) are immutable: never edit a
  published version folder after release.
- Keep `instructions.md` and `guide.md` tool-neutral. Product names are fine as
  examples, but no rule should depend on one vendor's tool.
- `index.html` loads `instructions.md` at runtime for the copy button, and
  links to `template.md` for the download. Keep those paths stable.
- Write in plain English, sentence case, active voice.
- When you make a meaningful change, update `COLOPHON.md` by following
  `instructions.md`.



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

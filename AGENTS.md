# Notes for agents

- This is a static site: no build step, no dependencies. Serve the folder with
  any static server (for example `npx serve`) to preview it.
- The Template section of `instructions.md` must match `template.md` exactly.
  Change both together.
- Keep `instructions.md` tool-neutral. Product names are fine as examples, but
  no rule should depend on one vendor's tool.
- `index.html` loads `instructions.md` at runtime for the copy button, and
  links to `template.md` for the download. Keep those paths stable.
- Write in plain English, sentence case, active voice.
- When you make a meaningful change, update `COLOPHON.md` by following
  `instructions.md`.

# Phase 0 Verification Notes

Date: July 25, 2026

## Verified baseline

- Runtime: Node.js 24
- Package manager: npm 11
- Build system: Vite 8 with React and TypeScript
- Elements package: `@unlayer/react-elements` pinned to `0.1.20`
- React compatibility: the installed Elements package declares React 18 or
  newer as its peer range

## Design foundation

The project is for operations and communications teams managing a fictional
portable power-bank recall. The application's single job is to turn one
incident record into coordinated customer, retailer, and public notices.

Initial tokens:

| Role | Value |
| --- | --- |
| Ink | `#111820` |
| Paper | `#F4F6F5` |
| Surface | `#FFFFFF` |
| Critical | `#D92D20` |
| Warning | `#E6A700` |
| Safe/confirmed | `#007C78` |
| Muted | `#66716F` |
| Line | `#D9DEDC` |

The signature element is the **batch plate**: a high-contrast identifier block
inspired by physical product labels. It will carry the affected batch, model,
and recall ID across all three channels.

## Elements constraints confirmed

- Use `Email`, `Document`, and `Page` as the mode-specific roots.
- A `Row` must be a direct child of a root.
- Only `Column` elements may be direct children of a `Row`.
- The number of columns must match the selected `ColumnLayouts` value.
- Content items belong inside columns and should not contain nested Elements
  items.
- Pass the root element directly to `renderToHtml` and `renderToJson`.
- When a factory function returns the root, call the function before passing
  the result to a renderer.
- `fontFamily` uses an object with `label` and `value`.
- Font weights are numbers; dimensions and spacing use strings with units.
- Rich inline text belongs in the `html` prop on `Paragraph`.
- Use `Heading` for prominent identifiers and numbers.
- `renderToHtml` returns a complete standalone HTML document.
- `renderToJson` returns editor-compatible design JSON.

## Spike architecture

- Each output has a dedicated root factory.
- The factories use the same fictional incident constants but have
  channel-specific layouts.
- The app generates HTML and JSON once and previews the HTML inside isolated
  iframes.
- HTML and JSON can be downloaded directly from the browser.
- The document output is loaded into a temporary print-only iframe so
  application chrome is excluded from printing.

## Phase 0 acceptance checks

- [ ] Email HTML renders and downloads.
- [ ] Email JSON renders and downloads.
- [ ] Document HTML renders in the preview.
- [ ] Document print action opens the browser print workflow.
- [ ] Document JSON renders and downloads.
- [ ] Page HTML renders responsively.
- [ ] Page JSON renders and downloads.
- [ ] TypeScript passes.
- [ ] Lint passes.
- [ ] Production build passes.
- [ ] Git repository is initialized on `main`.

The checklist will be updated only after the corresponding runtime or command
has been verified.

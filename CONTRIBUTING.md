# Contributing

## Development setup

```bash
bun install
bun dev
```

## Quality checks

```bash
bun run lint
bun run build
```

## Recommended workflow

1. Create a branch from `main`
2. Implement changes in small, focused commits
3. Run quality checks
4. Push and open a PR

## Tech stack

- Bun
- Vite 8
- TypeScript 6
- React 19
- Tailwind CSS 4
- Lucide React

## Architecture

State is owned entirely by `App.tsx` and flows down as props.
`ColoredIconPicker` and `ColorTargetControl` are fully controlled components.

### Source files

- Entry: `src/app/App.tsx`
- Component: `src/components/colored-icon-picker/ColoredIconPicker.tsx`
- Demo wrapper: `src/components/colored-icon-picker/ColoredIconPickerDemo.tsx`
- Color utilities: `src/components/colored-icon-picker/color.ts`
- Icon registry: `src/components/colored-icon-picker/icons.ts`
- Class helper: `src/lib/cn.ts`
- Tokens + resets: `src/index.css`

### Styling

The component uses Tailwind CSS 4 utility classes throughout.
Shadcn design tokens (`--background`, `--foreground`, `--border`, etc.) are defined as CSS
custom properties in `src/index.css` and mapped to Tailwind color utilities via `@theme inline`.
Day/night theme is toggled by `data-theme="night"` on the `.app-shell` element, which overrides
the token values---no Tailwind `dark:` variants are needed.

### Color modes

`colorTarget` controls whether the chosen color is applied to the icon
foreground or the container background.
In `background` mode, `getReadableIconColor` computes WCAG relative luminance
and picks `#000000` or `#ffffff` for the icon automatically.

### Hex input

The hex input uses a local draft state (`hexDraftState`) to allow partial
typing without clobbering the last valid color.
`displayedHex` resolves to the draft when the draft's resolved color matches
the current prop, and falls back to the prop otherwise (e.g., after a swatch
click).

## Commit format

Conventional Commits are enforced by hook:

- `type: Subject line`
- Subject in imperative mood, capitalized, no period, max 50 chars
- Body line length max 72 chars
- Blank line between subject and body
- Allowed types:
  - `fix`
  - `feat`
  - `build`
  - `chore`
  - `ci`
  - `docs`
  - `style`
  - `refactor`
  - `perf`
  - `test`
  - `revert`
  - `ops`
  - `improve`

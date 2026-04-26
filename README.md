# Colored Icon Picker

A combined icon and color picker React component distributed as a shadcn registry component.
One trigger button opens a popover for selecting both an icon and a color.

## Install

```bash
bunx shadcn@latest add https://andistech.github.io/colored-icon-picker/r/colored-icon-picker.json
```

## Features

- Single trigger opens a combined icon + color picker popover
- 1,600+ Lucide icons across 30+ categories with search and category nav
- Color selection via system color wheel, hex input, and preset swatches
- Hex input with clipboard copy and invalid-state feedback
- Two color application modes: icon foreground or background
- WCAG-based automatic black/white contrast when coloring a background
- Auto-positioning popover with 12 explicit placement options
- Day/night theme support via shadcn CSS custom properties

## Local development

```bash
bun install
bun dev
```

### Quality checks

```bash
bun run lint
bun run build
```

## Tech stack

- Bun
- Vite 8
- TypeScript 6
- React 19
- Tailwind CSS 4
- Lucide React

## Project structure

```
src/
  app/App.tsx                            # Root state and layout
  components/colored-icon-picker/
    ColoredIconPicker.tsx                # Picker component + ColorTargetControl
    ColoredIconPickerDemo.tsx            # Demo wrapper with preview and settings
    color.ts                             # Hex validation and WCAG luminance
    icons.ts                             # Icon registry (1,600+ Lucide icons)
  lib/cn.ts                             # clsx + tailwind-merge helper
  index.css                              # shadcn tokens and global resets
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

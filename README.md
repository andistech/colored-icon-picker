# Colored Icon Picker

A combined icon and color picker React component.
One trigger button opens a popover for selecting both an icon and a color.

## Features

- Single trigger opens a combined icon + color picker popover
- Color selection via system color wheel, hex input, and preset swatches
- Hex input with clipboard copy and invalid-state feedback
- Searchable icon grid (20 Lucide icons)
- Two color application modes: icon foreground or background
- WCAG-based automatic black/white contrast when coloring a background
- Day/night theme support

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
- Lucide React

## Project structure

```
src/
  app/App.tsx                            # Root state and layout
  components/colored-icon-picker/
    ColoredIconPicker.tsx                # Picker component + ColorTargetControl
    ColoredIconPickerDemo.tsx            # Demo wrapper with preview and settings
    color.ts                             # Hex validation and WCAG luminance
    icons.ts                             # Icon registry (20 Lucide icons)
  index.css                              # All styles and CSS custom properties
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

import { type CSSProperties, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { ColoredIconPicker, ColorTargetControl, type PopoverPlacement } from '../components/colored-icon-picker/ColoredIconPicker';
import { ColoredIconPickerDemo } from '../components/colored-icon-picker/ColoredIconPickerDemo';
import { getReadableIconColor, type ColorTarget, type ThemeMode } from '../components/colored-icon-picker/color';
import { getIconOption } from '../components/colored-icon-picker/icons';

const bgExamples = [
  { iconKey: 'sparkles', color: '#6366f1', label: 'Analytics' },
  { iconKey: 'rocket', color: '#ef4444', label: 'Launches' },
  { iconKey: 'heart', color: '#ec4899', label: 'Feedback' },
  { iconKey: 'star', color: '#f59e0b', label: 'Roadmap' },
  { iconKey: 'shield', color: '#14b8a6', label: 'Security' },
  { iconKey: 'zap', color: '#84cc16', label: 'Automations' },
];

const iconColorExamples = [
  { iconKey: 'globe', color: '#6366f1', label: 'Websites' },
  { iconKey: 'layers', color: '#ef4444', label: 'Design' },
  { iconKey: 'bookmark', color: '#ec4899', label: 'Saved' },
  { iconKey: 'bell', color: '#f59e0b', label: 'Alerts' },
  { iconKey: 'flame', color: '#14b8a6', label: 'Trending' },
  { iconKey: 'target', color: '#84cc16', label: 'Goals' },
];

export default function App() {
  const [iconKey, setIconKey] = useState('sparkles');
  const [color, setColor] = useState('#14b8a6');
  const [colorTarget, setColorTarget] = useState<ColorTarget>('background');
  const [themeMode, setThemeMode] = useState<ThemeMode>('day');
  const [placement, setPlacement] = useState<PopoverPlacement>('auto');

  const iconModeBackgroundColor = themeMode === 'day' ? '#ffffff' : '#1f2937';
  const nextThemeMode = themeMode === 'day' ? 'night' : 'day';

  return (
    <main className="w-[min(1120px,calc(100%-48px))] mx-auto py-14 pb-24 text-foreground max-sm:w-[calc(100%-32px)] max-sm:py-8 max-sm:pb-16" data-theme={themeMode}>
      <header className="mb-12 pb-10 border-b border-border">
        <nav className="flex items-center gap-2 mb-5 text-muted-foreground text-[0.8125rem]" aria-label="Breadcrumb">
          <span>Components</span>
          <span className="text-border select-none" aria-hidden="true">/</span>
          <span>colored-icon-picker</span>
        </nav>
        <h1 className="m-0 mb-3 text-[clamp(1.875rem,5vw,2.625rem)] font-bold tracking-[-0.03em] leading-[1.1] text-foreground">Colored Icon Picker</h1>
        <p className="max-w-[600px] m-0 mb-5 text-muted-foreground text-base leading-[1.65]">
          A combined icon and color picker in a single popover. Ships 1,600+ categorized Lucide icons
          with category browsing, search, hex color input, and dark mode.
        </p>
        <div className="flex flex-wrap gap-[6px]">
          <span className="inline-flex items-center h-[22px] px-2 bg-secondary text-secondary-foreground text-[0.72rem] font-semibold tracking-[0.02em] border border-border rounded-full">Component</span>
          <span className="inline-flex items-center h-[22px] px-2 bg-secondary text-secondary-foreground text-[0.72rem] font-semibold tracking-[0.02em] border border-border rounded-full">lucide-react</span>
          <span className="inline-flex items-center h-[22px] px-2 bg-secondary text-secondary-foreground text-[0.72rem] font-semibold tracking-[0.02em] border border-border rounded-full">React 19</span>
          <span className="inline-flex items-center h-[22px] px-2 bg-secondary text-secondary-foreground text-[0.72rem] font-semibold tracking-[0.02em] border border-border rounded-full">shadcn</span>
        </div>
      </header>

      <div className="border border-border rounded-lg">
        <div className="flex items-center justify-between gap-4 px-3 py-1 bg-card border-b border-border rounded-t-lg">
          <div className="flex gap-[2px]" role="tablist">
            <button type="button" role="tab" aria-selected={true} className="h-8 px-3 text-[0.8125rem] font-medium text-muted-foreground bg-transparent border-0 rounded-md transition-colors duration-[120ms] aria-selected:text-foreground disabled:opacity-40 disabled:cursor-not-allowed">
              Preview
            </button>
            <button type="button" role="tab" aria-selected={false} className="h-8 px-3 text-[0.8125rem] font-medium text-muted-foreground bg-transparent border-0 rounded-md transition-colors duration-[120ms] aria-selected:text-foreground disabled:opacity-40 disabled:cursor-not-allowed" disabled>
              Code
            </button>
          </div>
          <div className="flex items-center gap-2">
            <ColorTargetControl value={colorTarget} onChange={setColorTarget} />
            <button
              type="button"
              className="inline-grid place-items-center w-8 h-8 text-foreground bg-background border border-border rounded-md transition-colors duration-[120ms] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Switch to ${nextThemeMode} mode`}
              onClick={() => setThemeMode(nextThemeMode)}
            >
              {themeMode === 'day'
                ? <Moon aria-hidden="true" size={15} />
                : <Sun aria-hidden="true" size={15} />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-60 px-10 py-12 bg-background bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:16px_16px] rounded-b-lg">
          <ColoredIconPicker
            iconKey={iconKey}
            color={color}
            colorTarget={colorTarget}
            iconModeBackgroundColor={iconModeBackgroundColor}
            placement={placement}
            onIconChange={setIconKey}
            onColorChange={setColor}
          />
        </div>
      </div>

      <section className="mt-12 pt-10 border-t border-border">
        <h2 className="m-0 mb-5 text-[1.375rem] font-semibold tracking-[-0.02em] text-foreground">Installation</h2>
        <div className="px-6 py-5 bg-[#09090b] text-[#e4e4e7] rounded-lg font-mono text-[0.8125rem] leading-[1.7] overflow-x-auto flex items-center gap-[10px] py-[14px]">
          <span className="text-[#52525b] select-none">$</span>
          <span>npx shadcn@latest add https://andistech.github.io/colored-icon-picker/r/colored-icon-picker.json</span>
        </div>
      </section>

      <section className="mt-12 pt-10 border-t border-border">
        <h2 className="m-0 mb-5 text-[1.375rem] font-semibold tracking-[-0.02em] text-foreground">Usage</h2>
        <div className="px-6 py-5 bg-[#09090b] text-[#e4e4e7] rounded-lg font-mono text-[0.8125rem] leading-[1.7] overflow-x-auto">
          <pre className="m-0">{`import { ColoredIconPicker } from "@/components/ui/colored-icon-picker"

export function MyComponent() {
  const [iconKey, setIconKey] = useState("sparkles")
  const [color, setColor] = useState("#14b8a6")

  return (
    <ColoredIconPicker
      iconKey={iconKey}
      color={color}
      colorTarget="background"
      iconModeBackgroundColor="#ffffff"
      onIconChange={setIconKey}
      onColorChange={setColor}
    />
  )
}`}</pre>
        </div>
      </section>

      <section className="mt-12 pt-10 border-t border-border">
        <h2 className="m-0 mb-5 text-[1.375rem] font-semibold tracking-[-0.02em] text-foreground">Examples</h2>

        <div className="mt-8 first:mt-0">
          <h3 className="m-0 mb-2 text-base font-semibold text-foreground">Background color</h3>
          <p className="m-0 mb-4 text-muted-foreground text-[0.9375rem] leading-[1.65]">
            Color is applied to the icon container background. The icon stroke automatically
            adapts for WCAG-compliant contrast.
          </p>
          <div className="flex flex-wrap gap-4">
            {bgExamples.map(({ iconKey: key, color: c, label }) => {
              const { Icon } = getIconOption(key);
              const fg = getReadableIconColor(c);
              return (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div
                    className="inline-grid place-items-center w-12 h-12 border border-border rounded-md"
                    style={{ color: fg, backgroundColor: c, borderColor: c } as CSSProperties}
                  >
                    <Icon aria-hidden="true" size={28} strokeWidth={2.25} />
                  </div>
                  <span className="text-[0.75rem] text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 first:mt-0">
          <h3 className="m-0 mb-2 text-base font-semibold text-foreground">Icon color</h3>
          <p className="m-0 mb-4 text-muted-foreground text-[0.9375rem] leading-[1.65]">
            Color is applied directly to the icon stroke against a neutral container background.
          </p>
          <div className="flex flex-wrap gap-4">
            {iconColorExamples.map(({ iconKey: key, color: c, label }) => {
              const { Icon } = getIconOption(key);
              return (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div
                    className="inline-grid place-items-center w-12 h-12 border border-border rounded-md"
                    style={{ color: c, backgroundColor: 'var(--background)', borderColor: 'var(--border)' } as CSSProperties}
                  >
                    <Icon aria-hidden="true" size={28} strokeWidth={2.25} />
                  </div>
                  <span className="text-[0.75rem] text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 first:mt-0">
          <h3 className="m-0 mb-2 text-base font-semibold text-foreground">Interactive demo</h3>
          <p className="m-0 mb-4 text-muted-foreground text-[0.9375rem] leading-[1.65]">
            Full workbench to explore icon and color combinations with live state inspection.
          </p>
          <ColoredIconPickerDemo
            iconKey={iconKey}
            color={color}
            colorTarget={colorTarget}
            themeMode={themeMode}
            placement={placement}
            onIconChange={setIconKey}
            onColorChange={setColor}
            onColorTargetChange={setColorTarget}
            onPlacementChange={setPlacement}
          />
        </div>
      </section>
    </main>
  );
}

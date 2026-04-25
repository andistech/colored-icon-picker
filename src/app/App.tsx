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
    <main className="app-shell" data-theme={themeMode}>
      <header className="app-header">
        <nav className="app-header__breadcrumb" aria-label="Breadcrumb">
          <span>Components</span>
          <span className="app-header__breadcrumb-sep" aria-hidden="true">/</span>
          <span>colored-icon-picker</span>
        </nav>
        <h1 className="app-header__title">Colored Icon Picker</h1>
        <p className="app-header__description">
          A combined icon and color picker in a single popover. Ships 1,600+ categorized Lucide icons
          with category browsing, search, hex color input, and dark mode.
        </p>
        <div className="app-header__tags">
          <span className="app-tag">Component</span>
          <span className="app-tag">lucide-react</span>
          <span className="app-tag">React 19</span>
          <span className="app-tag">shadcn</span>
        </div>
      </header>

      <div className="docs-card">
        <div className="docs-card__bar">
          <div className="docs-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={true} className="docs-tabs__btn">
              Preview
            </button>
            <button type="button" role="tab" aria-selected={false} className="docs-tabs__btn" disabled>
              Code
            </button>
          </div>
          <div className="docs-card__controls">
            <ColorTargetControl value={colorTarget} onChange={setColorTarget} />
            <button
              type="button"
              className="docs-icon-btn"
              aria-label={`Switch to ${nextThemeMode} mode`}
              onClick={() => setThemeMode(nextThemeMode)}
            >
              {themeMode === 'day'
                ? <Moon aria-hidden="true" size={15} />
                : <Sun aria-hidden="true" size={15} />}
            </button>
          </div>
        </div>
        <div className="docs-stage">
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

      <section className="docs-section">
        <h2 className="docs-section__heading">Installation</h2>
        <div className="docs-code docs-code--shell">
          <span className="docs-code__prompt">$</span>
          <span>npx shadcn@latest add colored-icon-picker</span>
        </div>
      </section>

      <section className="docs-section">
        <h2 className="docs-section__heading">Usage</h2>
        <div className="docs-code">
          <pre>{`import { ColoredIconPicker } from "@/components/ui/colored-icon-picker"

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

      <section className="docs-section">
        <h2 className="docs-section__heading">Examples</h2>

        <div className="docs-section__subsection">
          <h3 className="docs-section__subheading">Background color</h3>
          <p className="docs-section__body">
            Color is applied to the icon container background. The icon stroke automatically
            adapts for WCAG-compliant contrast.
          </p>
          <div className="docs-example-grid">
            {bgExamples.map(({ iconKey: key, color: c, label }) => {
              const { Icon } = getIconOption(key);
              const fg = getReadableIconColor(c);
              return (
                <div key={key} className="docs-example-item">
                  <div
                    className="entity-icon"
                    style={{ color: fg, backgroundColor: c, borderColor: c } as CSSProperties}
                  >
                    <Icon aria-hidden="true" size={28} strokeWidth={2.25} />
                  </div>
                  <span className="docs-example-item__label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="docs-section__subsection">
          <h3 className="docs-section__subheading">Icon color</h3>
          <p className="docs-section__body">
            Color is applied directly to the icon stroke against a neutral container background.
          </p>
          <div className="docs-example-grid">
            {iconColorExamples.map(({ iconKey: key, color: c, label }) => {
              const { Icon } = getIconOption(key);
              return (
                <div key={key} className="docs-example-item">
                  <div
                    className="entity-icon"
                    style={{ color: c, backgroundColor: 'var(--background)', borderColor: 'var(--border)' } as CSSProperties}
                  >
                    <Icon aria-hidden="true" size={28} strokeWidth={2.25} />
                  </div>
                  <span className="docs-example-item__label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="docs-section__subsection">
          <h3 className="docs-section__subheading">Interactive demo</h3>
          <p className="docs-section__body">
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

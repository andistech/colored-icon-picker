import { useState } from 'react';

import { ColoredIconPickerDemo } from '../components/colored-icon-picker/ColoredIconPickerDemo';
import type { ColorTarget, ThemeMode } from '../components/colored-icon-picker/color';

export default function App() {
  const [iconKey, setIconKey] = useState('sparkles');
  const [color, setColor] = useState('#14b8a6');
  const [colorTarget, setColorTarget] = useState<ColorTarget>('background');
  const [themeMode, setThemeMode] = useState<ThemeMode>('day');

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

      <ColoredIconPickerDemo
        iconKey={iconKey}
        color={color}
        colorTarget={colorTarget}
        themeMode={themeMode}
        onIconChange={setIconKey}
        onColorChange={setColor}
        onColorTargetChange={setColorTarget}
        onThemeModeChange={setThemeMode}
      />
    </main>
  );
}

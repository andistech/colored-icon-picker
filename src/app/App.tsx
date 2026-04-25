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
        <div>
          <p className="app-header__badge">React demo</p>
          <h1>Icon and Color Picker</h1>
          <p className="app-header__copy">
            One trigger opens a combined icon and color picker. The color mode is controlled on the main page.
          </p>
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

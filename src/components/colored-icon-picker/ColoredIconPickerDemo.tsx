import { useMemo } from 'react';
import { Moon, Sun } from 'lucide-react';

import { ColorTargetControl, ColoredIconPicker } from './ColoredIconPicker';
import { getReadableIconColor, type ColorTarget, type ThemeMode } from './color';
import { getIconOption } from './icons';

type ColoredIconPickerDemoProps = {
  iconKey: string;
  color: string;
  colorTarget: ColorTarget;
  themeMode: ThemeMode;
  onIconChange: (iconKey: string) => void;
  onColorChange: (color: string) => void;
  onColorTargetChange: (target: ColorTarget) => void;
  onThemeModeChange: (mode: ThemeMode) => void;
};

export function ColoredIconPickerDemo({
  iconKey,
  color,
  colorTarget,
  themeMode,
  onIconChange,
  onColorChange,
  onColorTargetChange,
  onThemeModeChange,
}: ColoredIconPickerDemoProps) {
  const icon = useMemo(() => getIconOption(iconKey), [iconKey]);
  const Icon = icon.Icon;
  const nextThemeMode = themeMode === 'day' ? 'night' : 'day';
  const iconModeBackgroundColor = themeMode === 'day' ? '#ffffff' : '#1f2937';
  const foregroundColor = colorTarget === 'background' ? getReadableIconColor(color) : color;
  const visibleBackgroundColor = colorTarget === 'background' ? color : iconModeBackgroundColor;

  return (
    <section className="demo-grid">
      <div className="workbench">
        <div className="toolbar">
          <div>
            <p className="toolbar__kicker">Component</p>
            <h2>Colored icon picker</h2>
          </div>
          <ColoredIconPicker
            iconKey={iconKey}
            color={color}
            colorTarget={colorTarget}
            iconModeBackgroundColor={iconModeBackgroundColor}
            onIconChange={onIconChange}
            onColorChange={onColorChange}
          />
        </div>

        <div className="preview-area">
          <div className="entity-row">
            <div className="entity-icon" style={{ color: foregroundColor, backgroundColor: visibleBackgroundColor }}>
              <Icon aria-hidden="true" size={28} strokeWidth={2.25} />
            </div>
            <div>
              <h3>Project label</h3>
              <p>{icon.label} · {color.toUpperCase()} · {colorTarget}</p>
            </div>
          </div>

          <div className="sample-list">
            {['Roadmap', 'Customer health', 'Release plan'].map((label, index) => (
              <div className="sample-list__item" key={label}>
                <div
                  className="entity-icon entity-icon--small"
                  style={{ color: foregroundColor, backgroundColor: visibleBackgroundColor }}
                >
                  <Icon aria-hidden="true" size={18} strokeWidth={2.25} />
                </div>
                <span>{label}</span>
                <span className="sample-list__meta">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="settings-panel">
        <div className="settings-panel__group">
          <p className="settings-panel__label">Color applied to</p>
          <ColorTargetControl value={colorTarget} onChange={onColorTargetChange} />
        </div>
        <div className="settings-panel__group">
          <p className="settings-panel__label">Appearance</p>
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${nextThemeMode} mode`}
            onClick={() => onThemeModeChange(nextThemeMode)}
          >
            {themeMode === 'day' ? <Moon aria-hidden="true" size={16} /> : <Sun aria-hidden="true" size={16} />}
            <span>Switch to {nextThemeMode} mode</span>
          </button>
        </div>
        <div className="settings-panel__group">
          <p className="settings-panel__label">State</p>
          <dl className="state-list">
            <div>
              <dt>Icon</dt>
              <dd>{icon.label}</dd>
            </div>
            <div>
              <dt>Color</dt>
              <dd>{color.toUpperCase()}</dd>
            </div>
            <div>
              <dt>Applied to</dt>
              <dd>{colorTarget}</dd>
            </div>
            <div>
              <dt>Theme</dt>
              <dd>{themeMode}</dd>
            </div>
            {colorTarget === 'background' ? (
              <div>
                <dt>Icon contrast</dt>
                <dd>{foregroundColor}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </aside>
    </section>
  );
}

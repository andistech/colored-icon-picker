import { Check, Copy, Search, X } from 'lucide-react';
import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from 'react';

import colorWheelUrl from '../../../color-wheel.svg';
import {
  getReadableIconColor,
  isValidHexColor,
  normalizeHexColor,
  type ColorTarget,
} from './color';
import { getIconOption, iconCategories } from './icons';

type ColoredIconPickerProps = {
  iconKey: string;
  color: string;
  colorTarget: ColorTarget;
  iconModeBackgroundColor: string;
  onIconChange: (iconKey: string) => void;
  onColorChange: (color: string) => void;
};

const colorSwatches = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#14b8a6',
  '#0ea5e9',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#64748b',
];

export function ColoredIconPicker({
  iconKey,
  color,
  colorTarget,
  iconModeBackgroundColor,
  onIconChange,
  onColorChange,
}: ColoredIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);
  const [query, setQuery] = useState('');
  const [hexDraftState, setHexDraftState] = useState({ color, draft: color });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const systemColorInputRef = useRef<HTMLInputElement>(null);
  const popoverId = useId();
  const selectedIcon = getIconOption(iconKey);
  const triggerIconColor = colorTarget === 'background' ? getReadableIconColor(color) : color;
  const triggerBackground = colorTarget === 'background' ? color : iconModeBackgroundColor;
  const triggerBorder = colorTarget === 'background' ? color : color;

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return iconCategories;
    }

    return iconCategories
      .map((cat) => ({
        ...cat,
        icons: cat.icons.filter((option) => option.label.toLowerCase().includes(normalizedQuery)),
      }))
      .filter((cat) => cat.icons.length > 0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onPointerDown(event: PointerEvent): void {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  function onHexInputChange(value: string): void {
    const normalizedColor = normalizeHexColor(value);
    setHexDraftState({
      color: isValidHexColor(normalizedColor) ? normalizedColor : color,
      draft: normalizedColor,
    });

    if (isValidHexColor(normalizedColor)) {
      onColorChange(normalizedColor);
    }
  }

  async function onCopyHex(): Promise<void> {
    if (!isValidHexColor(color)) {
      return;
    }

    const text = color.toUpperCase();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedHex(true);
    window.setTimeout(() => setCopiedHex(false), 1500);
  }

  const displayedHex = hexDraftState.color === color ? hexDraftState.draft : color;
  const SelectedIcon = selectedIcon.Icon;
  const triggerStyle = {
    '--picker-trigger-bg': triggerBackground,
    '--picker-trigger-fg': triggerIconColor,
    '--picker-trigger-border': triggerBorder,
  } as CSSProperties;

  return (
    <div className="icon-picker" ref={wrapperRef}>
      <button
        type="button"
        className="icon-picker__trigger"
        style={triggerStyle}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <SelectedIcon aria-hidden="true" size={28} strokeWidth={2.25} />
      </button>

      {isOpen ? (
        <div className="icon-picker__popover" id={popoverId} role="dialog" aria-label="Icon and color picker">
          <div className="icon-picker__popover-header">
            <div className="icon-picker__preview" style={triggerStyle}>
              <SelectedIcon aria-hidden="true" size={24} strokeWidth={2.25} />
            </div>
            <div>
              <p className="icon-picker__eyebrow">Selected</p>
              <p className="icon-picker__selection">{selectedIcon.label}</p>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Close picker"
              onClick={() => setIsOpen(false)}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <section className="control-group" aria-labelledby="color-heading">
            <div className="control-group__header">
              <h2 id="color-heading">Color</h2>
            </div>
            <div className="color-row">
              <div className="color-panel-anchor">
                <button
                  type="button"
                  className="color-wheel-button"
                  aria-label="Open color picker"
                  onClick={() => systemColorInputRef.current?.click()}
                >
                  <img src={colorWheelUrl} alt="" aria-hidden="true" />
                </button>
                <input
                  ref={systemColorInputRef}
                  className="native-color-input"
                  type="color"
                  tabIndex={-1}
                  value={color}
                  onChange={(event) => onColorChange(event.target.value)}
                />
              </div>
              <div className="hex-input">
                <label className="hex-input__label">
                  <span className="sr-only">Hex color</span>
                  <input
                    value={displayedHex}
                    spellCheck={false}
                    aria-invalid={!isValidHexColor(displayedHex)}
                    onChange={(event) => onHexInputChange(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="hex-copy"
                  aria-label="Copy hex color"
                  onClick={onCopyHex}
                >
                  {copiedHex ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
                </button>
              </div>
            </div>
            <div className="swatch-grid" aria-label="Color swatches">
              {colorSwatches.map((swatch) => (
                <button
                  type="button"
                  key={swatch}
                  className="swatch"
                  style={{ '--swatch-color': swatch } as CSSProperties}
                  aria-label={`Use ${swatch}`}
                  aria-pressed={swatch === color}
                  onClick={() => onColorChange(swatch)}
                >
                  {swatch === color ? <Check aria-hidden="true" size={16} /> : null}
                </button>
              ))}
            </div>
          </section>

          <section className="control-group" aria-labelledby="icon-heading">
            <div className="control-group__header">
              <h2 id="icon-heading">Icon</h2>
            </div>
            <label className="search-field">
              <Search aria-hidden="true" size={17} />
              <span className="sr-only">Search icons</span>
              <input value={query} placeholder="Search" onChange={(event) => setQuery(event.target.value)} />
            </label>
            <div className="icon-scroll-pane">
              {filteredCategories.map((cat) => (
                <div key={cat.key} className="icon-category">
                  <p className="icon-category__label">{cat.label}</p>
                  <div className="icon-grid">
                    {cat.icons.map((option) => {
                      const OptionIcon = option.Icon;
                      const isSelected = option.key === iconKey;

                      return (
                        <button
                          type="button"
                          key={option.key}
                          className="icon-option"
                          aria-label={option.label}
                          aria-pressed={isSelected}
                          title={option.label}
                          onClick={() => onIconChange(option.key)}
                        >
                          <OptionIcon aria-hidden="true" size={21} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <p className="icon-no-results">No icons found</p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

type ColorTargetControlProps = {
  value: ColorTarget;
  onChange: (target: ColorTarget) => void;
};

export function ColorTargetControl({ value, onChange }: ColorTargetControlProps) {
  return (
    <div className="segmented-control" role="radiogroup" aria-label="Color application">
      <button
        type="button"
        role="radio"
        aria-checked={value === 'icon'}
        className="segmented-control__item"
        onClick={() => onChange('icon')}
      >
        Icon
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'background'}
        className="segmented-control__item"
        onClick={() => onChange('background')}
      >
        Background
      </button>
    </div>
  );
}

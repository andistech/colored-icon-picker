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

export type PopoverPlacement =
  | 'auto'
  | 'top-start'    | 'top-center'    | 'top-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end'
  | 'left-start'   | 'left-center'   | 'left-end'
  | 'right-start'  | 'right-center'  | 'right-end';

function resolveAutoPlacement(el: HTMLElement): Exclude<PopoverPlacement, 'auto'> {
  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const PW = Math.min(380, vw - 32);
  const PH = 520;

  // Prefer bottom; fall back to top if more space there
  const side = (vh - rect.bottom >= PH || vh - rect.bottom >= rect.top) ? 'bottom' : 'top';

  // Prefer center, fall back to end (right-align / extends left), then start
  const triggerCx = (rect.left + rect.right) / 2;
  let align: 'start' | 'center' | 'end';
  if (triggerCx - PW / 2 >= 0 && triggerCx + PW / 2 <= vw) {
    align = 'center';
  } else if (rect.right - PW >= 0) {
    align = 'end';
  } else {
    align = 'start';
  }
  return `${side}-${align}` as Exclude<PopoverPlacement, 'auto'>;
}

function getPopoverStyle(placement: PopoverPlacement, wrapperEl: HTMLElement | null): CSSProperties {
  const resolved =
    placement === 'auto'
      ? (wrapperEl ? resolveAutoPlacement(wrapperEl) : 'bottom-end')
      : placement;
  const [side, align] = resolved.split('-') as [string, string];
  const style: CSSProperties = {};
  const gap = 'calc(100% + 8px)';
  if (side === 'bottom') style.top = gap;
  else if (side === 'top') style.bottom = gap;
  else if (side === 'left') style.right = gap;
  else style.left = gap;
  if (side === 'top' || side === 'bottom') {
    if (align === 'start') style.left = 0;
    else if (align === 'center') { style.left = '50%'; style.transform = 'translateX(-50%)'; }
    else style.right = 0;
  } else {
    if (align === 'start') style.top = 0;
    else if (align === 'center') { style.top = '50%'; style.transform = 'translateY(-50%)'; }
    else style.bottom = 0;
  }
  return style;
}

type ColoredIconPickerProps = {
  iconKey: string;
  color: string;
  colorTarget: ColorTarget;
  iconModeBackgroundColor: string;
  placement?: PopoverPlacement;
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
  placement = 'auto' as PopoverPlacement,
  onIconChange,
  onColorChange,
}: ColoredIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);
  const [query, setQuery] = useState('');
  const [hexDraftState, setHexDraftState] = useState({ color, draft: color });
  const [activeCategory, setActiveCategory] = useState(iconCategories[0]?.key ?? '');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const systemColorInputRef = useRef<HTMLInputElement>(null);
  const scrollPaneRef = useRef<HTMLDivElement>(null);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
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

  // Reset scroll pane and active category when popover opens or query changes.
  useEffect(() => {
    if (!isOpen) return;
    setActiveCategory(filteredCategories[0]?.key ?? '');
    if (scrollPaneRef.current) scrollPaneRef.current.scrollTop = 0;
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setActiveCategory(filteredCategories[0]?.key ?? '');
    if (scrollPaneRef.current) scrollPaneRef.current.scrollTop = 0;
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-center the active category button in the nav bar.
  useEffect(() => {
    const nav = categoryNavRef.current;
    if (!nav || !activeCategory) return;
    const btn = nav.querySelector<HTMLElement>(`[data-cat="${activeCategory}"]`);
    if (!btn) return;
    const targetScroll = btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2;
    nav.scrollTo({ left: Math.max(0, Math.min(targetScroll, nav.scrollWidth - nav.clientWidth)), behavior: 'smooth' });
  }, [activeCategory]);

  function onIconPaneScroll(): void {
    const pane = scrollPaneRef.current;
    if (!pane) return;
    const paneTop = pane.getBoundingClientRect().top;
    let active = filteredCategories[0]?.key ?? '';
    for (const cat of filteredCategories) {
      const el = categoryRefs.current.get(cat.key);
      if (!el) continue;
      if (el.getBoundingClientRect().top - paneTop <= 1) active = cat.key;
    }
    setActiveCategory(active);
  }

  function scrollToCategory(key: string): void {
    const pane = scrollPaneRef.current;
    const el = categoryRefs.current.get(key);
    if (!pane || !el) return;
    pane.scrollTop += el.getBoundingClientRect().top - pane.getBoundingClientRect().top;
    setActiveCategory(key);
  }

  function setCatRef(key: string) {
    return (el: HTMLDivElement | null) => {
      if (el) categoryRefs.current.set(key, el);
      else categoryRefs.current.delete(key);
    };
  }

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
    <div className="relative flex-none" ref={wrapperRef}>
      <button
        type="button"
        className="inline-grid place-items-center w-12 h-12 border border-border rounded-md text-[var(--picker-trigger-fg,currentColor)] bg-[var(--picker-trigger-bg,--color-background)] border-[var(--picker-trigger-border,--color-border)] transition-[box-shadow,opacity] duration-[150ms] hover:opacity-[0.88] hover:ring-2 hover:ring-border/50 hover:ring-offset-2 hover:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={triggerStyle}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <SelectedIcon aria-hidden="true" size={28} strokeWidth={2.25} />
      </button>

      {isOpen ? (
        <div
          className="absolute z-50 w-[min(380px,calc(100vw-32px))] p-3 bg-popover text-popover-foreground border border-border rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.03)]"
          id={popoverId}
          role="dialog"
          aria-label="Icon and color picker"
          style={getPopoverStyle(placement, wrapperRef.current)}
        >
          <div className="grid grid-cols-[auto_1fr_auto] gap-[10px] items-center mb-3 pb-3 border-b border-border">
            <div className="inline-grid place-items-center w-10 h-10 border border-[var(--picker-trigger-border,--color-border)] rounded-md" style={triggerStyle}>
              <SelectedIcon aria-hidden="true" size={24} strokeWidth={2.25} />
            </div>
            <div>
              <p className="m-0 mb-[1px] text-muted-foreground text-[0.6875rem] font-semibold tracking-[0.07em] uppercase">Selected</p>
              <p className="m-0 text-[0.9375rem] font-semibold text-popover-foreground">{selectedIcon.label}</p>
            </div>
            <button
              type="button"
              className="inline-grid place-items-center w-7 h-7 text-muted-foreground bg-transparent border-0 rounded-md transition-[background-color,color] duration-[120ms] hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Close picker"
              onClick={() => setIsOpen(false)}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <section className="grid gap-2 pt-3 border-t border-border" aria-labelledby="color-heading">
            <div>
              <h2 id="color-heading" className="m-0 text-foreground text-[0.8125rem] font-semibold">Color</h2>
            </div>
            <div className="grid grid-cols-[36px_1fr] gap-[6px]">
              <div className="relative">
                <button
                  type="button"
                  className="inline-grid place-items-center w-9 h-9 overflow-hidden bg-muted border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Open color picker"
                  onClick={() => systemColorInputRef.current?.click()}
                >
                  <img className="block w-6 h-6" src={colorWheelUrl} alt="" aria-hidden="true" />
                </button>
                <input
                  ref={systemColorInputRef}
                  className="absolute inset-0 w-9 h-9 opacity-0 pointer-events-none"
                  type="color"
                  tabIndex={-1}
                  value={color}
                  onChange={(event) => onColorChange(event.target.value)}
                />
              </div>
              <div className="flex gap-1 items-center">
                <label className="flex-1 min-w-0 block">
                  <span className="sr-only">Hex color</span>
                  <input
                    className="w-full min-w-0 h-9 text-foreground bg-background border border-input rounded-md focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring px-[10px] font-mono text-[0.8125rem] uppercase aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-500"
                    value={displayedHex}
                    spellCheck={false}
                    aria-invalid={!isValidHexColor(displayedHex)}
                    onChange={(event) => onHexInputChange(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="inline-grid place-items-center w-7 h-7 text-muted-foreground bg-transparent border-0 rounded-md transition-[background-color,color] duration-[120ms] hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Copy hex color"
                  onClick={onCopyHex}
                >
                  {copiedHex ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-10 gap-[5px]" aria-label="Color swatches">
              {colorSwatches.map((swatch) => (
                <button
                  type="button"
                  key={swatch}
                  className="inline-grid place-items-center aspect-square min-w-0 text-white bg-[var(--swatch-color)] border-0 rounded-sm transition-transform duration-[100ms] hover:scale-110 aria-pressed:shadow-[0_0_0_2px_var(--popover),0_0_0_4px_var(--swatch-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

          <section className="grid gap-2 pt-3 border-t border-border" aria-labelledby="icon-heading">
            <div>
              <h2 id="icon-heading" className="m-0 text-foreground text-[0.8125rem] font-semibold">Icon</h2>
            </div>
            <label className="relative block">
              <Search aria-hidden="true" size={17} className="absolute top-1/2 left-[10px] text-muted-foreground -translate-y-1/2 pointer-events-none" />
              <span className="sr-only">Search icons</span>
              <input
                className="w-full min-w-0 h-9 text-foreground bg-background border border-input rounded-md focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring pl-[34px] pr-[10px] text-sm"
                value={query}
                placeholder="Search"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="relative flex gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] pb-[2px] [&::-webkit-scrollbar]:hidden" ref={categoryNavRef} role="tablist" aria-label="Icon categories">
              {filteredCategories.map((cat) => (
                <button
                  type="button"
                  key={cat.key}
                  role="tab"
                  data-cat={cat.key}
                  className="flex-none px-[10px] py-[3px] text-muted-foreground text-[0.72rem] font-medium whitespace-nowrap bg-transparent border border-border rounded-full transition-[background-color,color,border-color] duration-[120ms] hover:text-foreground hover:bg-muted aria-selected:text-primary-foreground aria-selected:bg-primary aria-selected:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-selected={cat.key === activeCategory}
                  onClick={() => scrollToCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative max-h-60 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]" ref={scrollPaneRef} onScroll={onIconPaneScroll}>
              {filteredCategories.map((cat) => (
                <div key={cat.key} className="mb-[10px] last:mb-0" ref={setCatRef(cat.key)}>
                  <p className="sticky top-0 z-[1] m-0 mb-1 pt-[2px] pb-1 text-muted-foreground text-[0.6875rem] font-semibold tracking-[0.06em] uppercase bg-popover">{cat.label}</p>
                  <div className="grid grid-cols-8 gap-[3px]">
                    {cat.icons.map((option) => {
                      const OptionIcon = option.Icon;
                      const isSelected = option.key === iconKey;

                      return (
                        <button
                          type="button"
                          key={option.key}
                          className="inline-grid place-items-center aspect-square min-w-0 text-muted-foreground bg-transparent border-0 rounded-md transition-[background-color,color] duration-[100ms] hover:text-foreground hover:bg-accent aria-pressed:text-primary-foreground aria-pressed:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                <p className="m-0 py-5 text-muted-foreground text-sm text-center">No icons found</p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

const PLACEMENT_CELLS: {
  placement: Exclude<PopoverPlacement, 'auto'>;
  col: number;
  row: number;
  label: string;
}[] = [
  { placement: 'top-start',     col: 2, row: 1, label: 'Top, left-aligned' },
  { placement: 'top-center',    col: 3, row: 1, label: 'Top, centered' },
  { placement: 'top-end',       col: 4, row: 1, label: 'Top, right-aligned' },
  { placement: 'left-start',    col: 1, row: 2, label: 'Left, top-aligned' },
  { placement: 'left-center',   col: 1, row: 3, label: 'Left, centered' },
  { placement: 'left-end',      col: 1, row: 4, label: 'Left, bottom-aligned' },
  { placement: 'right-start',   col: 5, row: 2, label: 'Right, top-aligned' },
  { placement: 'right-center',  col: 5, row: 3, label: 'Right, centered' },
  { placement: 'right-end',     col: 5, row: 4, label: 'Right, bottom-aligned' },
  { placement: 'bottom-start',  col: 2, row: 5, label: 'Bottom, left-aligned' },
  { placement: 'bottom-center', col: 3, row: 5, label: 'Bottom, centered' },
  { placement: 'bottom-end',    col: 4, row: 5, label: 'Bottom, right-aligned' },
];

type PlacementControlProps = {
  value: PopoverPlacement;
  onChange: (p: PopoverPlacement) => void;
};

export function PlacementControl({ value, onChange }: PlacementControlProps) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: 'repeat(5, 16px)', gridTemplateRows: 'repeat(5, 16px)' }}
        role="radiogroup"
        aria-label="Popover placement"
      >
        {PLACEMENT_CELLS.map(({ placement, col, row, label }) => (
          <button
            key={placement}
            type="button"
            role="radio"
            className="w-4 h-4 p-0 bg-border border-0 rounded-[3px] cursor-pointer transition-colors duration-[80ms] hover:bg-muted-foreground aria-checked:bg-primary aria-checked:hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ gridColumn: col, gridRow: row }}
            aria-label={label}
            aria-checked={value === placement}
            title={label}
            onClick={() => onChange(placement)}
          />
        ))}
        <div
          className="bg-muted border border-border rounded-[3px] w-full h-full"
          style={{ gridColumn: '2 / 5', gridRow: '2 / 5' }}
          aria-hidden="true"
        />
      </div>
      <button
        type="button"
        className="self-start px-[10px] py-[2px] text-[0.72rem] font-medium text-muted-foreground bg-transparent border border-border rounded-full transition-[background-color,color,border-color] duration-[120ms] hover:text-foreground hover:bg-muted aria-pressed:text-primary-foreground aria-pressed:bg-primary aria-pressed:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-pressed={value === 'auto'}
        onClick={() => onChange('auto')}
      >
        Auto
      </button>
    </div>
  );
}

type ColorTargetControlProps = {
  value: ColorTarget;
  onChange: (target: ColorTarget) => void;
};

export function ColorTargetControl({ value, onChange }: ColorTargetControlProps) {
  return (
    <div className="grid grid-flow-col gap-[2px] p-[2px] bg-muted border border-border rounded-md" role="radiogroup" aria-label="Color application">
      <button
        type="button"
        role="radio"
        aria-checked={value === 'icon'}
        className="min-h-8 px-3 text-muted-foreground text-sm font-medium bg-transparent border-0 rounded-sm transition-[background-color,color] duration-[120ms] aria-checked:text-foreground aria-checked:bg-background aria-checked:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={() => onChange('icon')}
      >
        Icon
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'background'}
        className="min-h-8 px-3 text-muted-foreground text-sm font-medium bg-transparent border-0 rounded-sm transition-[background-color,color] duration-[120ms] aria-checked:text-foreground aria-checked:bg-background aria-checked:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={() => onChange('background')}
      >
        Background
      </button>
    </div>
  );
}

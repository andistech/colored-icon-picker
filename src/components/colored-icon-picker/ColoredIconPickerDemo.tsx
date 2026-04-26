import { useMemo } from 'react';

import { ColorTargetControl, ColoredIconPicker, PlacementControl, type PopoverPlacement } from './ColoredIconPicker';
import { getReadableIconColor, type ColorTarget, type ThemeMode } from './color';
import { getIconOption } from './icons';

type ColoredIconPickerDemoProps = {
  iconKey: string;
  color: string;
  colorTarget: ColorTarget;
  themeMode: ThemeMode;
  placement: PopoverPlacement;
  onIconChange: (iconKey: string) => void;
  onColorChange: (color: string) => void;
  onColorTargetChange: (target: ColorTarget) => void;
  onPlacementChange: (p: PopoverPlacement) => void;
};

export function ColoredIconPickerDemo({
  iconKey,
  color,
  colorTarget,
  themeMode,
  placement,
  onIconChange,
  onColorChange,
  onColorTargetChange,
  onPlacementChange,
}: ColoredIconPickerDemoProps) {
  const icon = useMemo(() => getIconOption(iconKey), [iconKey]);
  const Icon = icon.Icon;
  const iconModeBackgroundColor = themeMode === 'day' ? '#ffffff' : '#1f2937';
  const foregroundColor = colorTarget === 'background' ? getReadableIconColor(color) : color;
  const visibleBackgroundColor = colorTarget === 'background' ? color : iconModeBackgroundColor;

  return (
    <section className="grid grid-cols-[1fr_296px] gap-4 items-start max-sm:grid-cols-1">
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between gap-4 px-5 py-[14px] border-b border-border">
          <div>
            <p className="m-0 mb-[2px] text-muted-foreground text-[0.7rem] font-semibold tracking-[0.08em] uppercase">Component</p>
            <h2 className="m-0 text-[0.9rem] font-semibold text-foreground">Colored icon picker</h2>
          </div>
          <ColoredIconPicker
            iconKey={iconKey}
            color={color}
            colorTarget={colorTarget}
            iconModeBackgroundColor={iconModeBackgroundColor}
            placement={placement}
            onIconChange={onIconChange}
            onColorChange={onColorChange}
          />
        </div>

        <div className="grid gap-3 p-5">
          <div className="grid grid-cols-[auto_1fr] gap-[14px] items-center p-4 bg-muted border border-border rounded-md">
            <div className="inline-grid place-items-center w-12 h-12 border border-border rounded-md" style={{ color: foregroundColor, backgroundColor: visibleBackgroundColor }}>
              <Icon aria-hidden="true" size={28} strokeWidth={2.25} />
            </div>
            <div>
              <h3 className="m-0 text-[0.9375rem] font-semibold text-foreground">Project label</h3>
              <p className="mt-[2px] mb-0 text-muted-foreground text-[0.8125rem]">{icon.label} · {color.toUpperCase()} · {colorTarget}</p>
            </div>
          </div>

          <div className="grid gap-[6px]">
            {['Roadmap', 'Customer health', 'Release plan'].map((label, index) => (
              <div className="grid grid-cols-[auto_1fr_auto] gap-[10px] items-center min-h-[46px] px-3 py-2 text-sm text-foreground bg-background border border-border rounded-md" key={label}>
                <div
                  className="inline-grid place-items-center w-12 h-12 border border-border rounded-md w-8 h-8"
                  style={{ color: foregroundColor, backgroundColor: visibleBackgroundColor }}
                >
                  <Icon aria-hidden="true" size={18} strokeWidth={2.25} />
                </div>
                <span>{label}</span>
                <span className="text-muted-foreground text-[0.8125rem]">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="bg-card border border-border rounded-lg">
        <div className="px-5 py-4 border-b border-border last:border-b-0">
          <p className="m-0 mb-[10px] text-muted-foreground text-[0.7rem] font-semibold tracking-[0.08em] uppercase">Color applied to</p>
          <ColorTargetControl value={colorTarget} onChange={onColorTargetChange} />
        </div>
        <div className="px-5 py-4 border-b border-border last:border-b-0">
          <p className="m-0 mb-[10px] text-muted-foreground text-[0.7rem] font-semibold tracking-[0.08em] uppercase">Popover placement</p>
          <PlacementControl value={placement} onChange={onPlacementChange} />
        </div>
        <div className="px-5 py-4 border-b border-border last:border-b-0">
          <p className="m-0 mb-[10px] text-muted-foreground text-[0.7rem] font-semibold tracking-[0.08em] uppercase">State</p>
          <dl className="grid m-0 border border-border rounded-md overflow-hidden">
            <div className="flex justify-between items-baseline gap-3 px-[10px] py-[7px] border-t border-border first:border-t-0 text-[0.8125rem]">
              <dt className="text-muted-foreground">Icon</dt>
              <dd className="m-0 text-foreground font-medium font-mono text-[0.75rem]">{icon.label}</dd>
            </div>
            <div className="flex justify-between items-baseline gap-3 px-[10px] py-[7px] border-t border-border first:border-t-0 text-[0.8125rem]">
              <dt className="text-muted-foreground">Color</dt>
              <dd className="m-0 text-foreground font-medium font-mono text-[0.75rem]">{color.toUpperCase()}</dd>
            </div>
            <div className="flex justify-between items-baseline gap-3 px-[10px] py-[7px] border-t border-border first:border-t-0 text-[0.8125rem]">
              <dt className="text-muted-foreground">Applied to</dt>
              <dd className="m-0 text-foreground font-medium font-mono text-[0.75rem]">{colorTarget}</dd>
            </div>
            <div className="flex justify-between items-baseline gap-3 px-[10px] py-[7px] border-t border-border first:border-t-0 text-[0.8125rem]">
              <dt className="text-muted-foreground">Placement</dt>
              <dd className="m-0 text-foreground font-medium font-mono text-[0.75rem]">{placement}</dd>
            </div>
            <div className="flex justify-between items-baseline gap-3 px-[10px] py-[7px] border-t border-border first:border-t-0 text-[0.8125rem]">
              <dt className="text-muted-foreground">Theme</dt>
              <dd className="m-0 text-foreground font-medium font-mono text-[0.75rem]">{themeMode}</dd>
            </div>
            {colorTarget === 'background' ? (
              <div className="flex justify-between items-baseline gap-3 px-[10px] py-[7px] border-t border-border first:border-t-0 text-[0.8125rem]">
                <dt className="text-muted-foreground">Icon contrast</dt>
                <dd className="m-0 text-foreground font-medium font-mono text-[0.75rem]">{foregroundColor}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </aside>
    </section>
  );
}

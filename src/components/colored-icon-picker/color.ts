export type ColorTarget = 'icon' | 'background';
export type ThemeMode = 'day' | 'night';

export function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function normalizeHexColor(value: string): string {
  const nextValue = value.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(nextValue)) {
    return nextValue.toLowerCase();
  }

  if (/^[0-9a-fA-F]{6}$/.test(nextValue)) {
    return `#${nextValue.toLowerCase()}`;
  }

  return nextValue;
}

export function getReadableIconColor(backgroundColor: string): '#000000' | '#ffffff' {
  if (!isValidHexColor(backgroundColor)) {
    return '#000000';
  }

  const red = Number.parseInt(backgroundColor.slice(1, 3), 16) / 255;
  const green = Number.parseInt(backgroundColor.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(backgroundColor.slice(5, 7), 16) / 255;
  const luminance = 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);

  return luminance > 0.179 ? '#000000' : '#ffffff';
}

function toLinear(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

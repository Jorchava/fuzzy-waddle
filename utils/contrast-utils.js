import { hexToRgb, rgbToHex, getRandomColor } from "./color-utils.js";

export function calculateLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(bg, text) {
  const l1 = calculateLuminance(bg);
  const l2 = calculateLuminance(text);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function getContrastStatus(ratio) {
  if (ratio < 4.5) return { label: "Poor", className: "fail" };
  if (ratio < 7) return { label: "Good", className: "pass" };
  return { label: "Best", className: "pass" };
}

export function getAccessiblePair() {
  let bg, text, ratio;
  do {
    bg = getRandomColor();
    text = getRandomColor();
    ratio = getContrastRatio(bg, text);
  } while (ratio < 4.5);
  return { bg, text };
}

export function fixTextContrast(bgHex, textHex, target = 4.5) {
  let ratio = getContrastRatio(bgHex, textHex);
  if (ratio >= target) return textHex;

  let [r, g, b] = hexToRgb(textHex);

  const bgLum = calculateLuminance(bgHex);
  const textLum = calculateLuminance(textHex);

  // we need to decide direction
  const makeLighter = textLum <= bgLum;

  let attempts = 0;

  while (ratio < target && attempts < 100) {
    if (makeLighter) {
      r = Math.min(255, r + 5);
      g = Math.min(255, g + 5);
      b = Math.min(255, b + 5);
    } else {
      r = Math.max(0, r - 5);
      g = Math.max(0, g - 5);
      b = Math.max(0, b - 5);
    }

    const newHex = rgbToHex(r, g, b);
    ratio = getContrastRatio(bgHex, newHex);

    attempts++;
  }

  return rgbToHex(r, g, b);
}

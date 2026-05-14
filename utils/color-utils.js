export function isValidHex(hex) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

export function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

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
  if (ratio < 7) return { label: "AA", className: "pass" };
  return { label: "AAA", className: "pass" };
}

export function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase()
  );
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

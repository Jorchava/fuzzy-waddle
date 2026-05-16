const STORAGE_KEYS = {
  bg: "bgColor",
  text: "textColor",
};

const DEFAULT_COLORS = {
  bgColor: "#000000",
  textColor: "#FFFFFF",
};

export function loadColors() {
  return {
    bgColor: localStorage.getItem(STORAGE_KEYS.bg) || DEFAULT_COLORS.bgColor,

    textColor:
      localStorage.getItem(STORAGE_KEYS.text) || DEFAULT_COLORS.textColor,
  };
}

export function saveColors({ bgColor, textColor }) {
  localStorage.setItem(STORAGE_KEYS.bg, bgColor);

  localStorage.setItem(STORAGE_KEYS.text, textColor);
}

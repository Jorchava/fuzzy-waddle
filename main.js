import "./components/color-checker/color-checker.js";
import { loadColors } from "./utils/storage-utils.js";

// ---------- RENDER LAYER (CSS VARIABLES) ----------

function applyColors({ bgColor, textColor }) {
  const root = document.documentElement;

  root.style.setProperty("--preview-bg", bgColor);
  root.style.setProperty("--preview-text", textColor);
}

// ---------- EVENT HANDLING ----------

function handleColorChange(e) {
  applyColors(e.detail);
}

// ---------- INIT ----------

function getInitialColors() {
  return loadColors();
}

function init() {
  document.addEventListener("color-change", handleColorChange);
  applyColors(getInitialColors());
}

window.addEventListener("DOMContentLoaded", init);

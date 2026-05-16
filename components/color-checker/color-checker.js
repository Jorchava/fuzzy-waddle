import { isValidHex } from "../../utils/color-utils.js";

import {
  getContrastRatio,
  getContrastStatus,
  getAccessiblePair,
  fixTextContrast,
} from "../../utils/contrast-utils.js";

import { saveColors, loadColors } from "../../utils/storage-utils.js";
class ColorChecker extends HTMLElement {
  state = {
    bgColor: "#000000",
    textColor: "#FFFFFF",
  };

  elements = {};

  connectedCallback() {
    this.cacheElements();
    this.loadState();
    this.bindEvents();
    this.update();
  }

  cacheElements() {
    this.elements = {
      bgInput: this.querySelector("#bgColor"),
      textInput: this.querySelector("#textColor"),
      bgValue: this.querySelector("#bgColorValue"),
      textValue: this.querySelector("#textColorValue"),
      ratio: this.querySelector("#contrastRatio"),
      aa: this.querySelector("#wcagStatusAA"),
      aaa: this.querySelector("#wcagStatusAAA"),
      switchBtn: this.querySelector("#colorSwitch"),
      randomBtn: this.querySelector("#randomizeColors"),
      fixButton: this.querySelector("#fixTextContrast"),
    };
  }

  loadState() {
    this.state = loadColors();
  }

  bindEvents() {
    this.elements.bgInput?.addEventListener("input", (e) => {
      this.updateState({ bgColor: e.target.value.toUpperCase() });
    });

    this.elements.textInput?.addEventListener("input", (e) => {
      this.updateState({ textColor: e.target.value.toUpperCase() });
    });

    this.elements.bgValue?.addEventListener("input", (e) => {
      if (isValidHex(e.target.value)) {
        this.updateState({ bgColor: e.target.value.toUpperCase() });
      }
    });

    this.elements.textValue?.addEventListener("input", (e) => {
      if (isValidHex(e.target.value)) {
        this.updateState({ textColor: e.target.value.toUpperCase() });
      }
    });

    this.elements.switchBtn?.addEventListener("click", () => {
      this.updateState({
        bgColor: this.state.textColor,
        textColor: this.state.bgColor,
      });
    });

    this.elements.randomBtn?.addEventListener("click", () => {
      const { bg, text } = getAccessiblePair();
      this.updateState({ bgColor: bg, textColor: text });
    });

    this.elements.fixButton?.addEventListener("click", () => {
      const fixedText = fixTextContrast(
        this.state.bgColor,
        this.state.textColor,
      );

      this.updateState({
        textColor: fixedText,
      });
    });
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.update();
  }

  update() {
    const { bgColor, textColor } = this.state;

    // Update inputs
    this.elements.bgInput.value = bgColor;
    this.elements.textInput.value = textColor;
    this.elements.bgValue.value = bgColor;
    this.elements.textValue.value = textColor;

    // Save
    saveColors({ bgColor, textColor });

    // Compute
    const ratio = getContrastRatio(bgColor, textColor);
    const status = getContrastStatus(ratio);

    // Update UI
    this.elements.ratio.textContent = `${ratio.toFixed(2)} (${status.label})`;

    this.updateStatus(this.elements.aa, ratio >= 4.5);
    this.updateStatus(this.elements.aaa, ratio >= 7);

    // Notify app
    this.dispatch(bgColor, textColor);
  }

  updateStatus(el, pass) {
    el.classList.toggle("pass", pass);
    el.classList.toggle("fail", !pass);
  }

  dispatch(bgColor, textColor) {
    document.dispatchEvent(
      new CustomEvent("color-change", {
        detail: { bgColor, textColor },
      }),
    );
  }
}

customElements.define("color-checker", ColorChecker);

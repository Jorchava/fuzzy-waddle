class ColorChecker extends HTMLElement {
  connectedCallback() {
    // Find elements inside this component
    const bgColorPicker = this.querySelector('#bgColor');
    const textColorPicker = this.querySelector('#textColor');
    const colorSwitch = this.querySelector('#colorSwitch');
    const contrastRatioDisplay = this.querySelector('#contrastRatio');
    const wcagStatusAA = this.querySelector('#wcagStatusAA');
    const wcagStatusAAA = this.querySelector('#wcagStatusAAA');
    const randomizeButton = this.querySelector('#randomizeColors');
    const bgColorValue = this.querySelector('#bgColorValue');
    const textColorValue = this.querySelector('#textColorValue');

    if (!bgColorPicker || !textColorPicker) {
      return;
    }

    // Load saved colors from localStorage
    const savedBgColor = localStorage.getItem('bgColor') || '#000000';
    const savedTextColor = localStorage.getItem('textColor') || '#FCFCFC';
    
    applyColors(savedBgColor, savedTextColor);
    updateContrastRatio(savedBgColor, savedTextColor);

    bgColorPicker.addEventListener('input', (event) => {
      const bgColor = event.target.value.toUpperCase();
      bgColorValue.value = bgColor;
      applyColors(bgColor, textColorPicker.value);
      updateContrastRatio(bgColor, textColorPicker.value);
      localStorage.setItem('bgColor', bgColor);
      dispatchColorChange(bgColor, textColorPicker.value);
    });

    textColorPicker.addEventListener('input', (event) => {
      const textColor = event.target.value.toUpperCase();
      textColorValue.value = textColor;
      applyColors(bgColorPicker.value, textColor);
      updateContrastRatio(bgColorPicker.value, textColor);
      localStorage.setItem('textColor', textColor);
      dispatchColorChange(bgColorPicker.value, textColor);
    });

    colorSwitch.addEventListener('click', () => {
      const tempColor = bgColorPicker.value;
      bgColorPicker.value = textColorPicker.value;
      textColorPicker.value = tempColor;
      applyColors(bgColorPicker.value, textColorPicker.value);
      updateContrastRatio(bgColorPicker.value, textColorPicker.value);
      localStorage.setItem('bgColor', bgColorPicker.value);
      localStorage.setItem('textColor', textColorPicker.value);
      dispatchColorChange(bgColorPicker.value, textColorPicker.value);
    });

    randomizeButton.addEventListener('click', () => {
      const { randomBgColor, randomTextColor } = getRandomColorsWithFailureChance();
      applyColors(randomBgColor, randomTextColor);
      updateContrastRatio(randomBgColor, randomTextColor);
      localStorage.setItem('bgColor', randomBgColor);
      localStorage.setItem('textColor', randomTextColor);
      dispatchColorChange(randomBgColor, randomTextColor);
    });

    bgColorValue.addEventListener('input', () => {
      const val = bgColorValue.value;
      if (isValidHex(val)) {
        bgColorPicker.value = val;
        applyColors(val, textColorPicker.value);
        updateContrastRatio(val, textColorPicker.value);
        localStorage.setItem('bgColor', val);
        dispatchColorChange(val, textColorPicker.value);
      }
    });

    textColorValue.addEventListener('input', () => {
      const val = textColorValue.value;
      if (isValidHex(val)) {
        textColorPicker.value = val;
        applyColors(bgColorPicker.value, val);
        updateContrastRatio(bgColorPicker.value, val);
        localStorage.setItem('textColor', val);
        dispatchColorChange(bgColorPicker.value, val);
      }
    });

    function isValidHex(hex) {
      return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(hex);
    }

    function dispatchColorChange(bgColor, textColor) {
      document.dispatchEvent(new CustomEvent('color-change', {
        detail: { bgColor, textColor }
      }));
    }

    function applyColors(bgColor, textColor) {
      bgColorValue.value = bgColor;
      textColorValue.value = textColor;
      bgColorPicker.value = bgColor;
      textColorPicker.value = textColor;
    }

    function updateContrastRatio(bgColor, textColor) {
      const contrastRatio = getContrastRatio(bgColor, textColor);
      const statusText = getStatusText(contrastRatio);

      contrastRatioDisplay.textContent = `${contrastRatio.toFixed(2)} ${statusText.text}`;
      contrastRatioDisplay.style.color = statusText.color;

      if (contrastRatio < 4.5) {
        wcagStatusAA.classList.remove('pass');
        wcagStatusAAA.classList.remove('pass');
        wcagStatusAA.classList.add('fail');
        wcagStatusAAA.classList.add('fail');
      } else if (contrastRatio >= 4.5 && contrastRatio < 7.0) {
        wcagStatusAA.classList.remove('fail');
        wcagStatusAAA.classList.remove('pass');
        wcagStatusAA.classList.add('pass');
        wcagStatusAAA.classList.add('fail');
      } else {
        wcagStatusAA.classList.remove('fail');
        wcagStatusAAA.classList.remove('fail');
        wcagStatusAA.classList.add('pass');
        wcagStatusAAA.classList.add('pass');
      }

      //wcagStatusAA.style.color = statusText.aaColor;
      //wcagStatusAAA.style.color = statusText.aaaColor;
    }

    function getStatusText(contrastRatio) {
      // WCAG AA and AAA compliance status colors from vars.css red: --nes-red | green: --nes-green-deep
      if (contrastRatio < 4.5) {
        return { text: '(Poor)', color: '#e40058', aaColor: '#e40058', aaaColor: '#e40058' };
      } else if (contrastRatio >= 4.5 && contrastRatio < 7.0) {
        return { text: '(Good)', color: '#00a800', aaColor: '#00a800', aaaColor: '#e40058' };
      } else {
        return { text: '(Very Good)', color: '#00a800', aaColor: '#00a800', aaaColor: '#00a800' };
      }
    }

    function getContrastRatio(bgColor, textColor) {
      const bgLuminance = calculateLuminance(bgColor);
      const textLuminance = calculateLuminance(textColor);
      return (Math.max(bgLuminance, textLuminance) + 0.05) /
        (Math.min(bgLuminance, textLuminance) + 0.05);
    }

    function calculateLuminance(color) {
      const rgb = hexToRgb(color);
      const [r, g, b] = rgb.map((value) => {
        const channel = value / 255;
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function hexToRgb(hex) {
      const cleanHex = hex.replace('#', '');
      const bigint = parseInt(cleanHex, 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function getRandomAACompliantColors() {
      let randomBgColor, randomTextColor, contrastRatio;
      do {
        randomBgColor = getRandomColor();
        randomTextColor = getRandomColor();
        contrastRatio = getContrastRatio(randomBgColor, randomTextColor);
      } while (contrastRatio < 4.5);
      return { randomBgColor, randomTextColor };
    }

    function getRandomColorsWithFailureChance() {
      const failureChance = Math.random();
      if (failureChance > 0.1) {
        return getRandomAACompliantColors();
      }
      return {
        randomBgColor: getRandomColor(),
        randomTextColor: getRandomColor()
      };
    }
  }
}
customElements.define('color-checker', ColorChecker);
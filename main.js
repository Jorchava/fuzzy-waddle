import './components/color-checker/color-checker.js';

// Listen for color changes and update global styles
document.addEventListener('color-change', (e) => {
  const { bgColor, textColor } = e.detail;

  const bgEls = document.querySelectorAll('.sampleBgColor');
  const textEls = document.querySelectorAll('.sampleTextColor');
  const switchEls = document.querySelectorAll('.sampleSwitchColor');

  bgEls.forEach(el => {
    el.style.backgroundColor = bgColor;
  });
  textEls.forEach(el => {
    el.style.color = textColor;
  });
  switchEls.forEach(el => {
    el.style.backgroundColor = textColor;
    el.style.color = bgColor;
  });
});

window.addEventListener('DOMContentLoaded', () => {
  // Get initial colors from localStorage or defaults
  const bgColor = localStorage.getItem('bgColor') || '#000000';
  const textColor = localStorage.getItem('textColor') || '#FCFCFC';
  document.dispatchEvent(new CustomEvent('color-change', {
    detail: { bgColor, textColor }
  }));
});
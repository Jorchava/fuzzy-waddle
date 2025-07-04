import './components/color-checker/color-checker.js';
import './components/masthead-component/masthead-component.js';
import './components/blog-card/blog-card.js';

console.log('[main.js] Script loaded and modules imported.');

// Listen for color changes and update global styles
document.addEventListener('color-change', (e) => {
  const { bgColor, textColor } = e.detail;
  console.log('[main.js] color-change event received:', { bgColor, textColor });

  const bgEls = document.querySelectorAll('.sampleBgColor');
  const textEls = document.querySelectorAll('.sampleTextColor');
  const switchEls = document.querySelectorAll('.sampleSwitchColor');

  console.log(`[main.js] .sampleBgColor elements found: ${bgEls.length}`);
  console.log(`[main.js] .sampleTextColor elements found: ${textEls.length}`);
  console.log(`[main.js] .sampleSwitchColor elements found: ${switchEls.length}`);

  bgEls.forEach(el => {
    el.style.backgroundColor = bgColor;
    console.log('[main.js] Set backgroundColor for .sampleBgColor:', el, bgColor);
  });
  textEls.forEach(el => {
    el.style.color = textColor;
    console.log('[main.js] Set color for .sampleTextColor:', el, textColor);
  });
  switchEls.forEach(el => {
    el.style.backgroundColor = textColor;
    el.style.color = bgColor;
    console.log('[main.js] Set switch colors for .sampleSwitchColor:', el, { bg: textColor, fg: bgColor });
  });
});

window.addEventListener('DOMContentLoaded', () => {
  // Get initial colors from localStorage or defaults
  const bgColor = localStorage.getItem('bgColor') || '#000000';
  const textColor = localStorage.getItem('textColor') || '#FFFFFF';
  document.dispatchEvent(new CustomEvent('color-change', {
    detail: { bgColor, textColor }
  }));
  console.log('[main.js] Initial color-change event dispatched after DOMContentLoaded');
});
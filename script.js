// Get references to the DOM elements
const bgColorPicker = document.getElementById('bgColor');
const textColorPicker = document.getElementById('textColor');
const sampleText = document.getElementById('sampleText');
const contrastRatioDisplay = document.getElementById('contrastRatio');
const wcagStatusDisplay = document.getElementById('wcagStatus');

// Load saved colors from localStorage
const savedBgColor = localStorage.getItem('bgColor') || '#ffffff';
const savedTextColor = localStorage.getItem('textColor') || '#000000';
bgColorPicker.value = savedBgColor;
textColorPicker.value = savedTextColor;
sampleText.style.backgroundColor = savedBgColor;
sampleText.style.color = savedTextColor;

updateContrastRatio(savedBgColor, savedTextColor);

// Add event listeners to the color pickers
bgColorPicker.addEventListener('input', (event) => {
    const bgColor = event.target.value;
    const textColor = textColorPicker.value;
    sampleText.style.backgroundColor = bgColor;
    updateContrastRatio(bgColor, textColor);
    localStorage.setItem('bgColor', bgColor);
});
textColorPicker.addEventListener('input', (event) => {
    const textColor = event.target.value;
    const bgColor = bgColorPicker.value;
    sampleText.style.color = textColor;
    updateContrastRatio(bgColor, textColor);
    localStorage.setItem('textColor', textColor);
});

// Function to calculate contrast ratio
function updateContrastRatio(bgColor, textColor) {
    const contrastRatio = getContrastRatio(bgColor, textColor);
    contrastRatioDisplay.textContent = `Contrast Ratio: ${contrastRatio.toFixed(2)}`;
    const wcagStatus = contrastRatio >= 4.5 ? 'Passes' : 'Fails';
    wcagStatusDisplay.textContent = `WCAG Status: ${wcagStatus}`;
}
// Contrast ratio calculation logic
function getContrastRatio(bgColor, textColor) {
    const bgLuminance = calculateLuminance(bgColor);
    const textLuminance = calculateLuminance(textColor);
    return (Math.max(bgLuminance, textLuminance) + 0.05) / (Math.min(bgLuminance, textLuminance) + 0.05);
}

function calculateLuminance(color) {
    // Tweak from How to programmatically calculate the contrast ratio between two colors? in StackOverflow
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

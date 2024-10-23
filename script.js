// Get references to the DOM elements
const bgColorPicker = document.getElementById('bgColor');
const textColorPicker = document.getElementById('textColor');
const contrastRatioDisplay = document.getElementById('contrastRatio');
const wcagStatusDisplay = document.getElementById('wcagStatus');

// Load saved colors from localStorage
const savedBgColor = localStorage.getItem('bgColor') || '#000000';
const savedTextColor = localStorage.getItem('textColor') || '#FFFFFF';

//Apply saved colors to elements
applyColors(savedBgColor, savedTextColor);
updateContrastRatio(savedBgColor, savedTextColor);

// Add event listeners to the color pickers
bgColorPicker.addEventListener('input', (event) => {
    const bgColor = event.target.value;
    const textColor = textColorPicker.value;
    applyColors(bgColor, textColor);
    updateContrastRatio(bgColor, textColor);
    localStorage.setItem('bgColor', bgColor);
});

textColorPicker.addEventListener('input', (event) => {
    const textColor = event.target.value;
    const bgColor = bgColorPicker.value;
    applyColors(bgColor, textColor);
    updateContrastRatio(bgColor, textColor);
    localStorage.setItem('textColor', textColor);
});

// Function to apply all color changes to elements
function applyColors(bgColor, textColor) {
    const textElements = document.querySelectorAll('.sampleTextColor');
    const bgElements = document.querySelectorAll('.sampleBgColor');

    bgElements.forEach((element) => {
        element.style.backgroundColor = bgColor;
    });

    textElements.forEach((element) => {
        element.style.color = textColor;
    });
}

// Function to update contrast ratio, and WCAG status
function updateContrastRatio(bgColor, textColor) {
    const contrastRatio = getContrastRatio(bgColor, textColor);
    contrastRatioDisplay.textContent = `Contrast Ratio: ${contrastRatio.toFixed(2)}`;

    const wcagStatus = contrastRatio >= 4.5 ? 'Passes' : 'Fails';
    wcagStatusDisplay.textContent = `WCAG Status: ${wcagStatus}`;

    // Todo: Add more detailed WCAG level checks (e.g., AA, AAA compliance)
}

// Contrast ratio calculation logic
function getContrastRatio(bgColor, textColor) {
    const bgLuminance = calculateLuminance(bgColor);
    const textLuminance = calculateLuminance(textColor);
    return (Math.max(bgLuminance, textLuminance) + 0.05) /
        (Math.min(bgLuminance, textLuminance) + 0.05);
}

// Function to calculate relative luminance
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

// Get references to the DOM elements
const bgColorPicker = document.getElementById('bgColor');
const textColorPicker = document.getElementById('textColor');
const colorSwitch = document.getElementById('colorSwitch');
const contrastRatioDisplay = document.getElementById('contrastRatio');
const wcagStatusAA = document.getElementById('wcagStatusAA');
const wcagStatusAAA = document.getElementById('wcagStatusAAA');
const randomizeButton = document.getElementById('randomizeColors');

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

colorSwitch.addEventListener('click', () => {
    // Swap the colors between the background and text color pickers
    const tempColor = bgColorPicker.value;
    bgColorPicker.value = textColorPicker.value;
    textColorPicker.value = tempColor;

    // Apply the swapped colors to the elements
    applyColors(bgColorPicker.value, textColorPicker.value);

    // Update contrast ratio and WCAG status
    updateContrastRatio(bgColorPicker.value, textColorPicker.value);

    // Save the swapped colors in localStorage
    localStorage.setItem('bgColor', bgColorPicker.value);
    localStorage.setItem('textColor', textColorPicker.value);
});

// Event listener for the randomize button
randomizeButton.addEventListener('click', () => {
    // Generate random AA-compliant colors for background and text
    const { randomBgColor, randomTextColor } = getRandomColorsWithFailureChance();

    // Apply the random colors to the color pickers and UI elements
    applyColors(randomBgColor, randomTextColor);

    // Update the contrast ratio and WCAG status
    updateContrastRatio(randomBgColor, randomTextColor);

    // Save the random colors to localStorage
    localStorage.setItem('bgColor', randomBgColor);
    localStorage.setItem('textColor', randomTextColor);
});

// Function to generate a random hex color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to generate random colors until AA compliance is achieved
function getRandomAACompliantColors() {
    let randomBgColor, randomTextColor, contrastRatio;

    // Repeat until a valid contrast ratio for AA compliance is achieved
    do {
        randomBgColor = getRandomColor();
        randomTextColor = getRandomColor();
        contrastRatio = getContrastRatio(randomBgColor, randomTextColor);
    } while (contrastRatio < 4.5);  // AA likelyhood

    return { randomBgColor, randomTextColor };
}

// Function to generate random colors (with a chance of low contrast results)
function getRandomColorsWithFailureChance() {
    const failureChance = Math.random(); // Generate a random number between 0 and 1
    
    // 90% chance to generate AA-compliant colors
    if (failureChance > 0.1) {
        return getRandomAACompliantColors();
    } 
    
    // 10% chance to allow poor A results (no AA requirement)
    return {
        randomBgColor: getRandomColor(),
        randomTextColor: getRandomColor()
    };
}

function updateHexValues(bgColor, textColor) {
    // Update the span elements with the new hex values
    document.getElementById('bgColorValue').textContent = bgColor;
    document.getElementById('textColorValue').textContent = textColor;
}

// Function to apply all color changes to elements
function applyColors(bgColor, textColor) {
    const textElements = document.querySelectorAll('.sampleTextColor');
    const bgElements = document.querySelectorAll('.sampleBgColor');
    const switchElements = document.querySelectorAll('.sampleSwitchColor');

    bgElements.forEach((element) => {
        element.style.backgroundColor = bgColor;
    });

    textElements.forEach((element) => {
        element.style.color = textColor;
    });

    switchElements.forEach((el) => {
        el.style.backgroundColor = textColor; // Swap colors
        el.style.color = bgColor;             // Swap colors
    });

    bgColorPicker.value = bgColor;
    textColorPicker.value = textColor;
    
    // Update the hex values display
    updateHexValues(bgColor, textColor);
}

// Function to update contrast ratio, and WCAG status
function updateContrastRatio(bgColor, textColor) {
    
    const contrastRatio = getContrastRatio(bgColor, textColor);
    const statusText = getStatusText(contrastRatio);

    contrastRatioDisplay.textContent = `${contrastRatio.toFixed(2)} ${statusText.text}`;
    contrastRatioDisplay.style.color = statusText.color;

    // Update the AA status symbol
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

    wcagStatusAA.style.color = statusText.aaColor;
    wcagStatusAAA.style.color = statusText.aaaColor;
}

function getStatusText(contrastRatio) {
    if (contrastRatio < 4.5) {
        // Both AA and AAA fail
        return { text: '(Poor)', color: '#d92d20', aaColor: '#d92d20', aaaColor: '#d92d20' };
    } else if (contrastRatio >= 4.5 && contrastRatio < 7.0) {
        // AA passes, but AAA fails
        return { text: '(Good)', color: '#079455', aaColor: '#079455', aaaColor: '#d92d20' };
    } else {
        // Both AA and AAA pass
        return { text: '(Very Good)', color: '#079455', aaColor: '#079455', aaaColor: '#079455' };
    }
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

// Convert hex color to RGB array
function hexToRgb(hex) {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

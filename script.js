// Get the result display element
const resultDisplay = document.querySelector('.result');
let currentExpression = '0';
let lastResult = null;
let memory = 0;
let degreeMode = true; // true for DEG, false for RAD

// Function to update the display
function updateDisplay() {
    resultDisplay.textContent = currentExpression;
}

// Helper function to evaluate mathematical expressions safely
function evaluateExpression(expression) {
    try {
        // Replace mathematical operators with JavaScript equivalents
        let processedExpression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/mod/g, '%')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');
        
        // Handle trigonometric functions and other special functions
        processedExpression = processedExpression
            .replace(/sin\(/g, degreeMode ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
            .replace(/cos\(/g, degreeMode ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
            .replace(/tan\(/g, degreeMode ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/\|(.+?)\|/g, 'Math.abs($1)');

        return eval(processedExpression);
    } catch (error) {
        console.error("Evaluation error:", error);
        return "Error";
    }
}

// Function to handle button clicks
function handleButtonClick(value) {
    // Clear the display if 'C' is pressed
    if (value === 'C') {
        currentExpression = '0';
    }
    // Evaluate the expression if '=' is pressed
    else if (value === '=') {
        try {
            const result = evaluateExpression(currentExpression);
            lastResult = result;
            currentExpression = String(result);
        } catch (error) {
            currentExpression = "Error";
        }
    }
    // Handle backspace
    else if (value === '⌫') {
        if (currentExpression.length === 1 || currentExpression === "Error") {
            currentExpression = '0';
        } else {
            currentExpression = currentExpression.slice(0, -1);
        }
    }
    // Handle special functions
    else if (value === 'π') {
        if (currentExpression === '0') {
            currentExpression = 'π';
        } else {
            currentExpression += 'π';
        }
    }
    else if (value === 'e') {
        if (currentExpression === '0') {
            currentExpression = 'e';
        } else {
            currentExpression += 'e';
        }
    }
    else if (value === 'x²') {
        if (currentExpression === '0') {
            currentExpression = '0';
        } else {
            try {
                const result = Math.pow(evaluateExpression(currentExpression), 2);
                currentExpression = String(result);
            } catch (error) {
                currentExpression = "Error";
            }
        }
    }
    else if (value === '√') {
        if (currentExpression === '0') {
            currentExpression = '√(';
        } else {
            currentExpression += '√(';
        }
    }
    else if (value === '1/x') {
        if (currentExpression === '0') {
            currentExpression = "Error";
        } else {
            try {
                const result = 1 / evaluateExpression(currentExpression);
                currentExpression = String(result);
            } catch (error) {
                currentExpression = "Error";
            }
        }
    }
    else if (value === '|x|') {
        currentExpression = `|${currentExpression}|`;
    }
    else if (value === 'n!') {
        try {
            const num = evaluateExpression(currentExpression);
            if (num < 0 || !Number.isInteger(num)) {
                currentExpression = "Error";
            } else {
                let factorial = 1;
                for (let i = 2; i <= num; i++) {
                    factorial *= i;
                }
                currentExpression = String(factorial);
            }
        } catch (error) {
            currentExpression = "Error";
        }
    }
    else if (value === 'log') {
        if (currentExpression === '0') {
            currentExpression = 'log(';
        } else {
            currentExpression += 'log(';
        }
    }
    else if (value === 'ln') {
        if (currentExpression === '0') {
            currentExpression = 'ln(';
        } else {
            currentExpression += 'ln(';
        }
    }
    else if (value === '10ˣ') {
        try {
            const result = Math.pow(10, evaluateExpression(currentExpression));
            currentExpression = String(result);
        } catch (error) {
            currentExpression = "Error";
        }
    }
    else if (value === 'xʸ') {
        currentExpression += '^';
    }
    else if (value === '+/-') {
        if (currentExpression !== '0') {
            if (currentExpression.startsWith('-')) {
                currentExpression = currentExpression.slice(1);
            } else {
                currentExpression = '-' + currentExpression;
            }
        }
    }
    // Memory functions
    else if (value === 'MC') {
        memory = 0;
    }
    else if (value === 'MR') {
        currentExpression = String(memory);
    }
    else if (value === 'M+') {
        try {
            memory += evaluateExpression(currentExpression);
        } catch (error) {
            // Do nothing on error
        }
    }
    else if (value === 'M-') {
        try {
            memory -= evaluateExpression(currentExpression);
        } catch (error) {
            // Do nothing on error
        }
    }
    else if (value === 'MS') {
        try {
            memory = evaluateExpression(currentExpression);
        } catch (error) {
            // Do nothing on error
        }
    }
    // Toggle between DEG and RAD
    else if (value === 'DEG' || value === 'RAD') {
        degreeMode = !degreeMode;
        document.querySelector('.unit').textContent = degreeMode ? 'DEG' : 'RAD';
        return; // Don't update display for this toggle
    }
    // Handle regular input
    else {
        if (currentExpression === '0' || currentExpression === "Error") {
            currentExpression = value;
        } else {
            currentExpression += value;
        }
    }
    
    updateDisplay();
}

// Event listeners for calculator buttons
document.querySelectorAll('.btn-col, .btn-col1, .unit, .scientific-result').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        handleButtonClick(buttonText);
    });
});

// Initialize calculator
updateDisplay();

// Add support for keyboard input
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Map keyboard keys to calculator buttons
    if (/[0-9]/.test(key)) {
        handleButtonClick(key);
    } else if (key === '+' || key === '-' || key === '.' || key === '(' || key === ')') {
        handleButtonClick(key);
    } else if (key === '*') {
        handleButtonClick('×');
    } else if (key === '/') {
        handleButtonClick('÷');
    } else if (key === 'Enter' || key === '=') {
        handleButtonClick('=');
    } else if (key === 'Backspace') {
        handleButtonClick('⌫');
    } else if (key === 'Escape') {
        handleButtonClick('C');
    } else if (key === '^') {
        handleButtonClick('xʸ');
    }
});

// Add trignometry dropdown functionality
const trigButton = document.querySelector('.trignometry');
trigButton.addEventListener('click', function() {
    // Create dropdown menu if it doesn't exist
    if (!document.querySelector('.trig-dropdown')) {
        const dropdown = document.createElement('div');
        dropdown.className = 'trig-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.backgroundColor = '#f5f5f5';
        dropdown.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        dropdown.style.zIndex = '1';
        dropdown.style.width = '150px';
        
        const trigFunctions = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹'];
        
        trigFunctions.forEach(func => {
            const option = document.createElement('div');
            option.textContent = func;
            option.style.padding = '12px 16px';
            option.style.cursor = 'pointer';
            option.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#e7e7e7';
            });
            option.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#f5f5f5';
            });
            option.addEventListener('click', function() {
                if (currentExpression === '0') {
                    currentExpression = `${func}(`;
                } else {
                    currentExpression += `${func}(`;
                }
                updateDisplay();
                document.querySelector('.trig-dropdown').remove();
            });
            dropdown.appendChild(option);
        });
        
        // Position the dropdown
        const rect = trigButton.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.left = `${rect.left}px`;
        
        document.body.appendChild(dropdown);
    } else {
        document.querySelector('.trig-dropdown').remove();
    }
});

// Add functions dropdown functionality
const funcButton = document.querySelector('.functions');
funcButton.addEventListener('click', function() {
    // Create dropdown menu if it doesn't exist
    if (!document.querySelector('.func-dropdown')) {
        const dropdown = document.createElement('div');
        dropdown.className = 'func-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.backgroundColor = '#f5f5f5';
        dropdown.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        dropdown.style.zIndex = '1';
        dropdown.style.width = '150px';
        
        const functions = ['abs', 'floor', 'ceil', 'rand', 'dms', 'deg'];
        
        functions.forEach(func => {
            const option = document.createElement('div');
            option.textContent = func;
            option.style.padding = '12px 16px';
            option.style.cursor = 'pointer';
            option.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#e7e7e7';
            });
            option.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#f5f5f5';
            });
            option.addEventListener('click', function() {
                if (func === 'rand') {
                    currentExpression = String(Math.random());
                } else if (func === 'floor') {
                    try {
                        currentExpression = String(Math.floor(evaluateExpression(currentExpression)));
                    } catch (error) {
                        currentExpression = "Error";
                    }
                } else if (func === 'ceil') {
                    try {
                        currentExpression = String(Math.ceil(evaluateExpression(currentExpression)));
                    } catch (error) {
                        currentExpression = "Error";
                    }
                } else {
                    if (currentExpression === '0') {
                        currentExpression = `${func}(`;
                    } else {
                        currentExpression += `${func}(`;
                    }
                }
                updateDisplay();
                document.querySelector('.func-dropdown').remove();
            });
            dropdown.appendChild(option);
        });
        
        // Position the dropdown
        const rect = funcButton.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.left = `${rect.left}px`;
        
        document.body.appendChild(dropdown);
    } else {
        document.querySelector('.func-dropdown').remove();
    }
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const trigDropdown = document.querySelector('.trig-dropdown');
    const funcDropdown = document.querySelector('.func-dropdown');
    const trigButton = document.querySelector('.trignometry');
    const funcButton = document.querySelector('.functions');
    
    if (trigDropdown && event.target !== trigButton && !trigButton.contains(event.target) && !trigDropdown.contains(event.target)) {
        trigDropdown.remove();
    }
    
    if (funcDropdown && event.target !== funcButton && !funcButton.contains(event.target) && !funcDropdown.contains(event.target)) {
        funcDropdown.remove();
    }
});

// Handle F-E (scientific notation) toggle
document.querySelector('.scientific-result').addEventListener('click', function() {
    try {
        const value = evaluateExpression(currentExpression);
        currentExpression = value.toExponential();
        updateDisplay();
    } catch (error) {
        currentExpression = "Error";
        updateDisplay();
    }
});
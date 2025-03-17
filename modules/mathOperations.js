import { ERROR, ERROR_INPUT } from './constants.js';
import { updateDisplay } from './display.js';
import { addToHistory } from './history.js';

export function equals(calculator) {
  try {
    if (calculator.inputStr === ERROR_INPUT || calculator.inputStr === ERROR) {
      return;
    }
    if (calculator.inputStr === "") return;

    const expressionToShow = calculator.displayStr;

    let result = eval(calculator.inputStr);
    result = parseFloat(result.toFixed(3));

    // Add to history
    addToHistory(calculator, expressionToShow, result);

    calculator.inputStr = result.toString();
    calculator.displayStr = calculator.inputStr;
  } catch (error) {
    calculator.inputStr = ERROR;
    calculator.displayStr = ERROR;
  }
  updateDisplay(calculator);
}

export function backspace(calculator) {
  if(!calculator.inputStr){
    return;
  }
  if(calculator.inputStr === ERROR || calculator.inputStr === ERROR_INPUT){
    calculator.clearCalc();
    return;
  }
  if (calculator.inputStr.endsWith("**")) {
    calculator.inputStr = calculator.inputStr.slice(0, -2);
    calculator.displayStr = calculator.displayStr.slice(0, -1);
  } else if (calculator.inputStr.endsWith("**2") || calculator.inputStr.endsWith("**3")) {
    calculator.inputStr = calculator.inputStr.slice(0, -3);
    calculator.displayStr = calculator.displayStr.slice(0, -1);
  } else {
    calculator.inputStr = calculator.inputStr.slice(0, -1);
    calculator.displayStr = calculator.displayStr.slice(0, -1);
  }
  updateDisplay(calculator);
}

// Trigonometric functions
export function sine(calculator) {
  calculator.inputStr += calculator.isDegree ? "Math.sin((Math.PI/180)*" : "Math.sin(";
  calculator.displayStr += "sin(";
  updateDisplay(calculator);
}

export function cosine(calculator) {
  calculator.inputStr += calculator.isDegree ? "Math.cos((Math.PI/180)*" : "Math.cos(";
  calculator.displayStr += "cos(";
  updateDisplay(calculator);
}

export function tangent(calculator) {
  calculator.inputStr += calculator.isDegree ? "Math.tan((Math.PI/180)*" : "Math.tan(";
  calculator.displayStr += "tan(";
  updateDisplay(calculator);
}

// Root operations
export function squareRoot(calculator) {
  if (calculator.isSecondFunction) {
    calculator.inputStr += "Math.cbrt(";
    calculator.displayStr += "∛(";
  } else {
    calculator.inputStr += "Math.sqrt(";
    calculator.displayStr += "√(";
  }
  updateDisplay(calculator);
}

// Power operations
export function square(calculator) {
  // Remove previous exponent if backspaced
  calculator.inputStr = calculator.inputStr.replace(/\*\*3$|\*\*2$/, "");
  calculator.displayStr = calculator.displayStr.replace(/[²³]$/, "");

  if (calculator.inputStr === "" || /[*+\-/^]$/.test(calculator.inputStr)) return;

  // if 2nd is clicked then change the inputStr with cube
  if (calculator.isSecondFunction) {
    calculator.inputStr += "**3";
    calculator.displayStr += "³";
  } else {
    calculator.inputStr += "**2";
    calculator.displayStr += "²";
  }

  updateDisplay(calculator);
}

export function powerOfTen(calculator) {
  if (calculator.inputStr === "" || /[\+\-\*\/\(]$/.test(calculator.inputStr)) {
    calculator.inputStr += "10**";
    calculator.displayStr += "10^";
  } else {
    calculator.inputStr += "*10**";
    calculator.displayStr += "*10^";
  }
  updateDisplay(calculator);
}

export function xToPowerY(calculator) {
  if (!calculator.inputStr.endsWith("**")) {
    calculator.inputStr += "**";
    calculator.displayStr += "^";
    updateDisplay(calculator);
  }
}

// Floor and ceiling
export function floorValue(calculator) {
  calculator.inputStr += "Math.floor(";
  calculator.displayStr += "floor(";
  updateDisplay(calculator);
}

export function ceilValue(calculator) {
  calculator.inputStr += "Math.ceil(";
  calculator.displayStr += "ceil(";
  updateDisplay(calculator);
}

// Logarithmic functions
export function logarithm(calculator) {
  calculator.inputStr += "Math.log(";
  calculator.displayStr += "log(";
  updateDisplay(calculator);
}

export function naturalLogarithm(calculator) {
  calculator.inputStr += "Math.log10(";
  calculator.displayStr += "ln(";
  updateDisplay(calculator);
}

// Absolute value
export function absoluteValue(calculator) {
  calculator.inputStr += "Math.abs(";
  calculator.displayStr += "abs(";
  updateDisplay(calculator);
}

// Constants
export function pie(calculator) {
  if (calculator.inputStr && !isNaN(calculator.inputStr[calculator.inputStr.length - 1])) {
    calculator.inputStr += "*Math.PI";
    calculator.displayStr += "*π";
  } else {
    calculator.inputStr += "Math.PI";
    calculator.displayStr += "π";
  }
  updateDisplay(calculator);
}

export function exponent(calculator) {
  if (calculator.inputStr && !isNaN(calculator.inputStr[calculator.inputStr.length - 1])) {
    calculator.inputStr += "*Math.E";
    calculator.displayStr += "*e";
  } else {
    calculator.inputStr += "Math.E";
    calculator.displayStr += "e";
  }
  updateDisplay(calculator);
}

// Factorial
export function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function factorialHandler(calculator) {
  if (calculator.inputStr === "" || isNaN(calculator.inputStr[calculator.inputStr.length - 1]))
    return;

  let num = "";
  let i = calculator.inputStr.length - 1;

  // Extract the last number manually
  while (i >= 0 && !isNaN(calculator.inputStr[i])) {
    num = calculator.inputStr[i] + num;
    i--;
  }

  if (num !== "") {
    let factValue = factorial(Number(num));

    // Update inputStr to store function call for later evaluation
    calculator.inputStr = calculator.inputStr.slice(0, i + 1) + factValue;
    calculator.displayStr += "!";
  }

  updateDisplay(calculator);
}
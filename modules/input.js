import { updateDisplay } from './display.js';
import { 
  equals, backspace, sine, cosine, tangent, floorValue, ceilValue,
  logarithm, naturalLogarithm, absoluteValue, square, squareRoot,
  powerOfTen, xToPowerY, factorialHandler, pie, exponent 
} from './mathOperations.js';
import { handleMemoryClick } from './memory.js';
import { degreeClickEventHandler, changeMode } from './ui.js';
import { toggleHistoryDisplay, clearHistory } from './history.js';

export function initInputHandlers(calculator) {
  // Bind necessary methods to maintain context
  const boundKeyClick = keyClickEventHandler.bind(null, calculator);
  const boundBackspace = backSpaceEventHandler.bind(null, calculator);
  const boundKeyPress = keyPressEventHandler.bind(null, calculator);
  const boundMemoryClick = handleMemoryClick.bind(null, calculator);
  const boundDegreeClick = degreeClickEventHandler.bind(null, calculator);

  // Set up event listeners
  document.querySelector(".keypad").addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (button) {
      boundKeyClick(e);
    }
  });

  document.addEventListener("keydown", boundBackspace);
  document.addEventListener("keypress", boundKeyPress);
  document.querySelector(".trigno-dropdown").addEventListener("click", boundKeyClick);
  document.querySelector(".func-dropdown").addEventListener("click", boundKeyClick);
  document.querySelector(".memory-btn").addEventListener("click", boundMemoryClick);
  document.querySelector(".toggle-btn").addEventListener("click", boundDegreeClick);
  
  // Add history button event listeners
  const historyBtn = document.querySelector(".history-toggle-btn");
  if (historyBtn) {
    historyBtn.addEventListener("click", () => toggleHistoryDisplay(calculator));
  }
  
  const clearHistoryBtn = document.querySelector(".clear-history-btn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => clearHistory(calculator));
  }
}

export function keyClickEventHandler(calculator, e) {
  let buttonEl = e.target.closest("button");
  let currentKey = buttonEl?.value;

  if (!currentKey) {
    console.log("No button value found");
    return;
  }

  switch (currentKey) {
    case "=":
      equals(calculator);
      break;
    case "backspace":
      backspace(calculator);
      break;
    case "2nd":
      changeMode(calculator);
      break;
    case "sin":
      sine(calculator);
      break;
    case "cos":
      cosine(calculator);
      break;
    case "tan":
      tangent(calculator);
      break;
    case "C":
      calculator.clearCalc(); // This is kept in the calculator object
      break;
    case "e":
      exponent(calculator);
      break;
    case "floor":
      floorValue(calculator);
      break;
    case "ceil":
      ceilValue(calculator);
      break;
    case "log":
      logarithm(calculator);
      break;
    case "ln":
      naturalLogarithm(calculator);
      break;
    case "abs":
      absoluteValue(calculator);
      break;
    case "square":
      square(calculator);
      break;
    case "squareroot":
      squareRoot(calculator);
      break;
    case "10^x":
      powerOfTen(calculator);
      break;
    case "xy":
      xToPowerY(calculator);
      break;
    case "inverse":
      calculator.inverseValue(); // This is kept in the calculator object
      break;
    case "+/-":
      calculator.toggleSign(); // This is kept in the calculator object
      break;
    case "factorial":
      factorialHandler(calculator);
      break;
    case "pi":
      pie(calculator);
      break;
    case "exponential":
      calculator.toggleExponential(); // This is kept in the calculator object
      break;
    default:
      calculator.inputStr += currentKey;
      calculator.displayStr += currentKey;
      break;
  }

  updateDisplay(calculator);
}

export function backSpaceEventHandler(calculator, e) {
  if (e.key === "Backspace") {
    backspace(calculator);
  }
}

export function keyPressEventHandler(calculator, e) {
  let allowedKeyPress = new Set([
    "Enter",
    "Backspace",
    "(",
    ")",
    "*",
    "-",
    "+",
    "/",
    ".",
    "=",
  ]);
  let key = e.key;

  if ((key >= "0" && key <= "9") || allowedKeyPress.has(key)) {
    if (key === "Enter" || key === "=") {
      equals(calculator);
    } else {
      if (calculator.inputStr === calculator.ERROR) return;
      calculator.inputStr += key;
      calculator.displayStr += key;
      updateDisplay(calculator);
    }
  }
}
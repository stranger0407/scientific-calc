import { updateDisplay } from './display.js';
import { handleMemoryClick } from './memory.js';
import { toggleHistoryDisplay, clearHistory } from './history.js';
import { keyClickEventHandler, backSpaceEventHandler, keyPressEventHandler } from './input.js';

export function initUIHandlers(calculator) {
  // Set up keypad click events
  document.querySelector(".keypad").addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (button) {
      keyClickEventHandler(calculator, e);
    }
  });

  // Set up keyboard events
  document.addEventListener("keydown", (e) => backSpaceEventHandler(calculator, e));
  document.addEventListener("keypress", (e) => keyPressEventHandler(calculator, e));

  // Set up dropdown menus
  document
    .querySelector(".trigno-dropdown")
    .addEventListener("click", (e) => keyClickEventHandler(calculator, e));

  document
    .querySelector(".func-dropdown")
    .addEventListener("click", (e) => keyClickEventHandler(calculator, e));

  // Set up memory buttons
  document
    .querySelector(".memory-btn")
    .addEventListener("click", (e) => handleMemoryClick(calculator, e));

  // Set up toggle buttons
  document
    .querySelector(".toggle-btn")
    .addEventListener("click", (e) => degreeClickEventHandler(calculator, e));

  // Add history button event listener if available
  const historyBtn = document.querySelector(".history-toggle-btn");
  if (historyBtn) {
    historyBtn.addEventListener("click", () => toggleHistoryDisplay(calculator));
  }

  // Add clear history button event listener if available
  const clearHistoryBtn = document.querySelector(".clear-history-btn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => clearHistory(calculator));
  }
}

export function changeMode(calculator) {
  calculator.isSecondFunction = !calculator.isSecondFunction;

  document.querySelector("[value='square']").textContent = calculator.isSecondFunction
    ? "x³"
    : "x²";
  document.querySelector("[value='√']").textContent = calculator.isSecondFunction
    ? "∛x"
    : "√x";
}

export function degree(calculator) {
  calculator.isDegree = !calculator.isDegree;
  document.querySelector(".unit").textContent = calculator.isDegree ? "DEG" : "RAD";

  // Update display to reflect the change if there's a result
  if (calculator.inputStr && !isNaN(Number(calculator.inputStr))) {
    updateDisplay(calculator);
  }
}

export function degreeClickEventHandler(calculator, e) {
  let currentKey = e.target.closest("button")?.value;
  switch (currentKey) {
    case "degree":
      degree(calculator);
      break;
    case "F-E":
      toggleExponential(calculator);
      break;
    default:
      break;
  }
}

export function toggleExponential(calculator) {
  if (!calculator.inputStr || isNaN(Number(calculator.inputStr))) return;

  let num = Number(calculator.inputStr);
  calculator.isExponential = !calculator.isExponential;

  if (calculator.isExponential) {
    // Format the number in scientific notation
    let exponentStr = num.toExponential(2); // 2 decimal places
    let [mantissa, exponent] = exponentStr.split("e");

    // Store the original number for calculations
    calculator.inputStr = num.toString();
    // Display in scientific notation
    calculator.displayStr = `${mantissa}×10^${Number(exponent)}`;
  } else {
    // Return to standard notation
    calculator.inputStr = num.toString();
    calculator.displayStr = calculator.inputStr;
  }

  updateDisplay(calculator);
}
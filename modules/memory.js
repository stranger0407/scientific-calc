import { updateDisplay } from './display.js';

export function initMemory(calculator) {
  loadMemoryFromStorage(calculator);
}

export function loadMemoryFromStorage(calculator) {
  const savedMemory = localStorage.getItem("calculatorMemory");
  calculator.memory = savedMemory ? parseFloat(savedMemory) : null;
}

export function saveMemoryToStorage(calculator) {
  if (calculator.memory !== null) {
    localStorage.setItem("calculatorMemory", calculator.memory.toString());
  } else {
    localStorage.removeItem("calculatorMemory");
  }
}

export function updateMemoryButtons(calculator) {
  const hasMemory = calculator.memory !== null;
  const mcButton = document.querySelector('[value="MC"]');
  const mrButton = document.querySelector('[value="MR"]');

  if (mcButton) mcButton.classList.toggle("fade-color", !hasMemory);
  if (mrButton) mrButton.classList.toggle("fade-color", !hasMemory);
}

export function handleMemoryClick(calculator, e) {
  const button = e.target.closest("button");
  if (!button) return;

  const action = button.textContent.trim();
  let currentValue = 0;

  try {
    if (calculator.inputStr && calculator.inputStr !== calculator.ERROR) {
      currentValue = parseFloat(eval(calculator.inputStr));
    }
  } catch (error) {
    console.error("Error calculating current value:", error);
    return;
  }

  switch (action) {
    case "MC": // Memory Clear
      calculator.memory = null;
      break;
    case "MR": // Memory Recall
      if (calculator.memory !== null) {
        calculator.inputStr = calculator.memory.toString();
        calculator.displayStr = calculator.inputStr;
      }
      break;
    case "M+": // Memory Add
      if (calculator.memory === null) {
        calculator.memory = currentValue;
      } else {
        calculator.memory += currentValue;
      }
      break;
    case "M-": // Memory Subtract
      if (calculator.memory === null) {
        calculator.memory = -currentValue;
      } else {
        calculator.memory -= currentValue;
      }
      break;
    case "MS": // Memory Store
      calculator.memory = currentValue;
      break;
  }

  saveMemoryToStorage(calculator);
  updateMemoryButtons(calculator);
  updateDisplay(calculator);
}
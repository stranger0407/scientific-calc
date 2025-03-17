import { ERROR, ERROR_INPUT, MAX_HISTORY_LENGTH } from './constants.js';
import { updateDisplay } from './display.js';
import { initInputHandlers } from './inputHandler.js';
import { initMemory, updateMemoryButtons } from './memory.js';
import { initHistory } from './history.js';
import { initUIHandlers } from './ui.js';
import { addToHistory } from './history.js';

export class ScientificCalculator {
  constructor() {
    // State variables
    this.inputStr = "";
    this.displayStr = "";
    this.isSecondFunction = false;
    this.isDegree = true;
    this.isExponential = false;
    this.memory = null;
    this.calculationHistory = [];
    this.MAX_HISTORY_LENGTH = MAX_HISTORY_LENGTH;

    // DOM elements
    this.display = document.querySelector(".result");

    // Initialize modules
    initMemory(this);
    initHistory(this);
    updateDisplay(this);
    updateMemoryButtons(this);
    initInputHandlers(this);
    initUIHandlers(this);
  }

  // Core methods
  clearCalc() {
    this.inputStr = "";
    this.displayStr = "";
    updateDisplay(this);
  }

  equals() {
    try {
      if (this.inputStr === ERROR_INPUT || this.inputStr === ERROR) {
        return;
      }
      if (this.inputStr === "") return;

      const expressionToShow = this.displayStr;

      let result = eval(this.inputStr);
      result = parseFloat(result.toFixed(3));

      // Add to history
      addToHistory(this, expressionToShow, result);

      this.inputStr = result.toString();
      this.displayStr = this.inputStr;
    } catch (error) {
      this.inputStr = ERROR;
      this.displayStr = ERROR;
    }
    updateDisplay(this);
  }

  backspace() {
    if(!this.inputStr){
        return;
    }
    if(this.inputStr === ERROR || this.inputStr === ERROR_INPUT){
      this.clearCalc();
      return;
    }
    if (this.inputStr.endsWith("**")) {
      this.inputStr = this.inputStr.slice(0, -2);
      this.displayStr = this.displayStr.slice(0, -1);
    } else if (this.inputStr.endsWith("**2") || this.inputStr.endsWith("**3")) {
      this.inputStr = this.inputStr.slice(0, -3);
      this.displayStr = this.displayStr.slice(0, -1);
    } else {
      this.inputStr = this.inputStr.slice(0, -1);
      this.displayStr = this.displayStr.slice(0, -1);
    }
    updateDisplay(this);
  }

  toggleSign() {
    if (this.inputStr === "") this.inputStr = "0";
    if (typeof this.inputStr !== "string")
      this.inputStr = this.inputStr.toString();

    let match = this.inputStr.match(/(-?\d+(\.\d+)?)$/);
    if (match) {
      let num = Number(match[1]);
      let toggled = num * -1;
      this.inputStr = this.inputStr.replace(/(-?\d+(\.\d+)?)$/, `${toggled}`);
      this.displayStr = this.inputStr;
    }
    updateDisplay(this);
  }

  toggleExponential() {
    if (!this.inputStr || isNaN(Number(this.inputStr))) return;

    let num = Number(this.inputStr);
    this.isExponential = !this.isExponential;

    if (this.isExponential) {
      // Format the number in scientific notation
      let exponentStr = num.toExponential(2); // 2 decimal places
      let [mantissa, exponent] = exponentStr.split("e");

      // Store the original number for calculations
      this.inputStr = num.toString();
      // Display in scientific notation
      this.displayStr = `${mantissa}×10^${Number(exponent)}`;
    } else {
      // Return to standard notation
      this.inputStr = num.toString();
      this.displayStr = this.inputStr;
    }

    updateDisplay(this);
  }

  inverseValue() {
    if (typeof this.inputStr !== "string")
      this.inputStr = this.inputStr.toString();
    let match = this.inputStr.match(/(\d+(\.\d+)?)$/);
    if (match) {
      let num = Number(match[1]);
      let inverse = `1/(${num})`;
      this.inputStr = this.inputStr.replace(/(\d+(\.\d+)?)$/, inverse);
      this.displayStr = this.inputStr;
    }
    updateDisplay(this);
  }

  changeMode() {
    this.isSecondFunction = !this.isSecondFunction;

    document.querySelector("[value='square']").textContent = this
      .isSecondFunction
      ? "x³"
      : "x²";
    document.querySelector("[value='√']").textContent = this.isSecondFunction
      ? "∛x"
      : "√x";
  }

  degree() {
    this.isDegree = !this.isDegree;
    document.querySelector(".unit").textContent = this.isDegree ? "DEG" : "RAD";

    // Update display to reflect the change if there's a result
    if (this.inputStr && !isNaN(Number(this.inputStr))) {
      updateDisplay(this);
    }
  }
}

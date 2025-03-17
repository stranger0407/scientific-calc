class ScientificCalculator {
  constructor() {
    // Constants
    this.ERROR = "Error";
    this.ERROR_INPUT = "Error";

    // State variables
    this.inputStr = "";
    this.displayStr = "";
    this.isSecondFunction = false;
    this.isDegree = true;
    this.isExponential = false;
    this.memory = null;
    this.calculationHistory = [];
    this.MAX_HISTORY_LENGTH = 5;

    // DOM elements
    this.display = document.querySelector(".result");

    // Initialize memory
    this.loadMemoryFromStorage();

    // Initialize history
    this.loadHistoryFromStorage();

    // Initialize UI
    this.updateDisplay();
    this.updateMemoryButtons();

    // Bind methods to maintain 'this' context
    this.keyClickEventHandler = this.keyClickEventHandler.bind(this);
    this.backSpaceEventHandler = this.backSpaceEventHandler.bind(this);
    this.keyPressEventHandler = this.keyPressEventHandler.bind(this);
    this.handleMemoryClick = this.handleMemoryClick.bind(this);
    this.degreeClickEventHandler = this.degreeClickEventHandler.bind(this);

    // Initialize event listeners
    this.initEventListeners();
  }

  initEventListeners() {
    document.querySelector(".keypad").addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (button) {
        this.keyClickEventHandler(e);
      }
    });

    document.addEventListener("keydown", this.backSpaceEventHandler);
    document.addEventListener("keypress", this.keyPressEventHandler);

    document
      .querySelector(".trigno-dropdown")
      .addEventListener("click", this.keyClickEventHandler);

    document
      .querySelector(".func-dropdown")
      .addEventListener("click", this.keyClickEventHandler);

    document
      .querySelector(".memory-btn")
      .addEventListener("click", this.handleMemoryClick);

    document
      .querySelector(".toggle-btn")
      .addEventListener("click", this.degreeClickEventHandler);

    // Add history button event listener if available
    const historyBtn = document.querySelector(".history-toggle-btn");
    if (historyBtn) {
      historyBtn.addEventListener("click", () => this.toggleHistoryDisplay());
    }

    // Add clear history button event listener if available
    const clearHistoryBtn = document.querySelector(".clear-history-btn");
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", () => this.clearHistory());
    }
  }

  // Display functions
  updateDisplay() {
    this.display.textContent = this.displayStr || "0";
  }

  // Input handling functions
  backSpaceEventHandler(e) {
    if (e.key === "Backspace") {
     this.backspace();
    }


  }

  keyPressEventHandler(e) {
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
        this.equals();
      } else {
        if (this.inputStr === this.ERROR) return;
        this.inputStr += key;
        this.displayStr += key;
        this.updateDisplay();
      }
    }
  }

  keyClickEventHandler(e) {
    let buttonEl = e.target.closest("button");
    let currentKey = buttonEl?.value;

    if (!currentKey) {
      console.log("No button value found");
      return;
    }

    switch (currentKey) {
      case "=":
        this.equals();
        break;
      case "backspace":
        this.backspace();
        break;
      case "2nd":
        this.changeMode();
        break;
      case "sin":
        this.sine();
        break;
      case "cos":
        this.cosine();
        break;
      case "tan":
        this.tangent();
        break;
      case "C":
        this.clearCalc();
        break;
      case "e":
        this.exponent();
        break;
      case "floor":
        this.floorValue();
        break;
      case "ceil":
        this.ceilValue();
        break;
      case "log":
        this.logarithm();
        break;
      case "ln":
        this.naturalLogarithm();
        break;
      case "abs":
        this.absoluteValue();
        break;
      case "square":
        this.square();
        break;
      case "squareroot":
        this.squareRoot();
        break;
      case "10^x":
        this.powerOfTen();
        break;
      case "xy":
        this.xToPowerY();
        break;
      case "inverse":
        this.inverseValue();
        break;
      case "+/-":
        this.toggleSign();
        break;
      case "factorial":
        this.factorialHandler();
        break;
      case "pi":
        this.pie();
        break;
      case "exponential":
        this.toggleExponential();
        break;
      default:
        this.inputStr += currentKey;
        this.displayStr += currentKey;
        break;
    }

    this.updateDisplay();
  }

  // Calculation functions
  equals() {
    try {
      if (this.inputStr === this.ERROR_INPUT || this.inputStr === this.ERROR) {
        return;
      }
      if (this.inputStr === "") return;

      const expressionToShow = this.displayStr; // Save the expression

      let result = eval(this.inputStr);
      result = parseFloat(result.toFixed(3));

      // Add to history
      this.addToHistory(expressionToShow, result);

      this.inputStr = result.toString();
      this.displayStr = this.inputStr;
    } catch (error) {
      this.inputStr = this.ERROR;
      this.displayStr = this.ERROR;
    }
    this.updateDisplay();
  }

  clearCalc() {
    this.inputStr = "";
    this.displayStr = "";
    this.updateDisplay();
  }

  backspace() {
    if(!this.inputStr){
        return;
    }
    if(this.inputStr===this.ERROR ||this.inputStr===this.ERROR_INPUT){
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
    this.updateDisplay();
  }

  // Basic math functions
  squareRoot() {
    if (this.isSecondFunction) {
      this.inputStr += "Math.cbrt(";
      this.displayStr += "∛(";
    } else {
      this.inputStr += "Math.sqrt(";
      this.displayStr += "√(";
    }
    this.updateDisplay();
  }

  // Trigonometric functions
  sine() {
    this.inputStr += this.isDegree ? "Math.sin((Math.PI/180)*" : "Math.sin(";
    this.displayStr += "sin(";
    this.updateDisplay();
  }

  cosine() {
    this.inputStr += this.isDegree ? "Math.cos((Math.PI/180)*" : "Math.cos(";
    this.displayStr += "cos(";
    this.updateDisplay();
  }

  tangent() {
    this.inputStr += this.isDegree ? "Math.tan((Math.PI/180)*" : "Math.tan(";
    this.displayStr += "tan(";
    this.updateDisplay();
  }

  // Other math functions
  floorValue() {
    this.inputStr += "Math.floor(";
    this.displayStr += "floor(";
    this.updateDisplay();
  }

  ceilValue() {
    this.inputStr += "Math.ceil(";
    this.displayStr += "ceil(";
    this.updateDisplay();
  }

  logarithm() {
    this.inputStr += "Math.log(";
    this.displayStr += "log(";
    this.updateDisplay();
  }

  naturalLogarithm() {
    this.inputStr += "Math.log10(";
    this.displayStr += "ln(";
    this.updateDisplay();
  }

  absoluteValue() {
    this.inputStr += "Math.abs(";
    this.displayStr += "abs(";
    this.updateDisplay();
  }

  // Power functions
  square() {
    // Remove previous exponent if backspaced
    this.inputStr = this.inputStr.replace(/\*\*3$|\*\*2$/, "");
    this.displayStr = this.displayStr.replace(/[²³]$/, "");

    if (this.inputStr === "" || /[*+\-/^]$/.test(this.inputStr)) return;

    // if 2nd is clicked then change the inputStr with cube
    if (this.isSecondFunction) {
      this.inputStr += "**3";
      this.displayStr += "³";
    } else {
      this.inputStr += "**2";
      this.displayStr += "²";
    }

    this.updateDisplay();
  }

  powerOfTen() {
    if (this.inputStr === "" || /[\+\-\*\/\(]$/.test(this.inputStr)) {
      this.inputStr += "10**";
      this.displayStr += "10^";
    } else {
      this.inputStr += "*10**";
      this.displayStr += "*10^";
    }
    this.updateDisplay();
  }

  xToPowerY() {
    if (!this.inputStr.endsWith("**")) {
      this.inputStr += "**";
      this.displayStr += "^";
      this.updateDisplay();
    }
  }

  // Constants
  pie() {
    if (this.inputStr && !isNaN(this.inputStr[this.inputStr.length - 1])) {
      this.inputStr += "*Math.PI";
      this.displayStr += "*π";
    } else {
      this.inputStr += "Math.PI";
      this.displayStr += "π";
    }
    this.updateDisplay();
  }

  exponent() {
    if (this.inputStr && !isNaN(this.inputStr[this.inputStr.length - 1])) {
      this.inputStr += "*Math.E";
      this.displayStr += "*e";
    } else {
      this.inputStr += "Math.E";
      this.displayStr += "e";
    }
    this.updateDisplay();
  }

  // Special functions
  factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  factorialHandler() {
    if (this.inputStr === "" || isNaN(this.inputStr[this.inputStr.length - 1]))
      return;

    let num = "";
    let i = this.inputStr.length - 1;

    // Extract the last number manually
    while (i >= 0 && !isNaN(this.inputStr[i])) {
      num = this.inputStr[i] + num;
      i--;
    }

    if (num !== "") {
      let factValue = this.factorial(Number(num));

      // Update inputStr to store function call for later evaluation
      this.inputStr = this.inputStr.slice(0, i + 1) + factValue;
      this.displayStr += "!";
    }

    this.updateDisplay();
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
    this.updateDisplay();
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
    this.updateDisplay();
  }

  // Mode change functions
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
      this.updateDisplay();
    }
  }

  // Memory functions
  loadMemoryFromStorage() {
    const savedMemory = localStorage.getItem("calculatorMemory");
    this.memory = savedMemory ? parseFloat(savedMemory) : null;
  }

  saveMemoryToStorage() {
    if (this.memory !== null) {
      localStorage.setItem("calculatorMemory", this.memory.toString());
    } else {
      localStorage.removeItem("calculatorMemory");
    }
  }

  updateMemoryButtons() {
    const hasMemory = this.memory !== null;
    const mcButton = document.querySelector('[value="MC"]');
    const mrButton = document.querySelector('[value="MR"]');

    if (mcButton) mcButton.classList.toggle("fade-color", !hasMemory);
    if (mrButton) mrButton.classList.toggle("fade-color", !hasMemory);
  }

  handleMemoryClick(e) {
    const button = e.target.closest("button");
    if (!button) return;

    const action = button.textContent.trim();
    let currentValue = 0;

    try {
      if (this.inputStr && this.inputStr !== this.ERROR) {
        currentValue = parseFloat(eval(this.inputStr));
      }
    } catch (error) {
      console.error("Error calculating current value:", error);
      return;
    }

    switch (action) {
      case "MC": // Memory Clear
        this.memory = null;
        break;
      case "MR": // Memory Recall
        if (this.memory !== null) {
          this.inputStr = this.memory.toString();
          this.displayStr = this.inputStr;
        }
        break;
      case "M+": // Memory Add
        if (this.memory === null) {
          this.memory = currentValue;
        } else {
          this.memory += currentValue;
        }
        break;
      case "M-": // Memory Subtract
        if (this.memory === null) {
          this.memory = -currentValue;
        } else {
          this.memory -= currentValue;
        }
        break;
      case "MS": // Memory Store
        this.memory = currentValue;
        break;
    }

    this.saveMemoryToStorage();
    this.updateMemoryButtons();
    this.updateDisplay();
  }
  // History functions
  loadHistoryFromStorage() {
    const savedHistory = localStorage.getItem("calculatorHistory");
    this.calculationHistory = savedHistory ? JSON.parse(savedHistory) : [];
  }

  saveHistoryToStorage() {
    localStorage.setItem(
      "calculatorHistory",
      JSON.stringify(this.calculationHistory)
    );
  }

  addToHistory(expression, result) {
    this.calculationHistory.unshift({
      expression,
      result: result.toString(),
    });

    // Keep history at maximum length
    if (this.calculationHistory.length > this.MAX_HISTORY_LENGTH) {
      this.calculationHistory = this.calculationHistory.slice(
        0,
        this.MAX_HISTORY_LENGTH
      );
    }

    this.saveHistoryToStorage();
  }

  clearHistory() {
    this.calculationHistory = [];
    this.saveHistoryToStorage();

    // Update UI if history panel is visible
    const historyPanel = document.querySelector(".history-panel");
    if (historyPanel && historyPanel.style.display !== "none") {
      this.renderHistoryPanel();
    }
  }

  toggleHistoryDisplay() {
    const historyPanel = document.querySelector(".history-panel");
    if (historyPanel) {
      if (historyPanel.style.display === "none") {
        historyPanel.style.display = "block";
        this.renderHistoryPanel();
      } else {
        historyPanel.style.display = "none";
      }
    }
  }

  createHistoryPanel() {
    let panel = document.createElement("div");
    panel.className = "history-panel";
    document.querySelector(".calculator").appendChild(panel);
    this.renderHistoryPanel();
  }

  renderHistoryPanel() {
    const panel = document.querySelector(".history-panel");
    if (!panel) return;

    const historyList = panel.querySelector(".history-list");
    historyList.innerHTML = "";

    if (this.calculationHistory.length === 0) {
      historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
      return;
    }

    this.calculationHistory.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.className = "history-item";
      listItem.textContent = `${item.expression} = ${item.result}`;
      listItem.addEventListener("click", () => {
        this.inputStr = item.result;
        this.displayStr = item.result;
        this.updateDisplay();
        // Optional: hide the panel after selection
        panel.style.display = "none";
      });
      historyList.appendChild(listItem);
    });
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

    this.updateDisplay();
  }

  degreeClickEventHandler(e) {
    let currentKey = e.target.closest("button")?.value;
    switch (currentKey) {
      case "degree":
        this.degree(); // Note the 'this.'
        break;
      case "F-E":
        this.toggleExponential(); // Note the 'this.'
        break;
      default:
        break;
    }
  }
}
const calculator = new ScientificCalculator();

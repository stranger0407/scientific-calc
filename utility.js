// Calculator Model class to handle calculations and memory
class CalculatorModel {
  constructor() {
    this.expression = "";
    this.result = "";
    this.temp = 0;
    this.memoryValue = 0;
    this.isRadian = false;
    this.scientificNotation = false;
  }

  evaluateExpression(expr) {
    expr = expr.replace(/\^/g, '**');
    
    try {
      return eval(expr);
    } catch (error) {
      throw new Error("Invalid expression");
    }
  }

  insertValue(value) {
    if (this.expression === '0' || this.expression === "Error") {
      this.expression = String(value);
    } else {
      if (/[\d\)]$/.test(this.expression)) {
        this.expression += '*' + value;
      } else {
        this.expression += value;
      }
    }
  }

  clear() {
    this.expression = '';
  }

  equals() {
    try {
      this.temp = this.evaluateExpression(this.expression);
      this.result = this.temp;
      this.expression = String(this.temp);
    } catch (error) {
      this.expression = "Error";
    }
  }

  backspace() {
    if (this.expression.length === 1 || this.expression === "Error") {
      this.expression = '0';
    } else {
      this.expression = this.expression.slice(0, -1);
    }
  }

  applyOperation(operation) {
    try {
      let value = this.evaluateExpression(this.expression);
      
      switch(operation) {
        case 'square':
          this.temp = Math.pow(value, 2);
          break;
        case 'squareroot':
          this.temp = Math.sqrt(value);
          break;
        case 'inverse':
          this.temp = 1 / value;
          break;
        case 'abs':
          this.temp = Math.abs(value);
          break;
        case 'log':
          this.temp = Math.log10(value);
          break;
        case 'ln':
          this.temp = Math.log(value);
          break;
        case '10x':
          this.temp = Math.pow(10, value);
          break;
        case 'ceil':
          this.temp = Math.ceil(value);
          break;
        case 'floor':
          this.temp = Math.floor(value);
          break;
        case 'exponential':
          this.temp = Math.exp(value);
          break;
        case '+/-':
          this.temp = -1 * value;
          break;
        case 'factorial':
          if (value < 0 || !Number.isInteger(value)) {
            this.expression = "Error";
            return;
          } else {
            let fac = 1;
            for (let i = 2; i <= value; i++) {
              fac = fac * i;
            }
            this.temp = fac;
          }
          break;
        default:
          return;
      }
      
      this.expression = String(this.temp);
    } catch (error) {
      this.expression = "Error";
    }
  }

  applyTrigFunction(func) {
    try {
      let angle = this.evaluateExpression(this.expression);
      if (!this.isRadian) {
        angle = angle * Math.PI / 180;
      }
      
      switch(func) {
        case 'sin':
          this.temp = Math.sin(angle);
          break;
        case 'cos':
          this.temp = Math.cos(angle);
          break;
        case 'tan':
          this.temp = Math.tan(angle);
          break;
        default:
          return;
      }
      
      this.expression = String(this.temp);
    } catch (error) {
      this.expression = "Error";
    }
  }

  memoryOperation(operation) {
    switch(operation) {
      case 'MC':
        this.memoryValue = 0;
        break;
      case 'MR':
        this.expression = String(this.memoryValue);
        break;
      case 'M+':
        try {
          this.memoryValue += this.evaluateExpression(this.expression);
        } catch (error) {
          this.expression = "Error";
        }
        break;
      case 'M-':
        try {
          this.memoryValue -= this.evaluateExpression(this.expression);
        } catch (error) {
          this.expression = "Error";
        }
        break;
      case 'MS':
        try {
          this.memoryValue = this.evaluateExpression(this.expression);
        } catch (error) {
          this.expression = "Error";
        }
        break;
      default:
        return;
    }
  }

  toggleRadian() {
    this.isRadian = !this.isRadian;
    return this.isRadian;
  }

  toggleScientificNotation() {
    this.scientificNotation = !this.scientificNotation;
    return this.scientificNotation;
  }

  appendValue(val) {
    if (this.expression === '0' || this.expression === "Error") {
      this.expression = val;
    } else {
      this.expression += val;
    }
  }

  getCurrentExpression() {
    return this.expression;
  }

  isScientificNotation() {
    return this.scientificNotation;
  }
}

// Calculator View class to handle UI updates
class CalculatorView {
  constructor() {
    this.resultElement = document.querySelector('.result');
    this.radianDegreeToggle = document.querySelector('.unit');
  }

  display(expression, useScientificNotation) {
    if (useScientificNotation && !isNaN(parseFloat(expression))) {
      this.resultElement.textContent = parseFloat(expression).toExponential();
    } else {
      this.resultElement.textContent = expression || '0';
    }
  }

  updateAngleMode(isRadian) {
    this.radianDegreeToggle.textContent = isRadian ? 'RAD' : 'DEG';
  }
}

// Calculator Controller class to handle events and connect model and view
class CalculatorController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.initEventListeners();
  }

  initEventListeners() {
    // Button click handlers
    document.querySelectorAll('.btn-col, .btn-col1, .btn-blue, .btn-dark').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.value;
        if (value) {
          this.handleInput(value);
        }
      });
    });

    // Angle mode toggle
    document.querySelector('.unit').addEventListener('click', () => {
      const isRadian = this.model.toggleRadian();
      this.view.updateAngleMode(isRadian);
    });

    // Scientific notation toggle
    document.querySelector('.scientific-result').addEventListener('click', () => {
      this.model.toggleScientificNotation();
      this.updateDisplay();
    });

    // Memory buttons
    document.querySelectorAll('.memory-btn button').forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleInput(btn.textContent.trim());
      });
    });

    // Trigonometry dropdown
    document.querySelectorAll('#trigno-myDropdown a').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleInput(item.getAttribute('value'));
      });
    });

    // Function dropdown
    document.querySelectorAll('#func-myDropdown a').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleInput(item.getAttribute('value'));
      });
    });

    // Keyboard input
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      
      if (/[0-9]/.test(key)) {
        this.handleInput(key);
      } else if (key === '+' || key === '-' || key === '.' || key === '(' || key === ')') {
        this.handleInput(key);
      } else if (key === '*') {
        this.handleInput('*');
      } else if (key === '/') {
        this.handleInput('divide');
      } else if (key === '%') {
        this.handleInput('mod');
      } else if (key === 'Enter' || key === '=') {
        this.handleInput('=');
      } else if (key === 'Backspace') {
        this.handleInput('backspace');
      } else if (key === 'Escape') {
        this.handleInput('c');
      } else if (key === '^') {
        this.handleInput('xy');
      }
    });
  }

  handleInput(val) {
    switch(val) {
      case 'c':
        this.model.clear();
        break;
      case '=':
        this.model.equals();
        break;
      case 'backspace':
        this.model.backspace();
        break;
      case 'pi':
        this.model.insertValue(Math.PI);
        break;
      case 'e':
        this.model.insertValue(Math.E);
        break;
      case 'square':
      case 'squareroot':
      case 'inverse':
      case 'abs':
      case 'factorial':
      case 'log':
      case 'ln':
      case '10x':
      case 'ceil':
      case 'floor':
      case 'exponential':
      case '+/-':
        this.model.applyOperation(val);
        break;
      case 'sin':
      case 'cos':
      case 'tan':
        this.model.applyTrigFunction(val);
        break;
      case 'MC':
      case 'MR':
      case 'M+':
      case 'M-':
      case 'MS':
        this.model.memoryOperation(val);
        break;
      case 'xy':
        this.model.appendValue('^');
        break;
      case 'divide':
        this.model.appendValue('/');
        break;
      case 'mod':
        this.model.appendValue('%');
        break;
      case '+':
      case '-':
      case '*':
      case '(':
      case ')':
      case '.':
        this.model.appendValue(val);
        break;
      default:
        if (!isNaN(val) || val === '.') {
          this.model.appendValue(val);
        }
        break;
    }
    
    this.updateDisplay();
  }

  updateDisplay() {
    this.view.display(
      this.model.getCurrentExpression(),
      this.model.isScientificNotation()
    );
  }
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
  const calculatorModel = new CalculatorModel();
  const calculatorView = new CalculatorView();
  const calculatorController = new CalculatorController(calculatorModel, calculatorView);
  
  // Initial display
  calculatorController.updateDisplay();
});
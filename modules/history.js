export function initHistory(calculator) {
  loadHistoryFromStorage(calculator);
}

export function loadHistoryFromStorage(calculator) {
  const savedHistory = localStorage.getItem("calculatorHistory");
  calculator.calculationHistory = savedHistory ? JSON.parse(savedHistory) : [];
}

export function saveHistoryToStorage(calculator) {
  localStorage.setItem(
    "calculatorHistory",
    JSON.stringify(calculator.calculationHistory)
  );
}

export function addToHistory(calculator, expression, result) {
  calculator.calculationHistory.unshift({
    expression,
    result: result.toString(),
  });

  // Keep history at maximum length
  if (calculator.calculationHistory.length > calculator.MAX_HISTORY_LENGTH) {
    calculator.calculationHistory = calculator.calculationHistory.slice(
      0,
      calculator.MAX_HISTORY_LENGTH
    );
  }

  saveHistoryToStorage(calculator);
}

export function clearHistory(calculator) {
  calculator.calculationHistory = [];
  saveHistoryToStorage(calculator);

  // Update UI if history panel is visible
  const historyPanel = document.querySelector(".history-panel");
  if (historyPanel && historyPanel.style.display !== "none") {
    renderHistoryPanel(calculator);
  }
}

export function toggleHistoryDisplay(calculator) {
  const historyPanel = document.querySelector(".history-panel");
  if (historyPanel) {
    if (historyPanel.style.display === "none") {
      historyPanel.style.display = "block";
      renderHistoryPanel(calculator);
    } else {
      historyPanel.style.display = "none";
    }
  }
}

export function createHistoryPanel(calculator) {
  let panel = document.createElement("div");
  panel.className = "history-panel";
  document.querySelector(".calculator").appendChild(panel);
  renderHistoryPanel(calculator);
}

export function renderHistoryPanel(calculator) {
  const panel = document.querySelector(".history-panel");
  if (!panel) return;

  // Create history list if it doesn't exist
  let historyList = panel.querySelector(".history-list");
  if (!historyList) {
    historyList = document.createElement("div");
    historyList.className = "history-list";
    panel.appendChild(historyList);
  }
  
  historyList.innerHTML = "";

  if (calculator.calculationHistory.length === 0) {
    historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
    return;
  }

  calculator.calculationHistory.forEach((item) => {
    const listItem = document.createElement("div");
    listItem.className = "history-item";
    listItem.textContent = `${item.expression} = ${item.result}`;
    listItem.addEventListener("click", () => {
      calculator.inputStr = item.result;
      calculator.displayStr = item.result;
      calculator.updateDisplay();
      // Optional: hide the panel after selection
      panel.style.display = "none";
    });
    historyList.appendChild(listItem);
  });
}
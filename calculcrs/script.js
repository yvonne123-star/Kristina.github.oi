// script.js
const display = document.getElementById('display');
const historyEl = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let previousInput = '';
let operator = '';

function updateDisplay() {
  display.textContent = currentInput;
  historyEl.textContent = previousInput && operator
    ? `${previousInput} ${formatOperator(operator)}`
    : previousInput;
}

function formatOperator(op) {
  if (op === '*') return '×';
  if (op === '/') return '÷';
  if (op === '-') return '−';
  return op;
}

function appendNumber(value) {
  if (value === '.' && currentInput.includes('.')) return;

  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (currentInput === '') return;

  if (previousInput !== '' && operator !== '') {
    calculate();
  }

  operator = nextOperator;
  previousInput = currentInput;
  currentInput = '';
  updateDisplay();
}

function calculate() {
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) return;

  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = current === 0 ? 'Error' : prev / current;
      break;
    case '%':
      result = prev % current;
      break;
    default:
      return;
  }

  historyEl.textContent = `${previousInput} ${formatOperator(operator)} ${currentInput} =`;
  currentInput = String(result);
  previousInput = '';
  operator = '';
  updateDisplay();
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = '';
  updateDisplay();
}

function deleteOne() {
  if (currentInput === 'Error') {
    clearAll();
    return;
  }

  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
  updateDisplay();
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === 'clear') {
      clearAll();
      return;
    }

    if (action === 'delete') {
      deleteOne();
      return;
    }

    if (action === 'calculate') {
      calculate();
      return;
    }

    if (['+', '-', '*', '/', '%'].includes(value)) {
      chooseOperator(value);
      return;
    }

    appendNumber(value);
  });
});

window.addEventListener('keydown', (e) => {
  const key = e.key;

  if ((key >= '0' && key <= '9') || key === '.') {
    appendNumber(key);
  } else if (['+', '-', '*', '/', '%'].includes(key)) {
    chooseOperator(key);
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    deleteOne();
  } else if (key.toLowerCase() === 'c') {
    clearAll();
  }
});

updateDisplay();

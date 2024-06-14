let runningTotal = 0;
let buffer = '0';
let previousOperator = null;
let history = [];

const screen = document.querySelector('.screen');
const historyList = document.getElementById('historyList');
const historyButton = document.getElementById('historyButton');


function toggleHistory() {
    const sidebar = document.getElementById("historySidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        historyButton.style.display = "none"
    } else {
        sidebar.style.width = "250px";
        historyButton.style.display - "none"
        updateHistory();
    }
}

function updateHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        historyList.appendChild(listItem);
    });
}

function buttonClick(value) {
    if (isNaN(value) && value !== '.') {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.textContent = buffer;
}

function handleSymbol(symbol) {
    switch (symbol) {
        case 'AC':
            buffer = '0';
            runningTotal = 0;
            previousOperator = null;
            break;
        case '=':
            if (previousOperator === null) {
                return;
            }
            const currentBuffer = buffer.split(/[−+×÷]/).pop();
            flushOperation(parseFloat(currentBuffer));
            history.push(`${buffer} = ${runningTotal}`);
            updateHistory();
            previousOperator = null;
            buffer = runningTotal.toString();
            runningTotal = 0;
            break;
        case '←':
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.slice(0, -1);
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
        case '%':
            handleMath(symbol);
            break;
    }
}

function handleNumber(number) {
    if (buffer === '0' && number !== '.') {
        buffer = number;
    } else {
        buffer += number;
    }
}

function handleMath(symbol) {
    if (buffer === '0' && symbol !== '') {
        return;
    }
    const currentBuffer = buffer.split(/[−+×÷]/).pop();
    const floatBuffer = parseFloat(currentBuffer);

    if (symbol === '%') {
        runningTotal = (floatBuffer / 100);
        buffer = runningTotal.toString();
        previousOperator = null;
        return;
    }

    if (runningTotal === 0) {
        runningTotal = floatBuffer;
    } else {
        flushOperation(floatBuffer);
    }

    previousOperator = symbol;
    buffer += symbol;
}

function flushOperation(floatBuffer) {
    if (previousOperator === '+') {
        runningTotal += floatBuffer;
    } else if (previousOperator === '−') {
        runningTotal -= floatBuffer;
    } else if (previousOperator === '×') {
        runningTotal *= floatBuffer;
    } else if (previousOperator === '÷') {
        runningTotal /= floatBuffer;
    }
}

const keyboardMappings = {
    "/": "÷",
    "*": "×",
    'Enter': '=',
    'Backspace': '←',
    "Escape": "AC",
    "-": "−"
}

function init() {
    document.querySelector('.calc_buttons').addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            buttonClick(event.target.innerText.trim());
        }
    });


    function toggleBackground() {
        if (backgroundInterval) {
            clearInterval(backgroundInterval);
            backgroundInterval = null;
        } else {
            backgroundInterval = setInterval(changeBackground, 1000);
        }
    }
    
    function changeBackground() {
        const colors = ['#ff9999', '#99ff99', '#9999ff', '#ffff99'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        calculator.style.backgroundColor = randomColor;
        document.body.style.backgroundColor = randomColor;
    }
    

    document.addEventListener('keydown', function (event) {
        let keyValue = event.key;
        keyValue = keyboardMappings[keyValue] || keyValue;
        if (!isNaN(keyValue) || keyValue === '.') {
            buttonClick(keyValue);
        } else {
            buttonClick(keyValue);
        }
        screen.textContent = buffer;
    });
}

init();

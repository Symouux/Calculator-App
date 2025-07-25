let display = document.getElementById('display');
        let history = document.getElementById('history');
        let currentInput = '0';
        let operator = null;
        let previousInput = null;
        let waitingForOperand = false;
        let calculationHistory = '';

        function updateDisplay() {
            display.value = currentInput;
            display.classList.remove('error');
        }

        function updateHistory(text) {
            history.textContent = text;
        }

        function inputNumber(num) {
            if (waitingForOperand) {
                currentInput = num;
                waitingForOperand = false;
            } else {
                currentInput = currentInput === '0' ? num : currentInput + num;
            }
            updateDisplay();
        }

        function inputDecimal() {
            if (waitingForOperand) {
                currentInput = '0.';
                waitingForOperand = false;
            } else if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
            }
            updateDisplay();
        }

        function inputOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);

            if (previousInput === null) {
                previousInput = inputValue;
            } else if (operator) {
                const currentValue = previousInput || 0;
                const newValue = performCalculation(currentValue, inputValue, operator);

                currentInput = String(newValue);
                previousInput = newValue;
                updateDisplay();
            }

            waitingForOperand = true;
            operator = nextOperator;
            
            calculationHistory = `${previousInput} ${getOperatorSymbol(operator)}`;
            updateHistory(calculationHistory);
        }

        function calculate() {
            const inputValue = parseFloat(currentInput);

            if (previousInput !== null && operator) {
                const newValue = performCalculation(previousInput, inputValue, operator);
                
                calculationHistory = `${previousInput} ${getOperatorSymbol(operator)} ${inputValue} =`;
                updateHistory(calculationHistory);
                
                currentInput = String(newValue);
                previousInput = null;
                operator = null;
                waitingForOperand = true;
                updateDisplay();
            }
        }

        function performCalculation(firstOperand, secondOperand, operator) {
            try {
                let result;
                switch (operator) {
                    case '+':
                        result = firstOperand + secondOperand;
                        break;
                    case '-':
                        result = firstOperand - secondOperand;
                        break;
                    case '*':
                        result = firstOperand * secondOperand;
                        break;
                    case '/':
                        if (secondOperand === 0) {
                            throw new Error('Division par zéro');
                        }
                        result = firstOperand / secondOperand;
                        break;
                    default:
                        return secondOperand;
                }
                
                // Round to avoid floating point precision issues
                return Math.round(result * 100000000) / 100000000;
            } catch (error) {
                display.classList.add('error');
                return 'Erreur';
            }
        }

        function getOperatorSymbol(op) {
            switch (op) {
                case '+': return '+';
                case '-': return '−';
                case '*': return '×';
                case '/': return '÷';
                default: return op;
            }
        }

        function clearAll() {
            currentInput = '0';
            previousInput = null;
            operator = null;
            waitingForOperand = false;
            calculationHistory = '';
            updateDisplay();
            updateHistory('');
        }

        function clearEntry() {
            currentInput = '0';
            updateDisplay();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if (key >= '0' && key <= '9') {
                inputNumber(key);
            } else if (key === '.') {
                inputDecimal();
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                inputOperator(key);
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape') {
                clearAll();
            } else if (key === 'Backspace') {
                deleteLast();
            }
        });

        updateDisplay();
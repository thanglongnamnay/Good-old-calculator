"use strict";
const $ = (classNames) => document.getElementsByClassName(classNames);
const numberBtns = $('number');
const binaryOperatorBtns = Object.freeze({
    plus: $('plus')[0],
    minus: $('minus')[0],
    multiply: $('multiply')[0],
    divide: $('divide')[0],
});
const unaryOperatorBtns = Object.freeze({
    sqrt: $('sqrt')[0],
    swap: $('swap')[0],
    percent: $('percent')[0],
});
const equalBtn = $('equal')[0];
const dotBtn = $('dot')[0];
const clearOperatorBtns = Object.freeze({
    ac: $('ac')[0],
    c: $('c')[0],
});
const memoryOperatorBtns = Object.freeze({
    m: $('m')[0],
    mplus: $('mplus')[0],
    mc: $('mc')[0],
});
const plus = (a, b) => a + b;
const minus = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const none = (a, b) => a;
const swap = (a) => -a;
const sqrt = (a) => Math.sqrt(a);
const percent = (a) => a * 100;
const identity = (a) => a;
function Calculator(screen, dots, ui) {
    let theGood = NaN;
    let theBad = NaN;
    let theUgly = '0';
    let theResult = NaN;
    let typing = true;
    let mem = NaN;
    let dot = false;
    let error = false;
    let binaryOperator = none;
    screen.innerText = '00000';
    ui.innerText = '';
    setUgly(0);
    function render(a) {
        const { int, fraction } = parse(a);
        const result = int + fraction;
        if (result.length <= 9) {
            renderDotsScreen(int, fraction);
            screen.innerText = result;
        }
        else {
            ui.innerText = 'E';
            error = true;
        }
    }
    function parse(a) {
        const int = Math.floor(a);
        const intLen = int.toString().length;
        if (intLen < 9) {
            const fraction = a - int;
            const betterFraction = parseFloat(fraction.toPrecision(9 - int.toString().length));
            return { int: int.toString(), fraction: betterFraction.toString().slice(2) };
        }
        else {
            return { int: int.toString(), fraction: '' };
        }
    }
    function renderDotsScreen(int, fraction) {
        let separate = '';
        const intLen = int.length;
        if (intLen > 3) {
            separate = '\xa0\xa0,';
            for (let i = intLen - 4; i > 0; --i) {
                separate += ((intLen - i) % 3 === 0 ? ',' : '\xa0');
            }
        }
        separate = separate.split('').reverse().join('');
        console.log(separate);
        if (fraction.length) {
            separate += '.' + '\xa0'.repeat(fraction.length - 1);
        }
        dots.innerText = separate;
        return separate;
    }
    function setBad(a) {
        theBad = a;
        console.log('bad=', a);
    }
    function setGood(a) {
        theGood = a;
        console.log('good=', a);
    }
    function setUgly(a) {
        theUgly = a.toString();
        if (typing) {
            render(a);
        }
        console.log('ugly=', theUgly);
    }
    function setResult(a) {
        theResult = a;
        render(a);
        typing = false;
        console.log('result=', a);
    }
    function setMem(a) {
        mem = a;
        setResult(a);
        typing = false;
    }
    function setDotFalse() {
        dot = false;
    }
    function getUgly() {
        return parseFloat(theUgly);
    }
    function getResult() {
        return theResult || getUgly();
    }
    function push(a) {
        if (error)
            return;
        if (theUgly.toString().length >= 10) {
        }
        typing = true;
        if (dot) {
            theUgly += '.';
            dot = false;
        }
        if (theUgly !== '0' || a !== 0) {
            theUgly += a;
            render(getUgly());
        }
    }
    function handleBinary(operator) {
        if (error)
            return;
        if (typing && !isNaN(theGood)) {
            handleEqual();
        }
        typing = false;
        setGood(getResult());
        setUgly(0);
        binaryOperator = operator;
    }
    function handleUnary(operator) {
        if (error)
            return;
        if (typing) {
            setUgly(operator(getUgly()));
        }
        else {
            setUgly(operator(getResult()));
            setResult(getUgly());
        }
    }
    function handleMemory(operator) {
        if (error)
            return;
        switch (operator) {
            case "m":
                if (typing) {
                    handleEqual();
                }
                setMem(getUgly());
                setUgly(0);
                break;
            case "mplus":
                mem += getUgly();
                setUgly(mem);
                break;
            default:
                mem = NaN;
        }
    }
    function handleEqual() {
        if (error)
            return;
        if (binaryOperator != none) {
            if (isNaN(theBad) || typing) {
                setBad(getUgly());
            }
            typing = false;
            setResult(binaryOperator(theGood, theBad));
            setUgly(0);
            setGood(getResult());
        }
    }
    function handleAC() {
        error = false;
        ui.innerText = '';
        setGood(NaN);
        setBad(NaN);
        setResult(NaN);
        setUgly(0);
        binaryOperator = none;
        render(0);
    }
    function handleC() {
        if (error)
            return;
        if (typing) {
            setUgly(0);
        }
    }
    function handleDot() {
        if (error)
            return;
        dot = true;
    }
    return Object.freeze({
        render,
        push,
        handleBinary,
        handleUnary,
        handleMemory,
        handleEqual,
        handleDot,
        handleAC,
        handleC,
        setDotFalse,
    });
}
const calculator = Calculator($('content')[0], $('dots')[0], $('ui')[0]);
const getBinaryFunction = (str) => {
    switch (str) {
        case 'plus':
            return plus;
        case 'minus':
            return minus;
        case 'multiply':
            return multiply;
        case 'divide':
            return divide;
    }
    return none;
};
const getUnaryFunction = (str) => {
    switch (str) {
        case 'percent':
            return percent;
        case 'swap':
            return swap;
        case 'sqrt':
            return sqrt;
    }
    return identity;
};
const btnList = $('btn');
for (let btn in binaryOperatorBtns) {
    binaryOperatorBtns[btn].addEventListener('click', () => calculator.handleBinary(getBinaryFunction(btn)), false);
}
for (let btn in unaryOperatorBtns) {
    unaryOperatorBtns[btn].addEventListener('click', () => calculator.handleUnary(getUnaryFunction(btn)), false);
}
for (let btn of numberBtns) {
    btn.addEventListener('click', () => calculator.push(parseInt(btn.innerText)));
}
for (let btn in memoryOperatorBtns) {
    memoryOperatorBtns[btn].addEventListener('click', () => calculator.handleMemory(btn));
}
equalBtn.addEventListener('click', calculator.handleEqual);
clearOperatorBtns.ac.addEventListener('click', calculator.handleAC);
clearOperatorBtns.c.addEventListener('click', calculator.handleC);
for (const btn of btnList) {
    btn.addEventListener('click', calculator.setDotFalse);
}
dotBtn.removeEventListener('click', calculator.setDotFalse);
dotBtn.addEventListener('click', calculator.handleDot);
//# sourceMappingURL=main.js.map
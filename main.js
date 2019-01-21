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
const equal = $('equal')[0];
const clearOperatorBtns = Object.freeze({
    ac: $('ac')[0],
    c: $('c')[0],
});
const memoryOperatorBtns = Object.freeze({
    m: $('m')[0],
    mplus: $('mplus')[0],
    mc: $('mc')[0],
});
const binaryFunction = Object.freeze({
    plus: function (a, b) { return b + a; },
    minus: function (a, b) { return b - a; },
    multiply: function (a, b) { return b * a; },
    divide: function (a, b) { return b / a; }
});
const unaryFunction = Object.freeze({
    sqrt: function (a) { return Math.sqrt(a); },
    swap: function (a) { return -a; },
    percent: function (a) { return a * 100; }
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
function Calculator(screen, floated) {
    let theGood = NaN;
    let theBad = NaN;
    let theUgly = 0;
    let binaryOperator = none;
    screen.innerHTML = '';
    function render() {
        screen.innerHTML = theUgly + '';
    }
    function setBad(a) {
        theBad = a;
    }
    function setGood(a) {
        theGood = a;
    }
    function setUgly(a) {
        if (typeof a === 'number') {
            theUgly = a;
        }
        else {
            theUgly = a(theUgly);
        }
        render();
    }
    function push(a) {
        if (theUgly.toString().length >= 10) {
        }
        setUgly(theUgly * 10 + a);
    }
    function handleBinary(operator) {
        setGood(theUgly);
        setUgly(0);
        binaryOperator = operator;
    }
    function handleUnary(operator) {
        setUgly(operator);
    }
    function handleEqual() {
        if (binaryOperator != none) {
            if (isNaN(theBad)) {
                setBad(theUgly);
            }
            setUgly(binaryOperator(theGood, theBad));
            setGood(theUgly);
        }
    }
    function handleAC() {
        setGood(NaN);
        setBad(NaN);
        setUgly(0);
    }
    function handleC() {
        setUgly(0);
    }
    setUgly(0);
    return Object.freeze({
        render,
        push,
        handleBinary,
        handleUnary,
        handleEqual,
        handleAC,
        handleC,
    });
}
const calculator = Calculator(document.getElementsByClassName('content')[0], document.getElementsByClassName(''));
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
for (let btn in binaryOperatorBtns) {
    binaryOperatorBtns[btn].onclick = () => calculator.handleBinary(getBinaryFunction(btn));
}
for (let btn in unaryOperatorBtns) {
    unaryOperatorBtns[btn].onclick = () => calculator.handleUnary(getUnaryFunction(btn));
}
for (let btn of numberBtns) {
    btn.onclick = () => calculator.push(btn.innerText - 0);
}
equal.onclick = calculator.handleEqual;
clearOperatorBtns.ac.onclick = calculator.handleAC;
clearOperatorBtns.c.onclick = calculator.handleC;
//# sourceMappingURL=main.js.map
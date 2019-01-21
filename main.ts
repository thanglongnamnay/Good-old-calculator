const $ = (classNames:string):HTMLCollectionOf<HTMLElement> => document.getElementsByClassName(classNames) as HTMLCollectionOf<HTMLElement>;
const numberBtns = $('number');
const binaryOperatorBtns:Readonly<{ [index:string] : HTMLElement }> = Object.freeze({
    plus: $('plus')[0],
    minus: $('minus')[0],
    multiply: $('multiply')[0],
    divide: $('divide')[0],
});
const unaryOperatorBtns:Readonly<{ [index:string] : HTMLElement }> = Object.freeze({
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
    plus: function (a:number, b:number):number {return b + a},
    minus: function (a:number, b:number):number {return b - a},
    multiply: function (a:number, b:number):number {return b * a},
    divide: function (a:number, b:number):number {return b / a}
});
const unaryFunction = Object.freeze({
    sqrt: function (a:number):number {return Math.sqrt(a)},
    swap: function (a:number):number {return -a},
    percent: function (a:number):number {return a * 100}
});
interface BinaryFunction {
	(a:number, b:number):number;
}
const plus:BinaryFunction = (a:number, b:number) => a + b;
const minus:BinaryFunction = (a:number, b:number) => a - b;
const multiply:BinaryFunction = (a:number, b:number) => a * b;
const divide:BinaryFunction = (a:number, b:number) => a / b;
const none:BinaryFunction = (a:number, b: number) => a;

interface UnaryFunction {
	(a:number):number;
}
const swap:UnaryFunction = (a:number) => -a;
const sqrt:UnaryFunction = (a:number) => Math.sqrt(a);
const percent:UnaryFunction = (a:number) => a * 100;
const identity:UnaryFunction = (a:number) => a;

// TODO floated screen class
function Calculator (screen:Element, floated:any) {
    let theGood:number = NaN; // the main factor
    let theBad:number = NaN; // the second factor
    let theUgly:number = 0; // screen number
    let mem:number = NaN; //memory guy
    let binaryOperator:BinaryFunction = none;
    screen.innerHTML = '';
    
    function render():void {
        screen.innerHTML = theUgly + '';
    }
    function setBad(a:number) {
	    theBad = a;
    }
    function setGood(a:number) {
	    theGood = a;
    }
    function setUgly(a:number|UnaryFunction) {
    	if (typeof a === 'number') {
		    theUgly = a;
	    } else {
    		theUgly = a(theUgly);
	    }
	    render();
    }
    function push(a:number):void {
	    if (theUgly.toString().length >= 10) {
	    	// TODO show error
        }
        setUgly(theUgly * 10 + a);
    }
    function handleBinary(operator: BinaryFunction) {
    	setGood(theUgly);
    	setUgly(0);
    	binaryOperator = operator;
    }
    function handleUnary(operator: UnaryFunction) {
	   setUgly(operator);
    }
    function handleMemory(operator: string) { // u cant use operator here since it's not pure
    	switch (operator) {
    		case "M":
    			mem = theUgly;
    			break;
    		case "Mplus":
    			mem += theUgly;
    			setUgly(mem);
    			break;
    		default:
    			mem = NaN;
    	}
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
    })
}
const calculator = Calculator(document.getElementsByClassName('content')[0], document.getElementsByClassName(''))
const getBinaryFunction = (str:string):BinaryFunction => {
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
const getUnaryFunction = (str:string):UnaryFunction => {
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
	// @ts-ignore
	btn.onclick = () => calculator.push(btn.innerText - 0);
}
equal.onclick = calculator.handleEqual;
clearOperatorBtns.ac.onclick = calculator.handleAC;
clearOperatorBtns.c.onclick = calculator.handleC;
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";
export const Actions = {
  Add_Digit: "add-digit",
  Choose_Operation: "choose-operation",
  Clear: "clear",
  Delete_Digit: "delete-digit",
  Evaluate: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case Actions.Add_Digit:
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overWrite: false,
        };
      }
      //only one 0 can be written in the beginning
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      //only one . can be written
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      //it prints on the screen
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    //it does nothing if i choose an operation and there're no numbers entered
    case Actions.Choose_Operation:
      if (state.previousOperand == null && state.currentOperand == null) {
        return state;
      }
      //when i enter a number then an operation, it swaps everything correctly
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      //what if i choose the wrong operation? this fixes it
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      //default operation
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    //clear everything only return an empty object
    case Actions.Clear:
      return {};
    case Actions.Evaluate:
      //check if all parameters are present
      if (
        state.previousOperand == null ||
        state.operation == null ||
        state.currentOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overWrite: true, //when i press on any number, it will be written next to the result. this overWrite prevents it
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    case Actions.Delete_Digit:
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }
      //check the length of the input. if it's only 1 digit, clear it
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      //default case
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}
function evaluate({ previousOperand, operation, currentOperand }) {
  const prev_value = parseFloat(previousOperand);
  const curr_value = parseFloat(currentOperand);
  //#1: check the presence of the prev_value and curr_value
  if (isNaN(prev_value) || isNaN(curr_value)) {
    return "";
  }
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev_value + curr_value;
      break;
    case "-":
      computation = prev_value - curr_value;
      break;
    case "*":
      computation = prev_value * curr_value;
      break;
    case "÷":
      computation = prev_value / curr_value;
      break;
  }
  return computation.toString();
}
const Digit_Formatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})
function formatOperand(operand){
  //check the presence of the oprand
  if(operand == null) return;
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return Digit_Formatter.format(integer)
  return `${Digit_Formatter.format(integer)}.${decimal}`
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: Actions.Clear })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: Actions.Delete_Digit })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: Actions.Evaluate })}
      >
        =
      </button>
    </div>
  );
}

export default App;

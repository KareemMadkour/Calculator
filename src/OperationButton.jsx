import { Actions } from "./App";
export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: Actions.Choose_Operation, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}

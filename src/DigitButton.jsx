import { Actions } from "./App"
export default function DigitButton({dispatch, digit}){
return(
    <button onClick={() => dispatch({type: Actions.Add_Digit, payload: {digit}})}>{digit}</button>
)
}
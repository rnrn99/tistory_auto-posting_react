import { AUTH_INFO, ADD_INFO } from "../_action/type";

export default function infoReducer(state = {}, action) {
  switch (action.type) {
    case ADD_INFO:
      return { ...state, infoData: action.payload };
    case AUTH_INFO:
      return { ...state, infoData: action.payload };
    default:
      return state;
  }
}

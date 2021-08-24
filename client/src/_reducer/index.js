import { combineReducers } from "redux";
import user from "./userReducer";
import info from "./infoReducer";

const rootReducer = combineReducers({
  user,
  info,
});

export default rootReducer;

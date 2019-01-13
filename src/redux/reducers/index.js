import { combineReducers } from "redux";
import accessToken from './accessToken';
import reminders from './reminders';

export default combineReducers({
  accessToken,
  reminders
});

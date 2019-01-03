import { LOAD_REMINDERS, ADD_REMINDER, LOGOUT, LOGIN } from "./actionTypes";
import { combineReducers } from "redux";

const accessToken = (state = null, action) => {
  switch (action.type) {
    case LOGIN: {
      const { accessToken } = action.payload;

      return accessToken;
    }
    case LOGOUT:
      return null;
    default:
      return state;
  }
}

const reminders = (state = [], action) => {
  switch (action.type) {
    case LOGOUT:
      return [];
    case LOAD_REMINDERS: {
      const { reminders } = action.payload;

      return reminders;
    }
    case ADD_REMINDER: {
      const { reminder } = action.payload;

      return [...state, reminder]
    }
    default:
      return state;
  }
}

export default combineReducers({ accessToken, reminders })

import { LOAD_REMINDERS, ADD_REMINDER, LOGOUT, LOGIN } from "./actionTypes";
import { combineReducers } from "redux";
import { DELETE_REMINDER } from "./actionTypes";

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
    case DELETE_REMINDER: {
      const { reminderId } = action.payload;

      return state.filter(reminder => reminder.id !== reminderId);
    }
    default:
      return state;
  }
}

export default combineReducers({ accessToken, reminders })

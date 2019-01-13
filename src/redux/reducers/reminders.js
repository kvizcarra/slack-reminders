import {
  LOGOUT,
  LOAD_REMINDERS,
  ADD_REMINDER,
  DELETE_REMINDER
} from "../actionTypes";

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
};

export default reminders;

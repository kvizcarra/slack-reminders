import {
  LOGOUT,
  LOAD_REMINDERS,
  ADD_REMINDER,
  COMPLETE_REMINDER,
  DELETE_REMINDER
} from "../actionTypes";
import { UPCOMING, PAST, COMPLETE } from "../../reminderTypes";

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
    case COMPLETE_REMINDER: {
      const { reminderId } = action.payload;

      return state.map(reminder => {
        if (
          !(reminder.reminderType === UPCOMING || reminder.reminderType === PAST)
          || reminder.id !== reminderId
        ) {
          return reminder;
        }

        return {
          ...reminder,
          complete_ts: Date.now(),
          reminderType: COMPLETE
        }
      })
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

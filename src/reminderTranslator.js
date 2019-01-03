import { RECURRING, COMPLETE, UPCOMING, PAST } from "./reminderTypes";

export const toViewModel = boundaryReminder => {
  // recurring
  if (boundaryReminder.recurring) {
    return {
      ...boundaryReminder,
      reminderType: RECURRING
    };
  } else {
    const viewModelReminder = {
      ...boundaryReminder,
      time: boundaryReminder.time * 1000 // convert seconds to milliseconds
    };

    // complete
    if (boundaryReminder.complete_ts > 0) {
      return {
        ...viewModelReminder,
        reminderType: COMPLETE
      };
      // upcoming
    } else if (new Date(viewModelReminder.time) > Date.now()) {
      return {
        ...viewModelReminder,
        reminderType: UPCOMING
      };
      // past
    } else {
      return {
        ...viewModelReminder,
        reminderType: PAST
      };
    }
  }
}

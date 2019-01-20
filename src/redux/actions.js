import slack from 'slack';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '../slackEnvVars';
import {
  LOAD_REMINDERS,
  ADD_REMINDER,
  LOGOUT,
  LOGIN,
  DELETE_REMINDER,
  COMPLETE_REMINDER
} from "./actionTypes";
import { toViewModel } from '../reminderTranslator';

export const login = code => dispatch =>
  slack.oauth.access({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI
  })
    .then(response => {
      localStorage.setItem('access_token', response.access_token);
      dispatch({
        type: LOGIN,
        payload: {
          accessToken: response.access_token
        }
      })
    });

export const logout = () => {
  localStorage.removeItem('access_token');
  return { type: LOGOUT };
}

export const loadReminders = token => dispatch =>
  slack.reminders.list({ token })
    .then(response => {
      dispatch({
        type: LOAD_REMINDERS,
        payload: {
          reminders: response.reminders.map(toViewModel)
        }
      })
    });

export const addReminder = (token, text) => dispatch =>
  slack.reminders.add({
    token,
    text,
    time: 'tomorrow'
  })
    .then(response => {
      dispatch({
        type: ADD_REMINDER,
        payload: {
          reminder: toViewModel(response.reminder)
        }
      })
    });

export const completeReminder = (token, reminderId) => dispatch =>
  slack.reminders.complete({
    token,
    reminder: reminderId
  })
    .then(response => {
      if (response.ok) {
        dispatch({
          type: COMPLETE_REMINDER,
          payload: { reminderId }
        })
      }
    });

export const deleteReminder = (token, reminderId) => dispatch =>
  slack.reminders.delete({
    token,
    reminder: reminderId
  })
    .then(response => {
      if (response.ok) {
        dispatch({
          type: DELETE_REMINDER,
          payload: { reminderId }
        });
      }
    });

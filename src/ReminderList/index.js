import React from 'react';

const ReminderList = ({ reminders = [] }) => {
  return (
    <ul>
      {reminders.map(reminder => (
        <li key={reminder.id}>
          {reminder.text}

          {reminder.time
            ? <em style={{marginLeft: 20}}>{(new Date(reminder.time)).toDateString()}</em>
            : null}
        </li>
      ))}
    </ul>
  );
};

export default ReminderList;

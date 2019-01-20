import React from 'react';
import ReminderItem from '../ReminderItem';

const ReminderList = ({ reminders = [], onComplete, onDelete }) => {
  return (
    <ul>
      {reminders.map(reminder => (
        <li key={reminder.id}>
          <ReminderItem
            date={reminder.time ? new Date(reminder.time) : null}
            onComplete={onComplete}
            onDelete={onDelete}
            {...reminder}/>
        </li>
      ))}
    </ul>
  );
};

export default ReminderList;

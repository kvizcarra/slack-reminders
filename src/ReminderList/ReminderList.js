import React from 'react';
import ReminderItem from '../ReminderItem';

const ReminderList = ({ reminders = [], onDelete }) => {
  return (
    <ul>
      {reminders.map(reminder => (
        <li key={reminder.id}>
          <ReminderItem
            date={reminder.time ? new Date(reminder.time) : null}
            onDelete={onDelete}
            {...reminder}/>
        </li>
      ))}
    </ul>
  );
};

export default ReminderList;

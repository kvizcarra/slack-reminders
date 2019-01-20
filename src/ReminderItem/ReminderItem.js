import React from "react";
import { UPCOMING, PAST } from '../reminderTypes';

const ReminderItem = ({id, text, date, reminderType, onComplete, onDelete}) => (<>
    {text}

    {date
    ? <em style={{marginLeft: 20}}>{date.toDateString()}</em>
    : null}

    {(reminderType === UPCOMING || reminderType === PAST)
    && <button style={{marginLeft: 10}} onClick={() => onComplete(id)}>Complete</button>}

    <button style={{marginLeft: 10}} onClick={() => onDelete(id)}>Delete</button>
</>);

export default ReminderItem;

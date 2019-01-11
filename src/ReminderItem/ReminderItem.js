import React from "react";

const ReminderItem = ({id, text, date, onDelete}) => (<>
    {text}

    {date
    ? <em style={{marginLeft: 20}}>{date.toDateString()}</em>
    : null}

    <button style={{marginLeft: 10}} onClick={() => onDelete(id)}>Delete</button>
</>);

export default ReminderItem;

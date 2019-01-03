import React from "react";

const ReminderItem = ({text, date}) => (<>
    {text}

    {date
    ? <em style={{marginLeft: 20}}>{date.toDateString()}</em>
    : null}
</>);

export default ReminderItem;

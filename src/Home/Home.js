import React, { Component } from 'react';
import queryString from "query-string";
import ReminderList from '../ReminderList';
import { CLIENT_ID, REDIRECT_URI } from '../slackEnvVars';
import { connect } from "react-redux";
import * as actionCreators from "../redux/actions";
import { UPCOMING, RECURRING, PAST, COMPLETE } from '../reminderTypes';

class Home extends Component {
  INITIAL_STATE = {
    reminderInputValue: ''
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  componentDidMount() {
    const { accessToken } = this.props;

    if (accessToken) {
      this.props.loadReminders(accessToken);
    }
  }

  handleLogoutClicked = () => {
    this.props.logout();
    this.setState(this.INITIAL_STATE);
  };

  handleReminderInputChange = event => this.setState({
    reminderInputValue: event.target.value
  });

  openSlackAuth = () => {
    const url = new URL('https://slack.com/oauth/authorize');
    url.search = queryString.stringify({
      client_id: CLIENT_ID,
      scope: 'reminders:read reminders:write',
      redirect_uri: REDIRECT_URI
    })

    // New window
    // window.open(url, 'Slack Auth', 'height=570,width=520');

    // Same tab
    window.location = url;
  }

  handleReminderInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.addReminder();
    }
  }

  addReminder = () => {
    this.props.addReminder(this.props.accessToken, this.state.reminderInputValue)
      .then(() => {
        this.setState(state => {
          return {
            ...state,
            reminderInputValue: this.INITIAL_STATE.reminderInputValue
          };
        });
      });
  }

  completeReminder = reminderId => {
    this.props.completeReminder(this.props.accessToken, reminderId);
  }

  deleteReminder = reminderId => {
    this.props.deleteReminder(this.props.accessToken, reminderId);
  }

  render() {
    const { reminderInputValue } = this.state;
    const { accessToken } = this.props;
    const {
      upcoming,
      recurring,
      past,
      complete
    } = this.props.reminders;

    return (
      <>
        <div>
          {accessToken
            ? (<>
              <span>Authorized</span>
              <button style={{ marginLeft: 10 }} onClick={this.handleLogoutClicked}>Logout</button>
            </>)
            : <button onClick={this.openSlackAuth}>Authorize Slack</button>
          }
        </div>

        <div style={{ marginTop: 15 }}>
          <input
            name="reminderInput"
            onChange={this.handleReminderInputChange}
            onKeyPress={this.handleReminderInputKeyPress}
            value={reminderInputValue}
            placeholder="Add a reminder"
          />
          <button onClick={this.addReminder}>Add</button>
        </div>

        <h2>Upcoming</h2>
        {upcoming && upcoming.length > 0
          ? <ReminderList
              reminders={upcoming}
              onComplete={this.completeReminder}
              onDelete={this.deleteReminder}
              />
          : <em>No reminders</em>
        }

        {recurring && recurring.length > 0 && (<>
          <h2>Recurring</h2>
          <ReminderList reminders={recurring} onDelete={this.deleteReminder} />
        </>)}

        {past && past.length > 0 && (<>
          <h2>Past and incomplete</h2>
          <ReminderList
            reminders={past}
            onComplete={this.completeReminder}
            onDelete={this.deleteReminder}
            />
        </>)}

        {complete && complete.length > 0 && (<>
          <h2>Complete</h2>
          <ReminderList reminders={complete} onDelete={this.deleteReminder} />
        </>)}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { reminders } = state;

  return {
    ...state,
    reminders: {
      upcoming: reminders.filter(reminder => reminder.reminderType === UPCOMING),
      recurring: reminders.filter(reminder => reminder.reminderType === RECURRING),
      past: reminders.filter(reminder => reminder.reminderType === PAST),
      complete: reminders.filter(reminder => reminder.reminderType === COMPLETE)
    }
  }
}
export default connect(mapStateToProps, actionCreators)(Home);

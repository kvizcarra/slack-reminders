import React, { Component } from 'react';
import slack from 'slack';
import queryString from "query-string";
import ReminderList from '../ReminderList';
import { CLIENT_ID, REDIRECT_URI } from '../slackEnvVars';
import { login, logout } from '../slackAuth';

class App extends Component {
  INITIAL_STATE = {
    accessToken: null,
    reminderInputValue: '',
    reminders: {
      upcoming: [],
      recurring: [],
      past: [],
      complete: []
    }
  };

  constructor(props) {
    super(props);
    this.state = this.INITIAL_STATE;
  }

  componentDidMount() {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('code')) {
      const code = currentUrl.searchParams.get('code');

      login(code)
        .then(() => {
          window.location = '/';
        });
    } else if (currentUrl.searchParams.has('error')) {
      console.error('There was an error authenticating with Slack', currentUrl.searchParams.get('error'));
    } else {
      const token = localStorage.getItem('access_token');

      if (token) {
        this.setState({ accessToken: token });

        slack.reminders.list({ token })
          .then(response => {
            const reminders = this.reminderStateReducer(
              this.INITIAL_STATE.reminders,
              response.reminders
            );

            this.setState({ reminders });
          });
      }
    }
  }

  /**
   * Adds reminders to state
   *
   * @param {Object} state Existing state
   * @param {Object[]} reminders Reminders to add
   *
   * @returns New state of reminders
   */
  reminderStateReducer = (state, reminders) => {
    return reminders.reduce(
      (acc, reminder) => {
        // recurring
        if (reminder.recurring) {
          return {
            ...acc,
            recurring: acc.recurring.concat(reminder)
          };
        } else {
          const newReminder = {
            ...reminder,
            time: reminder.time * 1000
          };

          // complete
          if (reminder.complete_ts > 0) {
            return {
              ...acc,
              complete: acc.complete.concat(newReminder)
            };
            // upcoming
          } else if (new Date(newReminder.time) > Date.now()) {
            return {
              ...acc,
              upcoming: acc.upcoming.concat(newReminder)
            };
            // past
          } else {
            return {
              ...acc,
              past: acc.past.concat(newReminder)
            };
          }
        }
      },
      state
    );
  }

  handleLogoutClicked = () => {
    logout();
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
    slack.reminders.add({
      token: this.state.accessToken,
      text: this.state.reminderInputValue,
      time: 'tomorrow'
    })
    .then(response => {
      this.setState(state => {
        return {
          ...state,
          reminderInputValue: this.INITIAL_STATE.reminderInputValue,
          reminders: this.reminderStateReducer(state.reminders, [response.reminder])
        };
      });
    })
  }

  render() {
    const { accessToken, reminderInputValue } = this.state;
    const {
      upcoming,
      recurring,
      past,
      complete
    } = this.state.reminders;

    return (
      <>
        <div>
          {accessToken
            ? (<>
              <span>Authorized</span>
              <button style={{marginLeft: 10}} onClick={this.handleLogoutClicked}>Logout</button>
            </>)
            : <button onClick={this.openSlackAuth}>Authorize Slack</button>
          }
        </div>

        <div style={{marginTop: 15}}>
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
          ? <ReminderList reminders={upcoming}/>
          : <em>No reminders</em>
        }

        {recurring && recurring.length > 0 && (<>
          <h2>Recurring</h2>
          <ReminderList reminders={recurring}/>
        </>)}

        {past && past.length > 0 && (<>
          <h2>Past and incomplete</h2>
          <ReminderList reminders={past}/>
        </>)}

        {complete && complete.length > 0 && (<>
          <h2>Complete</h2>
          <ReminderList reminders={complete}/>
        </>)}
      </>
    );
  }
}

export default App;

import React, { Component } from 'react';
import slack from 'slack';
import queryString from "query-string";
import ReminderList from '../ReminderList';

const CLIENT_ID = process.env.REACT_APP_SLACK_API_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SLACK_API_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_SLACK_API_REDIRECT_URI;

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

    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has('code')) {
      const code = currentUrl.searchParams.get('code');

      slack.oauth.access({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      })
        .then(response => {
          console.log('response ', response);
          const { access_token } = response;

          this.setAccessToken(access_token);
          window.location = REDIRECT_URI;
        });
    } else if (currentUrl.searchParams.has('error')) {
      console.error('There was an error authenticating with Slack', currentUrl.searchParams.get('error'));
    }
  }

  componentDidMount() {
    const token = this.loadAccessToken();

    if (token) {
      slack.reminders.list({ token })
        .then(response => {
          const reminders = response.reminders.reduce(
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
                } else if (new Date(reminder.time * 1000) > Date.now()) {
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
            this.INITIAL_STATE.reminders
          );

          this.setState({ reminders });
        });
    }
  }

  handleLogoutClicked = () => {
    this.clearAccessToken();
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

  addReminder = () => {
    this.setState(state => {
      const text = this.state.reminderInputValue;
      const reminders = this.state.reminders;
      const id = reminders[reminders.length - 1].id + 1;

      return {
        reminderInputValue: this.INITIAL_STATE.reminderInputValue,
        reminders: [
          ...state.reminders,
          { id, text }
        ]
      }
    });
  }

  loadAccessToken = () => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      this.setState({ accessToken });
      return accessToken;
    } else {
      this.clearAccessToken();
      return null;
    }
  }

  setAccessToken = accessToken => {
    localStorage.setItem('access_token', accessToken);
    this.setState({ accessToken });
  }

  clearAccessToken = () => {
    localStorage.removeItem('access_token');
    this.setState({ accessToken: this.INITIAL_STATE.accessToken });
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

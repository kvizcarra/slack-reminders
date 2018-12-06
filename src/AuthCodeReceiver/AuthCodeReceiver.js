import { Component } from "react";
import { login } from "../slackAuth";
import queryString from "query-string";

class AuthCodeReceiver extends Component {
  componentDidMount() {
    const { location, navigate } = this.props;
    const { code, error } = queryString.parse(location.search);

    if (code) {
      login(code)
        .then(() => navigate('/'));
    } else if (error) {
      console.error('There was an error authenticating with Slack', error);
    }
  }

  render() { return null; }
}

export default AuthCodeReceiver;

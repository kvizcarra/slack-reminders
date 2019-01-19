import { Component } from "react";
import { connect } from "react-redux";
import { login } from "../redux/actions";
import queryString from "query-string";

class AuthCodeReceiver extends Component {
  componentDidMount() {
    const { location, navigate, login } = this.props;
    const { code, error } = queryString.parse(location.search);

    if (code) {
      login(code)
        .then(() => navigate('/', { replace: true }));
    } else if (error) {
      console.error('There was an error authenticating with Slack', error);
    }
  }

  render() { return null; }
}

export default connect(null, { login })(AuthCodeReceiver);

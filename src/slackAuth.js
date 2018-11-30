import slack from "slack";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from './slackEnvVars';

const login = async code => {
  const response = await slack.oauth.access({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI
  });
  localStorage.setItem('access_token', response.access_token);
};

const logout = () => {
  localStorage.removeItem('access_token');
};

export { login, logout };

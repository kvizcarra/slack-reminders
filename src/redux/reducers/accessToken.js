import { LOGIN, LOGOUT } from "../actionTypes";

const accessToken = (state = null, action) => {
  switch (action.type) {
    case LOGIN: {
      const { accessToken } = action.payload;

      return accessToken;
    }
    case LOGOUT:
      return null;
    default:
      return state;
  }
}

export default accessToken;

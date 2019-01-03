import rootReducer from "./reducers";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const preloadedState = {
  accessToken: localStorage.getItem('access_token')
};

export default createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

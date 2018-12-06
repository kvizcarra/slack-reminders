import React from 'react';
import { Router } from "@reach/router";
import Home from '../Home';
import AuthCodeReceiver from '../AuthCodeReceiver';

const App = () => (
  <Router>
    <Home path="/"/>
    <AuthCodeReceiver path="/auth"/>
  </Router>
);

export default App;

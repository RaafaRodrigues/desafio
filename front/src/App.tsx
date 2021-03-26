import React from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css'

import Header from './componentes/Header/Index';
import Body from './pages/Body/Index';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="*" component={Body} exact /> 
      </Switch>
      <footer>@Corporation</footer>
    </Router>

  );
}

export default App;

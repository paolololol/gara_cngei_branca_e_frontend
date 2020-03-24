import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './app/Home';
import Login from './app/Login';
import Challenge from './app/Challenge';
import Victory from './app/Victory';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <Route path='/challenge' component={Challenge}/>
        <Route path='/victory' component={Victory}/>
        <Route component={Home}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

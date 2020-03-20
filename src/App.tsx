import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './app/Home/Home';
import Login from './app/Login/Login';
import Challenge from './app/Challenge/Challenge';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <Route path='/challenge/:id' component={Challenge}/>
        <Route component={Home}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

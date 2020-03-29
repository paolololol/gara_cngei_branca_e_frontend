import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './app/Home';
import Login from './app/Login';
import Challenge from './app/Challenge';
import Victory from './app/Victory';
import Leaderboard from './app/Leaderboard';

function App() {
  const now = Date.now()
  const target = Date.parse('March 29, 2020 18:00:00 GMT+02:00')
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <Route path='/challenge' component={now > target ? Leaderboard : Challenge}/>
        <Route path='/leaderboard' component={Leaderboard}/>
        <Route path='/victory' component={Victory}/>
        <Route component={Home}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

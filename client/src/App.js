import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Navbar from './Navbar';
import Register from './Register';
import Profil from './Profil';
import './App.css';

const App = () => {
  return (
    <>
    <Navbar/>
    <Switch>
      <Route exact path ="/" component={Home}/>
      <Route exact path ="/login" component={Login}/>
      <Route exact path ="/register" component={Register}/>
      <Route exact path ="/profil" component={Profil}/>
     
    </Switch>
</>
  );
}

export default App;

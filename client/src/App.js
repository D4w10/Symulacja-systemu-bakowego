import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";
import Login from "./Components/Login"
import Register from "./Components/register"
import Profile from "./Components/Profile";


function App() {
  return (
   
    <div className="App">
    <Router >
      <div className="navbar">
        <nav>
          <ul >
            <li className="head_img"><a ></a></li>
            <li > <Link className="text-link" to="/"> Strona głowna</Link></li>
            <li><Link className="text-link" to="/login"> Zaloguj</Link></li>
            <li> <Link className="text-link" to="/register"> Stwórz konto</Link></li>
            <li> <Link className="text-link" to="/information"> Informacje</Link></li>

            

          </ul>
        </nav>
       
      </div>
      <Switch>
        <Route path="/" exact component={Home} />
      
        <Route path="/login" exact component={Login} />

        <Route path="/register" exact component={Register} />
        <Route path="/profile" exact component={Profile} />
      </Switch>
    </Router>
  </div>


  );
}

export default App;

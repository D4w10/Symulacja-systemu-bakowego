import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home";
import Login from "./Components/Login"
import Register from "./Components/register"


function App() {
  return (
   
    <div className="App">
    <Router>
      <div className="navbar">
        <nav>
          <ul>
            <li> <Link to="/"> Home Page</Link></li>
            <li><Link to="/login"> Login</Link></li>
            <li> <Link to="/register"> Stwórz konto</Link></li>

          </ul>
        </nav>
       
      
        
      </div>
      <Switch>
        <Route path="/" exact component={Home} />
      
        <Route path="/login" exact component={Login} />

        <Route path="/register" exact component={Register} />

      </Switch>
    </Router>
  </div>


  );
}

export default App;

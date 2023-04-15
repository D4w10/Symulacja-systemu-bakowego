import React from "react";
import { useEffect, useState } from "react";
import Axios from "axios";



function Login(){

    const [userlogin , setLogin]=useState("");
    const [userpassword, setPassword]=useState("");
    const [loginStatus, setLoginStatus] = useState("");

    Axios.defaults.withCredentials = true;

    const login = () => {
        Axios.post("http://localhost:3001/login", {
        userlogin:userlogin,
        userpassword:userpassword,
        }).then((response) => {
            if (response.data.message) {
              setLoginStatus(response.data.message);
            } else {
              setLoginStatus(response.data[0].userlogin);
            }
        });
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
          if (response.data.loggedIn == true) {
            setLoginStatus(response.data.user[0].username);
          }
        });
      }, []);

    return(
        <div className="AppLogin">
            <label>Login: </label>
            <input type="text"
            onChange={(event)=>{
                setLogin(event.target.value);
            }}
            />

            <label>Hasło:</label>
            <input type="password"
             onChange={(event)=>{
                setPassword(event.target.value);
            }}
            />

            <button onClick={login}>Zaloguj</button>

        </div>
    )

}
       

export default Login;

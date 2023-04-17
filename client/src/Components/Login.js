// import React from "react";
// import { useEffect, useState } from "react";
// import Axios from "axios";



// function Login(){

//     const [userlogin , setLogin]=useState("");
//     const [userpassword, setPassword]=useState("");
//     const [loginStatus, setLoginStatus] = useState("");

//     Axios.defaults.withCredentials = true;

//     const login = () => {
//         Axios.post("http://localhost:3001/login", {
//         userlogin:userlogin,
//         userpassword:userpassword,
//         }).then((response) => {
//             if (response.data.message) {
//               setLoginStatus(response.data.message);
//             } else {
//               setLoginStatus(response.data[0].userlogin);
//             }
//         });
//     };

//     useEffect(() => {
//         Axios.get("http://localhost:3001/login").then((response) => {
//           if (response.data.loggedIn == true) {
//             setLoginStatus(response.data.user[0].userlogin);
//           }
//         });
//       }, []);

//     return(
//         <div className="AppLogin">
//             <label>Login: </label>
//             <input type="text"
//             onChange={(event)=>{
//                 setLogin(event.target.value);
//             }}
//             />

//             <label>Hasło:</label>
//             <input type="password"
//              onChange={(event)=>{
//                 setPassword(event.target.value);
//             }}
//             />

//             <button onClick={login}>Zaloguj</button>

//         </div>
//     )

// }
       

// export default Login;

import React,{useState,useEffect} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import axios from 'axios';
import "../Login.css";


const Login = () => {
    const [user, setUser] = useState({
        login:"",
        password:""
    })
    
    const [show,setShow]= useState(false);
    const [msg,setMsg]= useState("");

    

    const his =useHistory();

    const onSub=async (e)=>{
        e.preventDefault();
        let val=  await axios.post("http://localhost:3001/login",user);
 console.log(val);
setShow(val.data.login);
if(val.data.msg)
{
 setMsg(val.data.msg);
}
// console.log(show)

 
 

    }

    useEffect(() => {
        if(show)
            {
                his.push("/profile");
                
            }
        
    }, [show])


    axios.defaults.withCredentials = true;

    useEffect(() => {
       const checkLogin= async ()=>{
        let val= await axios.get("http://localhost:3001/login");
        console.log(val);
        if(val.data.user)
        {
            his.push("/profile")
            // console.log(val.data.user[0].email);
        }
       }
       checkLogin();
    }, [])



    const userInput=(event)=>{
        const {name,value}=event.target;
        setUser((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        })

    }
    return (
        <>
       <div className="container" id="formm">
       <div className="row">
           <div className="col-lg-6 col-md-8 col-12 mx-auto">

               {
                  msg ? (
                       <>
                      <div class="alert alert-danger alert-dismissible">
  <button type="button" class="close" data-dismiss="alert">&times;</button>
  <strong>ERROR!</strong> {msg}
</div>
                       
                       
                       </>
                   ):null
               }
               <br />
           <form onSubmit={onSub}>
  <div className='wrap_login'>
    <label >Login:</label>
    <input  type='text'  placeholder="Login" name="login" value={user.login} onChange={userInput} required />
  
    <label for="pwd">Hasło:</label>
    <input type="password" className="form-control" placeholder="Podaj hasło" name="password" value={user.password} onChange={userInput}  required/>
  </div>
  
  <button type="submit" className="btn btn-primary">Zaloguj się</button>
</form>
<br />


           </div>
          
       </div>
       </div>
            
        </>
    )
}

export default Login
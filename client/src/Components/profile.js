import React,{useState,useEffect} from 'react'
import { useHistory} from 'react-router-dom'
import axios from 'axios';
import { render } from 'react-dom';

const Profile = () => {
const [email, setEmail] = useState("");
const [login, setLogin] = useState(false);

const his=useHistory();
  axios.defaults.withCredentials = true;

  useEffect(() => {
     const checkLogin= async ()=>{
      let val= await axios.get("http://localhost:3001/login");
      setLogin(val.data.login);
      console.log(val.data.login);
      if(val.data.user)
      {
          //  console.log(val.data);
         
          setEmail(val.data.user[0].login)
      }
      else{
        his.push("/login")
      }
     }
     checkLogin();
  },[login])

 

  return (
   
      <>
   <div>saddasds</div>
    </>
  )
  }
  

export default Profile;
import React,{useState,useEffect} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import axios from 'axios';


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
            his.push("/profil")
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
       <div>
       <div>

           <div >

               {
                  msg ? (
                    <>
                    <div>
                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                         {msg}
                    </div>
           
                    </>
                   ):null
               }


               <br />
           <form onSubmit={onSub}>
  <div >
    <label >Login:</label>
    <input type="login"  placeholder="Login" name="login" value={user.login} onChange={userInput} required />
  </div>
  <div >
    <label for="pwd">hasło:</label>
    <input type="password"  placeholder="Hasło" name="password" value={user.password} onChange={userInput}  required/>
  </div>
  
  <button type="submit" >Zaloguj sie</button>
</form>
<br />
<NavLink to="/register">Stwórz konto </NavLink>

           </div>
          
       </div>
       </div>
            
        </>
    )
}

export default Login

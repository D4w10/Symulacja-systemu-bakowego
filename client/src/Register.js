import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({
        email:"",
        password:""
    })
   
    const [msg,setMsg]= useState("");
   const his=useHistory();
   axios.defaults.withCredentials = true;


    const onSub= async (e)=>{
        e.preventDefault();
       let val=  await axios.post("http://localhost:3001/register",user);

      
       if(val.data.msg)
       {
        setMsg(val.data.msg);
       }else{
        his.push("/login");
       }


    }

    useEffect(() => {
        const checkLogin= async ()=>{
         let val= await axios.get("http://localhost:3001/login");
        
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
           <div>
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
    <label >Adress email</label>
    <input type="email" placeholder="Email" name="email" value={user.email} onChange={userInput}  required/>
  </div>
  <div >
    <label for="pwd">Login:</label>
    <input type="text"  placeholder="Login" name="Login" value={user.login} onChange={userInput} required />
  </div>
  <div >
    <label for="pwd">Hasło:</label>
    <input type="password"  placeholder="Hasło" name="password" value={user.password} onChange={userInput} required />
  </div>
  <div >
    <label for="pwd">Pesel:</label>
    <input type="number" placeholder="Pesel" name="pesel" value={user.pesel} onChange={userInput} required />
  </div>
  <div >
    <label for="pwd">Imię:</label>
    <input type="text" placeholder="Imię" name="firstName" value={user.firstName} onChange={userInput} required />
  </div>
  <div >
    <label for="pwd">Nazwisko:</label>
    <input type="text" placeholder="Nazwisko" name="lastName" value={user.lastName} onChange={userInput} required />
  </div>
  <div >
    <label for="pwd">Imię Matki:</label>
    <input type="text" placeholder="Hasło" name="motherName" value={user.motherName} onChange={userInput} required />
  </div>
  <div >
    <label for="pwd">Numer Telefonu:</label>
    <input type="tel" placeholder="Numer Telefonu" name="phoneNumber" value={user.phoneNumber} onChange={userInput} required />
  </div>
  
  <button type="submit">Submit</button>
</form>
           </div>
         </div>
       </div>
            
        </>
    )
}

export default Register

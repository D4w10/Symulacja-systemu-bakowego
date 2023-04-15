import React from "react";
import { useState } from "react";
import Axios from "axios";



function Register(){

    const [userloginreg , setLoginreg]=useState("");
    const [userpasswordreg, setPasswordreg]=useState("");
    const [pesel, setPesel] = useState(0);
    const [email, setEmail] = useState("");
    const [firstname,setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [mothername, setMothername] = useState("");
    const [phonenumber, setPhonenumber] = useState(0);

    Axios.defaults.withCredentials = true;

    const register = () => {
        Axios.post("http://localhost:3001/register", {
        userloginreg:userloginreg,
        userpasswordreg:userpasswordreg,
        pesel:pesel,
        email:email,
        firstname:firstname,
        lastname:lastname,
        mothername:mothername,
        phonenumber:phonenumber,
        }).then(() => {
            console.log("WOWREG");
        });
    };

    return(
        <div className="AppRegister" >
           <label>Login:</label>
           <input 
           type="text"
           onChange={(e) => {
            setLoginreg(e.target.value);
          }}
           />
           <label>Hasło:</label>
           <input type="password"
            onChange={(e) => {
                setPasswordreg(e.target.value);
              }}/>
        
           <label>Pesel:</label>
           <input type="number"
            onChange={(e) => {
                setPesel(e.target.value);
              }}/>
           <label>Email:</label>
           <input type="email"
            onChange={(e) => {
                setEmail(e.target.value);
              }}/>
           <label>Imię:</label>
           <input type="text"
            onChange={(e) => {
                setFirstname(e.target.value);
              }}/>
           <label>Nazwisko:</label>
           <input type="text"
            onChange={(e) => {
                setLastname(e.target.value);
              }}/>
           <label>Nazwisko panienskie matkio</label>
           <input type="text"
            onChange={(e) => {
                setMothername(e.target.value);
              }}/>      
           <label>Numer Telefonu:</label>
           <input type="number"
       
            onChange={(e) => {
                setPhonenumber(e.target.value);
              }}/>

              <button onClick={register}> Stwórz konto </button>

        </div>
    )

}
       

export default Register;


import React,{ useEffect ,useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";



function Register(){

    const [userloginreg , setLoginreg]=useState("");
    const [userpasswordreg, setPasswordreg]=useState("");
    const [pesel, setPesel] = useState(0);
    const [email, setEmail] = useState("");
    const [firstname,setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [mothername, setMothername] = useState("");
    const [phonenumber, setPhonenumber] = useState(0);
    const his=useHistory();
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

    useEffect(() => {
      const checkLogin= async ()=>{
       let val= await Axios.get("http://localhost:3001/login");
      
       if(val.data.user)
       {
           his.push("/profile")
           // console.log(val.data.user[0].email);
       }
      }
      checkLogin();
   }, [])



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
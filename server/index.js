const express =require('express');
const mysql=require('mysql');
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser=require("body-parser");
const cookieparser=require("cookie-parser");
const session=require("express-session");
const saltRounds = 10;


const app=express();
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key:"userId",
    secret:"secret",
    resave:false,
    saveUninitialized:false,
    
}))

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'bank1'
})



app.post("/register",(req,res)=>{
    const login=req.body.login;
    const password=req.body.password;
    const email = req.body.email;
    const pesel = req.body.pesel;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const motherName = req.body.motherName;
    const phoneNumber = req.body.phoneNumber;
    const hash = bcrypt.hash(password,saltRounds)
      
       
        let sqll=`SELECT login.login, user.email, user.pesel, user.phoneNumber FROM user join login ON login.userId = user.userId 
        where login = '${login}' OR email = '${email}' OR pesel = '${pesel}' OR phoneNumber = '${pesel}'` ;
        db.query(sqll,
            (er,resul)=>{
            if(resul.length > 0)
            {
                resul.forEach(row => {
                    if (row.email === email) {
                        res.send({msg:"Email jest używany"})
                    }
                    if (row.login === login) {
                        res.send({msg:"Login jest używany"})
                    }
                    if (row.pesel === pesel) {
                        res.send({msg:"Zły pesel"})
                    }i
                    if (row.phoneNumber === phoneNumber) {
                        res.send({msg:"Zły numer"})
                    }
                  });

            }
            else{
                let sql=`INSERT INTO user (pesel,email,firstName,lastName,motherName,phoneNumber,login,password) VALUES (?,"?","?","?","?",?,"?","?")`;
                
             //let sql2=`INSERT INTO login (login,password,userId )   VALUES ("?","?",(select userId from user where pesel ='${pesel}' ))`;
             //let sql="INSERT INTO `user` SET ?";
                db.query(sql,
                    [pesel,email,firstName,lastName,motherName,phoneNumber,login,hash],
                    (err,result)=>{
                    if(err)

                    {
                        console.log(err)
                    }
                    else{
                         res.send(result);
                    }

                  
                })
                // db.query(sql2,
                //     [login,data],
                //     (err,result)=>{
                //     if(err)
                //     {
                //         console.log(err)
                //     }
                //     else{
                //          res.send(result);
                //     }

                  
                // })       
            }
        })

       
    
  

})



app.post("/login",(req,res)=>{
    const login=req.body.login;
     const password=req.body.password;

         let sql=`select * from login where login='${login}'`;

         db.query(sql,(err,result)=>{
             if(err)
             {
                
                 console.log(err);
             }
             else{
               
                if(result.length > 0)
                {
  
                 bcrypt.compare(password,result[0].password,(errr,response)=>{
                     if(response)
                     {
                         req.session.user=result;
                        
                      res.send({login:true,userlogin:login});
                     }
                     else{
                      res.send({login:false,msg:"Złe hasło"});
                     
                     }
                 })
 
                }

                else{
                     res.send({login:false,msg:"Użytkownik o takim loginie nie istnieje"});
               
                }
                
             }
         })       
 })

 app.listen(3001,()=>{
    console.log(`running` )
})
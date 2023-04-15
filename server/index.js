const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "bank1",
});

app.post("/register", (req, res)=>{
const userloginreg = req.body.userloginreg;
const userpasswordreg = req.body.userpasswordreg;
const pesel = req.body.pesel;
const email = req.body.email;
const firstname = req.body.firstname;
const lastname = req.body.lastname;
const mothername = req.body.mothername;
const phonenumber = req.body.phonenumber;

bcrypt.hash(userpasswordreg, saltRounds, (err, hash) => {
  if (err) {
    console.log(err);
  }
  let sqlqu = `INSERT INTO reg_request (login,pesel,email, firstName, lastName, motherName, phoneNumber, password) VALUES ("?",?,"?","?","?","?",?,"?")`;



  db.query(sqlqu,
    [userloginreg,pesel,email, firstname,lastname,mothername,phonenumber,hash],
    (err,result)=>{
      console.log(err);
    }
    );


});

});





app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});


app.post("/login",(req,res)=>{
  const userlogin = req.body.userlogin;
  const userpassword = req.body.userpassword;
  db.query(
    "SELECT * FROM req_request WHERE login = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(userpassword, result[0].userpassword, (error, response) => {
          if (response) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
          } else {
            res.send({ message: "Złe dane" });
          }
        });
      } else {
        res.send({ message: "Złe dane" });
      }
    }
  );

 });



app.listen(3001, () => {
  console.log("running server");
});

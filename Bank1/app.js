const express = require("express");
const path = require('path');
const mysql = require("mysql");
const cookieParser = require('cookie-parser');
const { connect } = require("http2");
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const jwt = require('jsonwebtoken')

const app = express();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});





const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//app.engine('hbs', hbs.engine);
db.connect( (error) => {
  if(error) {
    console.log(error)
  } else {
    console.log("MYSQL Connected...")
  }
})

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const clearTokenOnStartup = (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*10000),
    httpOnly: true
  });
  next();
};


app.listen(process.env.PROJECT_PORT, () => {
  console.log(`Server started on Port ${process.env.PROJECT_PORT}`);
})


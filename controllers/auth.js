const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const crypto = require('crypto');

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.login = async (req, res) => {

  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).render('login', {
        message: 'Wpisz login i hasło'
      })
    }

 

    db.query('SELECT * FROM reg_request WHERE login = ?', [login], async (error, results) => {
      console.log(results);
      if( results == "" || !(await bcrypt.compare(password, results[0].password)) )  {
        res.status(401).render('login', {
          message: 'Login lub hasło są niepoprawne'
        })
      } else {
        const id = results[0].id;
        const isAdmin = (results[0].role === 'admin');

        const token = jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        console.log("The token is: " + token);

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 15 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions);

        if (isAdmin) {
          res.status(200).redirect("/admin");
        } else {
          res.status(200).redirect("/");
        }
      }

    })

  } catch (error) {
    console.log(error);
  }


}


function generateAccountNumber() {
  return crypto.randomBytes(13).toString('hex').toUpperCase();
}

exports.register = (req, res) => {
  console.log(req.body);

  const{ login, email, pesel, password, confirmpassword, firstName, lastName, motherName, phoneNumber} = req.body;
  let sqll = 'SELECT * from reg_request WHERE login = ? OR email = ? OR pesel = ? OR phoneNumber = ? ';
  db.query(sqll,[login, email, pesel, phoneNumber], async (error, results)=> {

    console.log(results);

    if(error) {
      console.log(error);
    }

    
    if( results.lenght > 0 || login == 'admin' || login == 'Admin') {
      return res.render('register', {
        message: 'Niektóre dane są już używane'
      })
    } else if( password !== confirmpassword ) {
      return res.render('register', {
        message: 'Passwords do not match'
      });
    }else{
        
    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    let sqlq = `INSERT INTO reg_request (login,pesel,email, firstName, lastName, motherName, phoneNumber, password, role) VALUES (?,?,?,?,?,?,?,?,'user')`;
           
    db.query(sqlq, 
      [login,pesel,email, firstName,lastName,motherName,phoneNumber,hashedPassword],
       async (error, results) => {
      if(error) {
        console.log(error);
      } else {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log(results);

        
        const accountNumber = generateAccountNumber(); 

        // Dodanie numeru konta do bazy 
        const insertBankAccountQuery = "INSERT INTO account (user_id, bilans, account_number) VALUES (?, 0, ?)";
        const userId = results.insertId; 

        await db.query(insertBankAccountQuery, [userId, accountNumber]);

        return res.render('register', {
          message: 'User registered'
        });





        // return res.render('register', {
        //   message: 'User registered'
        // });
      }
    })

    }
  
  
  
  });

}

function generateAccountNumber() {
  const bankPrefix = "7777"; // prefix
  const randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, "0"); 

  return bankPrefix + randomNumber; 
}





exports.isLoggedIn = async (req, res, next) => {
   console.log(req.cookies.jwt + "A===================");
  if( req.cookies.jwt) {
    try {
     
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
      process.env.JWT_SECRET
      );

      console.log(decoded );

     
      db.query('SELECT * FROM reg_request WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result);

        if(!result) {
          return next();
        }

        req.user = result[0];
        console.log("user is")
        console.log(req.user);
        return next();

      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
}

exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}


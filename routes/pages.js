const mysql = require("mysql");
const express = require('express');
const authController = require('../controllers/auth');



const router = express.Router();
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});


router.get('/', authController.isLoggedIn, (req, res) => {
  res.render('index', {
    user: req.user
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});



router.get('/profile', authController.isLoggedIn, (req, res) => {
  console.log("sadsdsdadksjhkjh");
  console.log(req.user.id);
  if( req.user ) {

 
    try {
      // Pobierz listę danych z bazy danych
      const getDataQuery = `SELECT *, DATE_FORMAT(created_at, '%d.%m.%Y') as data,DATE_FORMAT(created_at, '%T') as czas  FROM transactions Where sender_id = ? OR recipient_id ORDER BY created_at DESC LIMIT 15`;
      db.query(getDataQuery,[req.user.id], (err,transrow)=>{
        
        res.render('profile', {
          user: req.user,
          transfer: transrow
        });
          console.log(transrow);
      });
  
      
    } catch (error) {
      console.error(error);
      res.status(500).send('Wystąpił błąd podczas pobierania listy danych.');
    }



   



  } else {
    res.redirect('/login');
  }
  



})



router.get('/history', authController.isLoggedIn, (req, res) => {
  console.log("sadsdsdadksjhkjh");
  console.log(req.user.id);
  if( req.user ) {

 
    try {
      // Pobierz listę danych z bazy danych
      const getDataQuery = `SELECT *, DATE_FORMAT(created_at, '%d.%m.%Y') as data,DATE_FORMAT(created_at, '%T') as czas  FROM transactions Where sender_id = ? OR recipient_id ORDER BY created_at DESC`;
      db.query(getDataQuery,[req.user.id], (err,transrow)=>{
        db.query
        res.render('history', {
          user: req.user,
          transfer: transrow
        });
          console.log(transrow);
      });
  
      
    } catch (error) {
      console.error(error);
      res.status(500).send('Wystąpił błąd podczas pobierania listy danych.');
    }



   



  } else {
    res.redirect('/login');
  }
  



})

// router.get('/admin',authController.isLoggedIn,(req, res) => {
//   console.log(req.user);
//   if( req.user.role == 'admin' ) {
//     let ppp;
//     db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.role !="admin" ', (error, result) => {
//       console.log("--------------");
//       ppp=result;
//       console.log(ppp);
  

//     });






router.get('/admin', authController.isLoggedIn, async (req, res) => {
  console.log(req.user);
  //sif (req.user.role == 'admin') {
    try {
      const getUsers = () => {
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.role != "admin"', (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      };
     

      const users = await getUsers();
    


 
    res.render('admin', {
      user: req.user,
      bil:users,
    });

  }catch (error) {
    console.error(error);
    // Obsługa błędu
  }
// }
//    else {
//     res.redirect('/profile');
//   }

});


router.post('/adminTransf', authController.isLoggedIn, async (req, res) => {
  const userId = req.body.balance; // Pobierz ID wybranego użytkownika z formularza
  const amount = req.body.amount; // Pobierz przekazywaną kwotę z formularza
console.log(amount);
  try {
    // Zaktualizuj wartość "bilans" w tabeli "account" dla wybranego użytkownika
    const updateQuery = 'UPDATE account SET bilans = bilans + ? WHERE user_id = ?';
    await db.query(updateQuery, [amount, userId]);

    res.redirect('/admin'); // Przekierowanie na stronę sukcesu

    
  } catch (error) {
    console.error('Błąd podczas aktualizacji bilansu: ', error);
    res.status(500).send('Wystąpił błąd podczas aktualizacji bilansu.');
  }
  
});




router.get('/history', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('history', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})


router.get('/transfer', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('transfer',{
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})












module.exports = router;
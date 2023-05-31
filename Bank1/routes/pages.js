const mysql = require("mysql");
const express = require('express');
const authController = require('../controllers/auth');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');



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
 // console.log(req.user.id);
  if( req.user ) {

 
    try {
      // Pobierz listę danych z bazy danych
      const getDataQuery = `SELECT *, DATE_FORMAT(created_at, '%d.%m.%Y') as data,DATE_FORMAT(created_at, '%T') as czas  FROM transactions Where sender_id = ? OR recipient_id ORDER BY created_at DESC LIMIT 15`;
      db.query(getDataQuery,[req.user.id], (err,transrow)=>{
        
        
        res.render('profile', {
          user: req.user,
          transfer: transrow,
          oszcz: req.oszczed
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
        
        const statrec = `
        SELECT AVG(amount) AS sred_wyd, SUM(amount) AS all_wyd
        FROM transactions
        WHERE recipient_id = ? AND created_at BETWEEN ? AND ?
      `;
      const statsend = `
      SELECT AVG(amount) AS sred_wyd, SUM(amount) AS all_wyd
      FROM transactions
      WHERE sender_id = ? AND created_at BETWEEN ? AND ?
    `;

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    if (!startDate || !endDate) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
  
    startDate = `${currentYear}-${currentMonth}-01`;
    endDate = `${currentYear}-${currentMonth + 1}-01`; 
    }
    db.query(statrec, [req.user.id, startDate, endDate], (error, results) => {
      if (error) {
        console.error('Wystąpił błąd podczas wykonywania zapytania:', error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych.');
      }
      db.query(statsend, [req.user.id, startDate, endDate], (error, results2) => {
        if (error) {
          console.error('Wystąpił błąd podczas wykonywania zapytania:', error);
          return res.status(500).send('Wystąpił błąd podczas pobierania danych.');
        }

        const wszystkiewydatki = results2[0].all_wyd;
        const wszystkieprzychody = results[0].all_wyd;

        const sredniewydatki = results2[0].sred_wyd;
        const srednieprzychody = results[0].sred_wyd;
        const bilanswydatkow = wszystkieprzychody - wszystkiewydatki;

        res.render('history', {
          user: req.user,
          transfer: transrow,
          wszystkiewydatki,
          wszystkieprzychody,
          sredniewydatki,
          srednieprzychody,
          bilanswydatkow
        });

      });
  



      
    });


        
          //console.log(transrow);
      });
  
      
    } catch (error) {
      console.error(error);
      res.status(500).send('Wystąpił błąd podczas pobierania listy danych.');
    }



  } else {
    res.redirect('/login');
  }
  

})


router.post('/history', authController.isLoggedIn, (req, res) => {
  console.log("sadsdsdadksjhkjh");
  console.log(req.user.id);
  if( req.user ) {


    try {
      // Pobierz listę danych z bazy danych
      const getDataQuery = `SELECT *, DATE_FORMAT(created_at, '%d.%m.%Y') as data,DATE_FORMAT(created_at, '%T') as czas  FROM transactions Where sender_id = ? OR recipient_id ORDER BY created_at DESC`;
      db.query(getDataQuery,[req.user.id], (err,transrow)=>{
        
        const statrec = `
        SELECT AVG(amount) AS sred_wyd, SUM(amount) AS all_wyd
        FROM transactions
        WHERE recipient_id = ? AND created_at BETWEEN ? AND ?
      `;
      const statsend = `
      SELECT AVG(amount) AS sred_wyd, SUM(amount) AS all_wyd
      FROM transactions
      WHERE sender_id = ? AND created_at BETWEEN ? AND ?
    `;

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    if (!startDate || !endDate) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
  
    startDate = `${currentYear}-${currentMonth}-01`;
    endDate = `${currentYear}-${currentMonth + 1}-01`; 
    }
    db.query(statrec, [req.user.id, startDate, endDate], (error, results) => {
      if (error) {
        console.error('Wystąpił błąd podczas wykonywania zapytania:', error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych.');
      }
      db.query(statsend, [req.user.id, startDate, endDate], (error, results2) => {
        if (error) {
          console.error('Wystąpił błąd podczas wykonywania zapytania:', error);
          return res.status(500).send('Wystąpił błąd podczas pobierania danych.');
        }

        const wszystkiewydatki = results2[0].all_wyd;
        const wszystkieprzychody = results[0].all_wyd;

        const sredniewydatki = results2[0].sred_wyd;
        const srednieprzychody = results[0].sred_wyd;
        const bilanswydatkow = wszystkieprzychody - wszystkiewydatki;

        res.render('history', {
          user: req.user,
          transfer: transrow,
          wszystkiewydatki,
          wszystkieprzychody,
          sredniewydatki,
          srednieprzychody,
          bilanswydatkow
        });

      });
  



      
    });


        
          //console.log(transrow);
      });
  
      
    } catch (error) {
      console.error(error);
      res.status(500).send('Wystąpił błąd podczas pobierania listy danych.');
    }



 
    // try {
    //   // Pobierz listę danych z bazy danych
    //   const getDataQuery = `SELECT *, DATE_FORMAT(created_at, '%d.%m.%Y') as data,DATE_FORMAT(created_at, '%T') as czas  FROM transactions Where sender_id = ? OR recipient_id ORDER BY created_at DESC`;
    //   db.query(getDataQuery,[req.user.id], (err,transrow)=>{
    //     db.query
    //     res.render('history', {
    //       user: req.user,
    //       transfer: transrow
    //     });
    //       console.log(transrow);
    //   });
  
      
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).send('Wystąpił błąd podczas pobierania listy danych.');
    // }



   



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

  console.log("00202012391209012391023910239019230912034912039102390129")
  if (req.user.role == 'admin') {
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
} else {
  res.redirect('/profile');
 }
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




// router.get('/history', authController.isLoggedIn, (req, res) => {
//   console.log(req.user);
//   if( req.user ) {
//     res.render('history', {
//       user: req.user
//     });
//   } else {
//     res.redirect('/login');
//   }
  
// })


router.get('/konto-oszczednosciowe', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('konto-oszczednosciowe', {
      
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})









router.post('/create_savings_account', authController.isLoggedIn, (req, res) => {
  console.log(req.userid.id);
   
  
  db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.id=?',req.userid.id, (error, result) => {
    const id_account=result[0].id_account;
    console.log(result);

    const wplacone_srodki = 0; 
    const adminOprocentowanie = getAdminOprocentowanie();
  
    const query = 'INSERT INTO k_oscz (id_account, wplacone_srodki, oprocentowanie) VALUES (?, ?, ?)';
    const values = [id_account, wplacone_srodki, adminOprocentowanie];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Błąd zapytania SQL: ', err);
        return res.status(500).send('Wystąpił błąd podczas tworzenia konta oszczędnościowego.');
      }
  
      res.status(200).render('konto-oszczednosciowe',{ message: 'Konto oszczędnościowe zostało utworzone.' });
    });
  });
 
});


 function getAdminOprocentowanie() {
    // Pobierz oprocentowanie z odpowiedniego źródła (np. baza danych, plik konfiguracyjny itp.)
    // Przykładowo:
    const adminOprocentowanie = 0.05; // Załóżmy, że oprocentowanie administratora wynosi 5%
  
    return adminOprocentowanie;
  }



router.get('/konto', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('konto',{
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})













// router.post('/create_savings_account', (req, res) => {
//   const { id_account, wplacone_srodki} = req.body;

//   // Wstawienie danych do tabeli k_oscz
//   const query = 'INSERT INTO k_oscz (id_account, wplacone_srodki, oprocentowanie) VALUES (?, ?, ?)';
//   const values = [id_account];
//   const adminOprocentowanie = getAdminOprocentowanie(); // Pobierz oprocentowanie z odpowiedniego źródła (np. bazy danych)


//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error('Błąd zapytania SQL: ', err);
//       return res.status(500).send('Wystąpił błąd podczas tworzenia konta oszczędnościowego.');
//     }
//     console.log('Konto oszczędnościowe zostało utworzone.');
//     return res.send('Konto oszczędnościowe zostało utworzone.');
//   });
// });


// function getAdminOprocentowanie() {
//   // Pobierz oprocentowanie z odpowiedniego źródła (np. baza danych, plik konfiguracyjny itp.)
//   // Przykładowo:
//   const adminOprocentowanie = 0.05; // Załóżmy, że oprocentowanie administratora wynosi 5%

//   return adminOprocentowanie;
// }























// router.post('/konto-oszczednosciowe', authController.isLoggedIn, (req, res) => {
//   // Odczytaj dane z formularza
//   const wplaconeSrodki = req.body.wplaconeSrodki;
//   const idAccount = req.user.id_account;

//   // Wykonaj zapytanie SQL INSERT do tabeli "k_oszcz"
//   const insertQuery = `INSERT INTO k_oszcz (id_account, wplacone_srodki) VALUES (?, ?)`;
//   connection.query(insertQuery, [idAccount, wplaconeSrodki], (err, result) => {
//     if (err) {
//       console.error(err);
//       // Obsłuż błąd
//       return res.status(500).send('Wystąpił błąd podczas zapisywania danych.');
//     }
//     // Dane zostały zapisane pomyślnie
//     // Przekieruj użytkownika na stronę sukcesu lub inny widok
//     res.redirect('/success');
//   });
// });

// router.get('/konto-oszczednosciowe', (req, res) => {
//   const query = 'SELECT * FROM account INNER JOIN k_oscz on account.id_account = k_oscz.id_account where '; // Przykładowe zapytanie
//   console.log('tests@@@@@@@@@@@@@@@@@s');
//   console.log(query);

//   connection.query(query, (error, results) => {
//     if (error) throw error;

//     const srodkiWplacone = results[0].wplacone_srodki; // Pobranie wartości "wplacone_srodki" z wyników zapytania
//     res.render('konto-oszczednosciowe', { srodkiWplacone }); // Przekazanie wartości do szablonu
//   });
// });


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

router.get('/transfer2', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('transfer2',{
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})




module.exports = router;
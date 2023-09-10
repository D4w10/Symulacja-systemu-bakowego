const mysql = require("mysql");
const express = require('express');
const authController = require('../controllers/auth');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const multer = require('multer');
const { error } = require("console");
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const router = express.Router();
const goalController = require('../controllers/goalController'); // Import kontrolera celów

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
      const getDataQuery =`SELECT *, DATE_FORMAT(t.created_at, '%d.%m.%Y') as data,DATE_FORMAT(t.created_at, '%T') as czas  
      FROM transactions t 
      inner join reg_request ON t.recipient_id = reg_request.id or t.sender_id = reg_request.id
       Where t.sender_id = ? OR t.recipient_id = ?
      ORDER BY created_at DESC LIMIT 15` ;
      db.query(getDataQuery,[req.user.id,req.user.id], (err,transrow)=>{
        console.log("testttttsafdsfd");

console.log(transrow[0]);
      const getMessageQuery = `SELECT * FROM messages WHERE id_odbiorcy = ? ORDER BY wyslano_o LIMIT 2`;

      db.query(getMessageQuery,[req.user.id], (err,result)=>{

      

        res.render('profile', {
          user: req.user,
          transfer: transrow,
          oszcz: req.oszczed,
          mess: result
        });
         // console.log(transrow);

      

        });

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
      const getDataQuery = `SELECT *, DATE_FORMAT(t.created_at, '%d.%m.%Y') as data,DATE_FORMAT(t.created_at, '%T') as czas  
      FROM transactions t 
      inner join reg_request ON t.recipient_id = reg_request.id or t.sender_id = reg_request.id
       Where t.sender_id = ? OR t.recipient_id = ?
      ORDER BY created_at DESC` ;
      db.query(getDataQuery,[req.user.id,req.user.id], (err,transrow)=>{
        
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
      const getDataQuery = `SELECT *, DATE_FORMAT(t.created_at, '%d.%m.%Y') as data,DATE_FORMAT(t.created_at, '%T') as czas  
      FROM transactions t 
      inner join reg_request ON t.recipient_id = reg_request.id or t.sender_id = reg_request.id
       Where t.sender_id = ? OR t.recipient_id = ?
      ORDER BY created_at DESC`;
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



  
router.get('/admin', authController.isLoggedIn, async (req, res) => {
  console.log(req.user);
  console.log(req.userid);

  if (req.userid) {
    if (req.user.role == 'admin') {
      try {
        const search = req.query.search;
        let query =
          'SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.role != "admin"';
        let queryParams = [];
        if (search) {
          query =
            'SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.role != "admin" AND (reg_request.firstName LIKE ? OR reg_request.lastName LIKE ? OR reg_request.login LIKE ?)';
          queryParams = [`%${search}%`, `%${search}%`, `%${search}%`];
        }

        // Sortowanie wyników
        const sort = req.query.sort;
        if (sort) {
          const validColumns = ['id', 'firstName', 'lastName', 'bilans', 'login'];
          if (validColumns.includes(sort)) {
            query += ` ORDER BY ${sort}`;
          }
        }

        db.query(query, queryParams, (error, result) => {
          if (error) {
            console.log(error);
          }

          console.log(result);

          res.render('admin', {
            users: result,
          });
        });
      } catch (error) {
        console.error(error);
        // Obsługa błędu
      }
    } else {
      res.redirect('/profile');
    }
  } else {
    res.redirect('/profile');
  }
});

router.get('/admin_opinion', authController.isLoggedIn, async (req, res) => {
  console.log(req.user);
  console.log(req.userid);

  

  // Sprawdź, czy użytkownik jest zalogowany
  if (!req.userid) {
    return res.redirect('/profile');
  }

  // Sprawdź, czy użytkownik ma rolę admina
  if (req.user.role !== 'admin') {
    return res.redirect('/profile');
  }

  const query = 'SELECT * FROM opinie';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Błąd podczas pobierania opinii:', err);
      return res.status(500).send('Błąd podczas pobierania opinii.');
    }
   



    function formatDateToDdMmYyyy(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      return `${day}-${month}-${year}`;
    }
    
    const opinions = result.map(opinion => ({
      ...opinion,
      data_wystawienia: formatDateToDdMmYyyy(opinion.data_wystawienia),
    })); // Pobrane opinie z datą w odpowiednim formacie
    function calculateAverageRating(opinions) {
      if (opinions.length === 0) {
        return 0; // Jeśli brak opinii, średnia wynosi 0.
      }
    
      // Oblicz sumę wszystkich ocen
      const totalRating = opinions.reduce((sum, opinion) => sum + opinion.ocena, 0);
    
      // Oblicz średnią
      const averageRating = totalRating / opinions.length;
    
      // Zaokrąglij średnią do dwóch miejsc po przecinku
      return averageRating.toFixed(2);
      
    }
    const averageRating = calculateAverageRating(opinions);

    // Renderuj widok z danymi opinii
    res.render('admin_opinion.ejs', { opinions,averageRating });
  });
});





















router.get('/admininfo', authController.isLoggedIn, async (req, res) => {
  console.log(req.user);

  if( req.user ) {


    try {
      // Pobierz informacje z bazy danych
      const infoQuery = 'SELECT * FROM info';
     await db.query(infoQuery,(error,info)=>{
      res.render('admininfo', { info });
     });
  
      // Renderuj szablon EJS i przekaż pobrane informacje do szablonu
      
    } catch (error) {
      console.error('Błąd podczas pobierania informacji:', error);
      res.status(500).json({ success: false, message: 'Wystąpił błąd podczas pobierania informacji.' });
    }





  } else {
    res.redirect('/login');
  }
  
})




router.get('/edit/:id',authController.isLoggedIn, (req, res) => {
  if(req.userid){
    if (req.user.role == 'admin') {

  const userId = req.params.id;
  db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.role != "admin" AND reg_request.id = ?', [userId], (error, results) => {


    if (error) throw error;
    res.render('edit', { user: results[0] });




  });
}else{
  res.redirect('/profile');
}
}else{
  res.redirect('/profile');
}



});

router.post('/edit/:id', (req, res) => {
 
  const userId = req.params.id;
  const { firstName, lastName, email, motherName, pesel, phoneNumber } = req.body;
  console.log(userId);
  // Aktualizacja danych użytkownika w bazie danych
  db.query(
    'UPDATE reg_request SET firstName = ?, lastName = ?, email = ?, motherName = ?, phonenumber = ?, pesel = ? WHERE id = ?',
    [firstName, lastName, email, motherName, phoneNumber,pesel, userId],
    (err, results) => {
      if (err) throw err;
      res.redirect('/edit/' + userId);
    }
  );

});

router.post('/addmoney/:id', (req, res) => {
  const userId = req.params.id;
  const amount = req.body.amount;

  db.query('SELECT * FROM account WHERE user_id = ?', [userId], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const currentBalance = results[0].bilans || 0;
      const updatedBalance = currentBalance + parseFloat(amount);

      db.query(
        'UPDATE account SET bilans = ? WHERE user_id = ?',
        [updatedBalance, userId],
        (err, result) => {
          if (err) throw err;
          res.redirect('/edit/' + userId);
        }
      );
    } else {
      res.redirect('/admin');
    }
  });
});


router.get('/delete/:id', authController.isLoggedIn, (req, res) => {
  if (req.userid) {
    if (req.user.role == 'admin') {
      const userId = req.params.id;

      db.beginTransaction((err) => {
        if (err) throw err;

        db.query('SELECT * FROM account WHERE user_id = ?', [userId], (err, ress) => {
          if (err) {
            db.rollback(() => {
              throw err;
            });
          }

          const accountId = ress[0].id_account;

          db.query('DELETE FROM k_oscz WHERE id_account = ?', [accountId], (err, results) => {
            if (err) {
              db.rollback(() => {
                throw err;
              });
            }

            db.query('DELETE FROM account WHERE user_id = ?', [userId], (err, result) => {
              if (err) {
                db.rollback(() => {
                  throw err;
                });
              }

              db.query('DELETE FROM reg_request WHERE id = ?', [userId], (err, result) => {
                if (err) {
                  db.rollback(() => {
                    throw err;
                  });
                }
                const Numbe = ress[0].account_number

                axios.post('http://localhost:4000/usun-num', { Numbe })
               .then(response => {
                 console.log('Identyfikator użytkownika wysłany i usunięty z bazy danych na drugim serwerze.');
               })
               .catch(error => {
                 console.log('Błąd podczas wysyłania identyfikatora użytkownika do drugiego serwera.');
                 db.rollback(() => {
                   throw err;
                  
                 });
               });

                db.commit((err) => {
                  if (err) {
                    db.rollback(() => {
                      throw err;
                    });
                  }

                  res.redirect('/admin');
                });
              });
            });
          });
        });
      });

    } else {
      res.redirect('/profile');
    }
  } else {
    res.redirect('/profile');
  }
});


  router.post('/messages/:id', authController.isLoggedIn, async (req, res) =>{

  const idNadawcy= req.userid.id;
  const naglowek = req.body.naglowek;
  const tresc = req.body.tresc;
  const idOdbiorcy = req.params.id;

  try {
    // Rozpoczęcie transakcji
    await db.beginTransaction();


      const messageQuery = 'INSERT INTO messages (id_nadawcy, id_odbiorcy, naglowek , tresc) VALUES (?, ?,? , ?)';
      await db.query(messageQuery, [idNadawcy, idOdbiorcy, naglowek, tresc]);
    

    // Zatwierdzenie transakcji
    await db.commit();
   
    res.redirect('/edit/' + idOdbiorcy + '?messageSent=true'); // Dodanie messageSent


  } catch (error) {
    // Anulowanie transakcji w przypadku błędu
    await db.rollback();

    console.error('Wystąpił błąd podczas wysyłania wiadomości:', error);
    
      
    }
  //  finally {
  //   // Zakończenie połączenia z bazą danych
  //   await db.release();
  // }
});


router.get('/messages', authController.isLoggedIn, async (req, res) => {
  console.log(req.user);
  
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  
  try {
    // Pobierz wiadomości dla zalogowanego użytkownika
    const userId = req.userid.id;
    const messagesQuery = `SELECT id, id_nadawcy, id_odbiorcy, naglowek, tresc, DATE_FORMAT(wyslano_o, '%d.%m.%Y %H:%i:%s') AS formatted_date FROM messages where id_odbiorcy = ?`;
    
    db.query(messagesQuery, [userId], (error, messages) => {
      if (error) {
        console.error('Wystąpił błąd podczas pobierania wiadomości:', error);
        res.status(500).json({ success: false, message: 'Wystąpił błąd podczas pobierania wiadomości.' });
      } else {
        res.render('messages', {
          user: req.user,
          messages: messages
        });
      }
    });
  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania wiadomości:', error);
    res.status(500).json({ success: false, message: 'Wystąpił błąd podczas pobierania wiadomości.' });
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


router.get('/historydetails', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('historydetails', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})



router.get('/profile/konto-oszczednosciowe', authController.isLoggedIn, (req, res) => {
  // Sprawdzenie stanu konta oszczędnościowego dla danego użytkownika
  const userId = req.userid.id;
  

  db.query('SELECT * FROM k_oscz WHERE id_oszcz = ?', userId, (error, results) => {
    if (error) {
      console.error('Błąd zapytania SQL: ', error);
      return res.status(500).send('Wystąpił błąd podczas sprawdzania konta oszczędnościowego.');
    }
console.log(results.length);
    if (results.length > 0) {
      // Przekierowanie na stronę k_oszcz_crn, jeśli konto oszczędnościowe jest już utworzone
      res.redirect('k_oszcz_crn');
    } else {
      // Przekierowanie na stronę konto-oszczednosciowe, jeśli konto nie zostało jeszcze utworzone
      res.render('/profile/konto-oszczednosciowe');
    }
  });
})


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


router.get('/k_oszcz_crn', authController.isLoggedIn, (req, res) => {
  console.log("sadsdsdadksjhkjh");
 // console.log(req.user.id);
  if( req.user ) {

 
    try {
      // Pobierz listę danych z bazy danych
      const getDataQuery = `SELECT *, DATE_FORMAT(created_at, '%d.%m.%Y') as data,DATE_FORMAT(created_at, '%T') as czas  FROM transactions Where sender_id = ? OR recipient_id ORDER BY created_at DESC LIMIT 15`;
      db.query(getDataQuery,[req.user.id], (err,transrow)=>{
        
        
        res.render('k_oszcz_crn', {
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

router.get('/konto-oszczednosciowe', (req, res) => {
  // Obsługa żądania GET dla ścieżki /k_oszcz_crn
  res.render('konto-oszczednosciowe');
});

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
      const getDataQuery = `SELECT *, DATE_FORMAT(created_at, '%d.%m.%Y') as data, DATE_FORMAT(created_at, '%T') as czas FROM transactions WHERE sender_id = ? OR recipient_id ORDER BY created_at DESC LIMIT 15`;
      db.query(getDataQuery, [req.user.id], (err, transrow) => {
        if (err) {
          console.error('Błąd zapytania SQL: ', err);
          return res.status(500).send('Wystąpił błąd podczas pobierania danych.');
        }
        
        
        res.redirect(301,'/k_oszcz_crn')
          console.log(transrow);
      });

    });
  });
 
});

router.post('/przelej-srodki', authController.isLoggedIn, (req, res) => {
  const userId = req.userid.id; // Pobranie identyfikatora zalogowanego użytkownika z sesji
console.log(userId);
console.log("4444444444444444444444444444444444444444");
  // Pobranie numeru konta użytkownika
  db.query('SELECT * FROM account WHERE user_id = ?', userId, (error, results) => {
    if (error) {
      console.error('Błąd zapytania SQL: ', error);
      return res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
    }

    if (results.length === 0) {
      return res.status(404).send('Nie znaleziono konta dla zalogowanego użytkownika.');
    }
    

    const accountNumber = results[0].account_number;
    const amount = req.body.amount;

    if (amount <= 0) {
      return res.redirect("/k_oszcz_crn");
      
    }
  
    // Sprawdzenie, czy użytkownik ma wystarczającą ilość środków na koncie
    if (results[0].bilans < amount) {
      return res.redirect("/k_oszcz_crn");
    }

    // Rozpoczęcie transakcji
    db.beginTransaction((error) => {
      if (error) {
        console.error('Błąd rozpoczynania transakcji: ', error);
        return res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
      }

      // Zmniejszenie bilansu na koncie użytkownika
      db.query('UPDATE account SET bilans = bilans - ? WHERE user_id = ?', [amount, userId], (error) => {
        if (error) {
          console.error('Błąd zapytania SQL: ', error);
          return db.rollback(() => {
            res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
          });
        }

        console.log("dsadasdasdasd");
        
      // Zwiększenie wplaconych srodkow na koncie oszczednosciowym
      db.query('UPDATE k_oscz SET wplacone_srodki = wplacone_srodki + ? WHERE id_account = ?', [amount, results[0].id_account], (error) => {
        if (error) {
          console.error('Błąd zapytania SQL: ', error);
          return db.rollback(() => {
            res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
          });
        }
        console.log("dsadasdasdasd");
          // Zatwierdzenie transakcji
          db.commit((error) => {
            if (error) {
              console.error('Błąd zatwierdzania transakcji: ', error);
              return db.rollback(() => {
                res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
              });
            }
            console.log("przekierowanie");
            return res.redirect('/k_oszcz_crn')
          });
          
        });
      });
    });
    


  });
});


router.post('/wyplac-srodki', (req, res) => {
  const accountId = req.body.account_id;

  // Pobranie danych konta oszczędnościowego
  db.query('SELECT * FROM k_oscz WHERE id_oszcz = ?', [accountId], (error, results) => {
    if (error) {
      console.error('Błąd zapytania SQL: ', error);
      return res.status(500).send('Wystąpił błąd podczas wypłacania środków.');
    }

    if (results.length === 0) {
      return res.status(404).send('Nie znaleziono konta oszczędnościowego.');
    }

    const accountBalance = results[0].wplacone_srodki;
    const accountId = results[0].id_account;

    // Rozpoczęcie transakcji
    db.beginTransaction((error) => {
      if (error) {
        console.error('Błąd rozpoczynania transakcji: ', error);
        return res.status(500).send('Wystąpił błąd podczas wypłacania środków.');
      }

      // Aktualizacja stanu konta oszczędnościowego
      db.query('UPDATE k_oscz SET wplacone_srodki = 0 WHERE id_oszcz = ?', [accountId], (error) => {
        if (error) {
          console.error('Błąd zapytania SQL: ', error);
          return db.rollback(() => {
            res.status(500).send('Wystąpił błąd podczas wypłacania środków.');
          });
        }

        // Pobranie aktualnego bilansu konta głównego
        db.query('SELECT bilans FROM account WHERE id_account = ?', [accountId], (error, results) => {
          if (error) {
            console.error('Błąd zapytania SQL: ', error);
            return db.rollback(() => {
              res.status(500).send('Wystąpił błąd podczas pobierania bilansu konta.');
            });
          }

          if (results.length === 0) {
            return db.rollback(() => {
              res.status(404).send('Nie znaleziono konta głównego.');
            });
          }

          const currentBalance = results[0].bilans;
          const updatedBalance = currentBalance + accountBalance;

          // Aktualizacja bilansu na koncie głównym
          db.query('UPDATE account SET bilans = ? WHERE id_account = ?', [updatedBalance, accountId], (error) => {
            if (error) {
              console.error('Błąd zapytania SQL: ', error);
              return db.rollback(() => {
                res.status(500).send('Wystąpił błąd podczas aktualizacji bilansu konta.');
              });
            }

            // Odejmowanie środków z konta oszczędnościowego
            db.query('UPDATE k_oscz SET wplacone_srodki = wplacone_srodki - ? WHERE id_account = ?', [accountBalance, accountId], (error) => {
              if (error) {
                console.error('Błąd zapytania SQL: ', error);
                return db.rollback(() => {
                  res.status(500).send('Wystąpił błąd podczas odejmowania środków z konta oszczędnościowego.');
                });
              }

              // Zatwierdzenie transakcji
              db.commit((error) => {
                if (error) {
                  console.error('Błąd zatwierdzania transakcji: ', error);
                  return db.rollback(() => {
                    res.status(500).send('Wystąpił błąd podczas zatwierdzania transakcji.');
                  });
                }

                return res.redirect('/k_oszcz_crn');
              });
            });
          });
        });
      });
    });
  });
});



 function getAdminOprocentowanie() {
    // Pobierz oprocentowanie z odpowiedniego źródła (np. baza danych, plik konfiguracyjny itp.)
    // Przykładowo:
    const adminOprocentowanie = 0.05; // Załóżmy, że oprocentowanie administratora wynosi 5%
  
    return adminOprocentowanie;
  }
  

// Funkcja do naliczania odsetek
function naliczOdsetki() {
  db.query('SELECT * FROM k_oscz', (error, results) => {
    if (error) {
      console.error('Błąd zapytania SQL: ', error);
      return;
    }

    // Iteracja przez konta oszczędnościowe
    results.forEach((konto) => {
      const wplaconeSrodki = konto.wplacone_srodki;

      // Oprocentowanie dziennie (5%)
      const oprocentowanieDziennie = 0.05;
      const odsetki = (oprocentowanieDziennie / 4320) * wplaconeSrodki;

      // Aktualizacja salda na koncie oszczędnościowym
      db.query('UPDATE k_oscz SET wplacone_srodki = wplacone_srodki + ? WHERE id_account = ?', [odsetki, konto.id_account], (error) => {
        if (error) {
          console.error('Błąd zapytania SQL: ', error);
        }
      });
    });
  });
}

cron.schedule('*/20 * * * * *', () => {
  naliczOdsetki();
});


router.post('/przelej-srodki', authController.isLoggedIn, (req, res) => {
  // ...

  // Zwiększenie wpłaconych środków na koncie oszczędnościowym
  db.query('UPDATE k_oscz SET wplacone_srodki = wplacone_srodki + ? WHERE id_account = ?', [amount, userId], (error) => {
    if (error) {
      console.error('Błąd zapytania SQL: ', error);
      return db.rollback(() => {
        res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
      });
    }

    // Zatwierdzenie transakcji
    db.commit((error) => {
      if (error) {
        console.error('Błąd zatwierdzania transakcji: ', error);
        return db.rollback(() => {
          res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
        });
      }

      return res.redirect('/k_oszcz_crn')
    });
  });

  
});


router.post('/receive-file', (req, res) => {
  const fileData = req.body;

  //console.log(req.body)
  console.log("działa");
  //res.status(200).json({ message: 'Plik odebrany pomyślnie' });



  fileData.forEach((data) => {
    const sender = data.sender[0];
    const recipient = data.recipient;
    console.log(recipient.banknumber);

    const getRecipientQuery = 'SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id  WHERE account.account_number = ?';
    db.query(getRecipientQuery, [recipient.banknumber], (error,result) =>{
     
       const updateRecipientAccountQuery = 'UPDATE account SET bilans = bilans + ? WHERE user_id = ?';
       if(result && result.length > 0){
        console.log("POLSKA GOLA");
        db.query(updateRecipientAccountQuery, [recipient.amount, result[0].user_id], async (error) => {
          if (error) {
            db.rollback(() => {
              throw error;
            });
          }

          const addTransactionQuery = 'INSERT INTO transactions (sender_id, recipient_id, amount, sender_account_number, recipient_account_number, descrip) VALUES (?, ?, ?, ?, ?, ?)';
          db.query(addTransactionQuery, [sender.id, result[0].id, recipient.amount, sender.account_number, result[0].account_number, recipient.description], async (error) => {
            if (error) {
              db.rollback(() => {
                throw error;
              });
            }

            db.commit((error) => {
              if (error) {
                db.rollback(() => {
                  throw error;
                });
              }

             console.log("dane dodane pomyślnie");
            });
          });
        });
      }
//
    });
       


    });




});


router.post('/goals', authController.isLoggedIn, goalController.createGoal);
router.post('/goals/:id/deposit', authController.isLoggedIn, goalController.depositToGoal);
router.post('/goals/:id/withdraw', authController.isLoggedIn, goalController.withdrawFromGoal);
router.post('/goals/:id/delete', authController.isLoggedIn, goalController.deleteGoal);


router.get('/goals', authController.isLoggedIn, goalController.getGoals, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('goals',{
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
  
})
router.get('/zlecenia', authController.isLoggedIn, (req, res) => {
  
  console.log(req.user);

  if( req.user ) {
    const show_list='SELECT * from current_transfers where sender_id=?';
    db.query(show_list,[req.user.id],(error,result)=>{
      res.render('zlecenia',{
        user: req.user,
        showl:result


        
      });
      console.log(result);
    })
   
  } else {
    res.redirect('/login');
  }
  
})











router.post('/rozpocznij-przelewy', authController.isLoggedIn, (req, res) => {
  const accountNumber = req.body.accountNumber;
  const amount = parseFloat(req.body.amount);
  const interval = req.body.times;

  // const decreaseBalanceQuery = 'UPDATE account SET bilans = bilans - ? WHERE user_id = ?';
  // const increaseBalanceQuery = 'UPDATE account SET bilans = bilans + ? WHERE account_number = ?';
  // const findAccountNumberQuery = 'SELECT account_number FROM account WHERE user_id = ?';

  // // Pobieranie numeru konta nadawcy na podstawie ID użytkownika
  const userId = req.user.id;
  








  const insertTransferQuery = 'INSERT INTO current_transfers (recipient_account,sender_id, amount, transfer_interval, status) VALUES (?, ?, ?, ?,?)';
  db.query(insertTransferQuery, [accountNumber,userId ,amount, interval, 'w_trakcie'], (err, result) => {
    if (err) {
      console.error('Błąd podczas dodawania przelewu do bazy danych:', err);
      res.status(500).send('Wystąpił błąd podczas dodawania przelewu.');
      return;
    }
    const show_list='SELECT * from current_transfers where sender_id=?';
      db.query(show_list,[req.user.id],(error,result)=>{
        res.render('zlecenia',{
          user: req.user,
          showl:result,
          message:"Przelew zrealizowany pomyślnie"
  
  
          
        });
      })
  
    console.log('Dodano nowy przelew do bazy danych.');
    // Tutaj możesz wykonać jakieś akcje po dodaniu przelewu
  });








});
function show_list_db(){
  return new Promise((resolve, reject) => {
    db.query("SELECT * from current_transfers",(error,result)=>{
      if(error){
        reject(error);
      }
      else{
        resolve(result);
      }
    })
    
  })
}
function updatedb(amount,user_id,account_number){
   const decreaseBalanceQuery = 'UPDATE account SET bilans = bilans - ? WHERE user_id = ?';
  const increaseBalanceQuery = 'UPDATE account SET bilans = bilans + ? WHERE account_number = ?';


            // Zawsze obniż saldo konta nadawcy
            db.query(decreaseBalanceQuery, [amount, user_id], (err) => {
              if (err) {
                console.error('Błąd podczas zmniejszania salda konta nadawcy:', err);
              }
            });
      
            // Obniż saldo konta odbiorcy
            db.query(increaseBalanceQuery, [amount, account_number], (err) => {
              if (err) {
                console.error('Błąd podczas zmniejszania salda konta odbiorcy:', err);
              }
            });
      

          


 
  
}
cron.schedule('* * * * *',async()=>{
  try{
    const resultselect=await show_list_db();
    resultselect.forEach(element => {
      const amount=element.amount;
      const user_id=element.sender_id;
      const account_number=element.recipient_account;
      const interval=element.transfer_interval;
      if(interval>0){
        updatedb(amount,user_id,account_number);
        const odbiorca_select='SELECT * from reg_request r inner join account a on r.id = a.user_id where a.account_number = ? ';
        //dane odbiorcy
        db.query(odbiorca_select,[account_number],(error,result)=>{
          try{
            const res_select=result[0];
            const sender_select='SELECT * from reg_request r inner join account a on r.id = a.user_id where r.id = ? ';
            db.query(sender_select,[user_id],(er,ress)=>{

              try{
                const sender_wynik=ress[0];
                  const transaction_query='INSERT INTO transactions (sender_id, recipient_id, amount, sender_account_number, recipient_account_number, descrip) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(transaction_query,[user_id,res_select.id,amount,sender_wynik.account_number,account_number,'Przelew stały']);

              }
              catch(err){
                console.log(err);
              }
            })

          
          }
          catch(err){
            console.log(err);
          }
        })
      }

      
    });
  }
  catch(error){
    console.error(error);
  }
});

router.get('/zatrzymaj-przelew/:id', authController.isLoggedIn, (req, res) => {
  if (req.userid) {
    
      const id_job = req.params.id;
      const deleted_query='DELETE FROM current_transfers WHERE id=? ';


      db.beginTransaction((err) => {
        if (err) throw err;
       
              db.query(deleted_query,[id_job]);

          

                

                db.commit((err) => {
                  if (err) {
                    db.rollback(() => {
                      throw err;
                    });
                  }

                  const show_list='SELECT * from current_transfers where sender_id=?';
                  db.query(show_list,[req.user.id],(error,result)=>{
                    res.render('zlecenia',{
                      user: req.user,
                      showl:result,
                      del:"Przelew usuniety"
              
              
                      
                    });
                  })
                });
              });
      

    
  } else {
    res.redirect('/profile');
  }
});



// Obsługa /chat
router.get('/chat', (req, res) => {
  // Tutaj możesz renderować stronę chat.ejs
  res.render('chat');
});





router.post('/wystaw-opinie',authController.isLoggedIn, (req, res) => {
  const { ocena, tresc } = req.body;
  const dataWystawienia = new Date();
  // const userId = req.session.userId || null; // Pobierz ID użytkownika z sesji lub ustaw null, jeśli niezalogowany
  const userId = req.user.id || null;

  const insertQuery = 'INSERT INTO opinie (data_wystawienia, ocena, tresc, uzytkownik_id) VALUES (?, ?, ?, ?)';
  db.query(insertQuery, [dataWystawienia, ocena, tresc, userId], (err, result) => {
    if (err) {
      console.error('Błąd podczas wstawiania opinii:', err);
      return res.status(500).send('Błąd podczas zapisywania opinii.');
    }

    res.status(200).send('Opinia została pomyślnie dodana.');
  });
});


router.post('/wystaw-opiniee', (req, res) => {
  const { ocena, tresc } = req.body;
  const dataWystawienia = new Date();
  // const userId = req.session.userId || null; // Pobierz ID użytkownika z sesji lub ustaw null, jeśli niezalogowany
  const userId =  null;

  const insertQuery = 'INSERT INTO opinie (data_wystawienia, ocena, tresc, uzytkownik_id) VALUES (?, ?, ?, ?)';
  db.query(insertQuery, [dataWystawienia, ocena, tresc, userId], (err, result) => {
    if (err) {
      console.error('Błąd podczas wstawiania opinii:', err);
      return res.status(500).send('Błąd podczas zapisywania opinii.');
    }

    res.status(200).send('Opinia została pomyślnie dodana.');
  });
});











module.exports = router;
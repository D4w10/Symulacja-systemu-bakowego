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
        

       

        
      // Zwiększenie wplaconych srodkow na koncie oszczednosciowym
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


module.exports = router;
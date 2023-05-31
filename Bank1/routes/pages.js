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
      // Przekierowanie na stronę test, jeśli konto oszczędnościowe jest już utworzone
      res.redirect('test');
    } else {
      // Przekierowanie na stronę konto-oszczednosciowe, jeśli konto nie zostało jeszcze utworzone
      res.render('/profile/konto-oszczednosciowe');
    }
  });
})



router.get('/test', (req, res) => {
  // Obsługa żądania GET dla ścieżki /test
  res.render('test');
});
router.get('/konto-oszczednosciowe', (req, res) => {
  // Obsługa żądania GET dla ścieżki /test
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
        
        
        res.redirect(301,'/test')
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

    // Sprawdzenie, czy użytkownik ma wystarczającą ilość środków na koncie
    if (results[0].balance < amount) {
      return res.status(400).send('Nie masz wystarczającej ilości środków na koncie.');
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

            return res.redirect('/test')
          });
        });
      });
    });
  });
});

// router.post('/przelej-srodki', authController.isLoggedIn, (req, res) => {
//   const userId = req.userid.id; // Pobranie identyfikatora zalogowanego użytkownika z sesji

//   // Pobranie numeru konta użytkownika
//   db.query('SELECT * FROM account WHERE user_id = ?', userId, (error, results) => {
//     if (error) {
//       console.error('Błąd zapytania SQL: ', error);
//       return res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
//     }

//     if (results.length === 0) {
//       return res.status(404).send('Nie znaleziono konta dla zalogowanego użytkownika.');
//     }

//     const accountNumber = results[0].account_number;
//     const amount = req.body.amount;

//     // Sprawdzenie, czy użytkownik ma wystarczającą ilość środków na koncie
//     if (results[0].balance < amount) {
//       return res.status(400).send('Nie masz wystarczającej ilości środków na koncie.');
//     }

//     // Rozpoczęcie transakcji
//     db.beginTransaction((error) => {
//       if (error) {
//         console.error('Błąd rozpoczynania transakcji: ', error);
//         return res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
//       }

//       // Zmniejszenie bilansu na koncie użytkownika
//       db.query('UPDATE account SET bilans = bilans - ? WHERE user_id = ?', [amount, userId], (error) => {
//         if (error) {
//           console.error('Błąd zapytania SQL: ', error);
//           return db.rollback(() => {
//             res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
//           });
//         }
        

       

        
//         // Zwiększenie wplaconych srodkow na koncie oszczednosciowym
//         db.query('INSERT INTO k_oscz (id_account, wplacone_srodki)  VALUES (?, ?)', [userId, amount], (error) => {
//           if (error) {
//             console.error('Błąd zapytania SQL: ', error);
//             return db.rollback(() => {
//               res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
//             });
//           }

//           // Zatwierdzenie transakcji
//           db.commit((error) => {
//             if (error) {
//               console.error('Błąd zatwierdzania transakcji: ', error);
//               return db.rollback(() => {
//                 res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
//               });
//             }

//             return res.redirect('/test')
//           });
//         });
//       });
//     });
//   });
// });

// router.post('/przelej-srodki', authController.isLoggedIn, (req, res) => {
//   const userId = req.userid.id; // Pobranie identyfikatora zalogowanego użytkownika z sesji

//   // Pobranie numeru konta użytkownika
//   db.query('SELECT * FROM account WHERE user_id = ?', userId, (error, results) => {
//     if (error) {
//       console.error('Błąd zapytania SQL: ', error);
//       return res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
//     }

//     if (results.length === 0) {
//       return res.status(404).send('Nie znaleziono konta dla zalogowanego użytkownika.');
//     }

//     const accountNumber = results[0].account_number;
//     const amount = req.body.amount;

//     // Zapisanie środków na koncie "k_oszcz" na podstawie numeru konta
//     db.query('INSERT INTO k_oszcz (id_account, wplacone_srodki) VALUES (?, ?)', [accountNumber, amount], (error) => {
//       if (error) {
//         console.error('Błąd zapytania SQL: ', error);
//         return res.status(500).send('Wystąpił błąd podczas przesyłania środków.');
//       }

//       return res.send('Przelew zakończony pomyślnie.');
//     });
//   });
// });

// router.post('/przelej-srodki', authController.isLoggedIn, (req, res) => {
//   const userId = req.userid.id; // Pobranie identyfikatora zalogowanego użytkownika z sesji

//   // Pobranie numeru konta użytkownika
//   db.query('SELECT * FROM account WHERE user_id = ?', userId, (error, results) => {
//     if (error) {
//       console.error('Błąd zapytania SQL: ', error);
//       return res.status(500).send('Wystąpił błąd podczas sprawdzania konta użytkownika.');
//     }

//     console.log('Wyniki zapytania SQL:', results);
//     res.send('Sprawdzanie konta zakończone. Sprawdź konsolę, aby zobaczyć wyniki zapytania SQL.');
//   });
// });













// router.post('/create_savings_account', authController.isLoggedIn, (req, res) => {
//   console.log(req.userid.id);
   
  
//   db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.id=?',req.userid.id, (error, result) => {
//     const id_account=result[0].id_account;
//     console.log(result);

//     const wplacone_srodki = 0; 
//     const adminOprocentowanie = getAdminOprocentowanie();
  
//     const query = 'INSERT INTO k_oscz (id_account, wplacone_srodki, oprocentowanie) VALUES (?, ?, ?)';
//     const values = [id_account, wplacone_srodki, adminOprocentowanie];
  
//     db.query(query, values, (err, result) => {
//       if (err) {
//         console.error('Błąd zapytania SQL: ', err);
//         return res.status(500).send('Wystąpił błąd podczas tworzenia konta oszczędnościowego.');
//       }
  
//       // res.status(200).render('konto-oszczednosciowe',{ message: 'Konto oszczędnościowe zostało utworzone.' });
//       // res.status(200).render('profile',{}); // Przesłanie informacji o ukryciu przycisku
//       const getDataQuery = `SELECT *, DATE_FORMAT(created_at, '%d.%m.%Y') as data,DATE_FORMAT(created_at, '%T') as czas  FROM transactions Where sender_id = ? OR recipient_id ORDER BY created_at DESC LIMIT 15`;
//       db.query(getDataQuery,[req.user.id], (err,transrow)=>{
        
        
//         res.status(200).render('profile', {
//           user: req.user,
//           transfer: transrow,
//           oszcz: req.oszczed
//         });
//           console.log(transrow);
//       });

//     });
//   });
 
// });


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







// router.get('/konto-oszczednosciowe', authController.isLoggedIn, (req, res) => {
//   console.log(req.user);
//   if( req.user ) {
//     res.render('konto-oszczednosciowe', {
      
//       user: req.user
//     });
//   } else {
//     res.redirect('/login');
//   }
  
// })








// router.get('/konto-oszczednosciowe', authController.isLoggedIn, (req, res) => {
//   const userId = req.userid.id;

//   db.query('SELECT * FROM k_oscz WHERE id_oszcz = ?', userId, (error, results) => {
//     if (error) {
//       console.error('Błąd zapytania SQL: ', error);
//       return res.status(500).send('Wystąpił błąd podczas sprawdzania konta oszczędnościowego.');
//     }

//     if (results.length > 0) {
//       // Konto oszczędnościowe jest już utworzone, przekieruj na stronę "test"
//       res.redirect('/test');
//     } else {
//       // Konto oszczędnościowe nie jest jeszcze utworzone, przekieruj na stronę "konto-oszczednosciowe"
//       res.redirect('/konto-oszczednosciowe');
//     }
//   });
// });





// router.get('/konto-oszczednosciowe', authController.isLoggedIn, (req, res) => {
//   // Sprawdzenie stanu konta oszczędnościowego dla danego użytkownika
//   const userId = req.userid.id;

//   db.query('SELECT * FROM k_oscz WHERE id_oszcz = ?', userId, (error, results) => {
//     if (error) {
//       console.error('Błąd zapytania SQL: ', error);
//       return res.status(500).send('Wystąpił błąd podczas sprawdzania konta oszczędnościowego.');
//     }

//     if (results.length > 0) {
//       // Przekierowanie na stronę docelową, jeśli konto oszczędnościowe jest już utworzone
//       res.redirect('/test'); // Zastąp 'strona-docelowa' odpowiednią ścieżką do docelowej strony
//     } else {
//       // Przekierowanie do formularza tworzenia konta oszczędnościowego, jeśli konto nie zostało jeszcze utworzone
//       res.redirect('/konto-oszczednosciowe'); // Zastąp 'formularz-utworzenia-konta-oszczednosciowego' odpowiednią ścieżką do formularza
//     }
//   });
// });




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
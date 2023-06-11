const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const crypto = require('crypto');
const express = require('express');
const axios = require('axios');
const http = require('http');
const { error } = require("console");
http.globalAgent.maxSockets = Infinity;
axios.defaults.maxSockets = Infinity;

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});



exports.transfer = async (req, res) => {

    try {
      const { amount, banknumber, description, przelew } = req.body;
    const recipientBankId = banknumber.substring(0,4);
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
        process.env.JWT_SECRET);
       const senderId = decoded.id;
      
 
  if(przelew == 'wew'){
    makeTransferIn(amount, banknumber, description, senderId, res);
  }

  if(przelew == 'elixir' ){
        console.log("elixir");

      makeTransferElixir(amount, banknumber, description, senderId, res, recipientBankId);

      }

      
      if(przelew == 'sorbnet' ){
        console.log("sorbnet");
        const getSenderAccountQuery = 'SELECT * FROM account WHERE user_id = ?';

        db.query(getSenderAccountQuery, [senderId], async (error, senderAccountResult2) => {

          console.log(senderAccountResult2);

          axios.post('http://localhost:5002/7777', )


          const dataToSend = {
            name: 'ADAM',
            age: 30,
            email: 'ADam@Małysz',
            banknumber: '7777'
          };


             axios.post('http://localhost:5002/7777', dataToSend)
                .then(response => {
                  console.log('Dane zostały wysłane pomyślnie');
                  // Obsłuż odpowiedź serwera
                  res.render('transfer',{ message: 'Przelew wykonany pomyślnie.' });
                })
                .catch(error => {
                  console.error('Wystąpił błąd podczas wysyłania danych:', error);
                  // Obsłuż błąd
                  res.render('transfer',{ message: 'błąd podczas wykonywania przelewu' });
                });
            

        })
      
        
      
      
          console.log("TESS");
      
      
      
      



      }



    } catch (error) {
     // await db.rollback();
      console.log(error);
      res.status(500).render('transfer',{ message: 'Wystąpił błąd podczas wykonywania przelewu.' });
    }
 

  };



async function makeTransferIn(amount, banknumber, description, senderId, res) {

    // Pobierz informacje o użytkowniku odbiorcy
    db.query('SELECT COUNT(*) istn from account where account_number = ?', [banknumber], async (error, row) => {
      console.log(row[0].istn)
      if (row[0].istn == 0) {
        console.log("BŁĄDDDD")
        return res.status(400).render('transfer', { message: 'Nie znaleziono odbiorcy.' });
      } else {
        const getRecipientQuery = 'SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id  WHERE account.account_number = ?';
        db.query(getRecipientQuery, [banknumber], async (error, recipientResult) => {
          if (error) throw error;
          console.log("ssssssssssssssssssssssssdsds")
          console.log(recipientResult);
          console.log("ssssssssssssssssssssssssdsds")
          if (!recipientResult || recipientResult === '[]') {
            console.log("BŁĄDDDD")
            return res.status(400).render('transfer', { message: 'Nie znaleziono odbiorcy.' });
          }

          const getSenderAccountQuery = 'SELECT * FROM account WHERE user_id = ?';
          db.query(getSenderAccountQuery, [senderId], async (error, senderAccountResult) => {
            if (error) throw error;

            if (senderAccountResult[0].bilans < amount) {
              return res.status(400).render('transfer', { message: 'Brak wystarczających środków na koncie.' });
            }
            console.log("sssssssssssssssssssssdddddddddddddddddddddddddddddddddd");
            console.log("")
            if (banknumber == senderAccountResult[0].account_number) {
              console.log("BŁĄDDDD")
              return res.status(400).render('transfer', { message: 'Podałeś swój Numer konta.' });
            }
            if (amount < 0) {
              console.log("BŁĄDDDD")
              return res.status(400).render('transfer', { message: 'Kwota musi być większa od zera.' });
            }

            const recipientId = recipientResult[0].id;
            const senderAccountNumber = senderAccountResult[0].account_number;
            const recipientAccountNumber = recipientResult[0].account_number;
            console.log("ssssssssssssssssssssssssssssdsds")
            console.log(recipientAccountNumber);

            db.beginTransaction(async (error) => {
              if (error) throw error;

              const updateSenderAccountQuery = 'UPDATE account SET bilans = bilans - ? WHERE user_id = ?';
              db.query(updateSenderAccountQuery, [amount, senderId], async (error) => {
                if (error) {
                  db.rollback(() => {
                    throw error;
                  });
                }

                const updateRecipientAccountQuery = 'UPDATE account SET bilans = bilans + ? WHERE user_id = ?';
                db.query(updateRecipientAccountQuery, [amount, recipientId], async (error) => {
                  if (error) {
                    db.rollback(() => {
                      throw error;
                    });
                  }

                  const addTransactionQuery = 'INSERT INTO transactions (sender_id, recipient_id, amount, sender_account_number, recipient_account_number, descrip) VALUES (?, ?, ?, ?, ?, ?)';
                  db.query(addTransactionQuery, [senderId, recipientId, amount, senderAccountNumber, recipientAccountNumber, description], async (error) => {
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

                      res.status(200).render('transfer', { message: 'Przelew wykonany pomyślnie.' });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
  
}

 function makeTransferElixir(amount, banknumber, description, senderId, res, recipientBankId) {

  try {
    const userData = {
      amount:amount,
      banknumber: banknumber,
      description:description,
      recipientBankId:recipientBankId
    };

   
    db.query('SELECT reg_request.login, reg_request.id, reg_request.firstName, reg_request.lastName,account.account_number FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.role != "admin" AND reg_request.id = ?',
      [senderId],(error,ress)=>{
        db.query('SELECT * FROM account WHERE user_id = ?',[senderId],(err,resu)=>{

       console.log(resu);
        if(banknumber==ress[0].account_number){
          console.log("podałeś swój numer");
          return res.render('transfer', { message: 'Podałeś swój numer' });
        }else if(amount>resu[0].bilans){
          return res.render('transfer', { message: 'Brak środków na koncie' });
        }else if(amount<=0){
          return res.render('transfer', { message: 'Kwota musi być większa od zera' });
        }else{

        
    
    // Wysłanie danych do drugiego serwera
   
    axios.post('http://localhost:4000/accoutexist', userData)
    .then(response => {
      console.log(response.data);


      if(response.data.exist == 1){

      console.log(senderId);
      
        //console.log(res);
        const transferData = {
          sender: ress,
          recipient: userData,
          recipientBankId: recipientBankId
        }
        const updateSenderAccountQuery = 'UPDATE account SET bilans = bilans - ? WHERE user_id = ?';
        db.query(updateSenderAccountQuery, [amount, senderId], async (error) => {
          if (error) {
            db.rollback(() => {
              throw error;
            });
          }});
          
        axios.post(`http://localhost:4000/send-transfer/bank1`, transferData)
        .then(response => {
          console.log('Przelew został wysłany do serwera KIP');
          
          return res.render('transfer', { message: 'Przelew wysłany' });
          




        })
        .catch(error => {
          console.error('Błąd wysyłania przelewu do serwera KIP:', error);
          console.log('przelll')
          if(error){
            return res.render('transfer', { message: 'Przelew wysłany' });
          }
          
          //return res.render('transfer', { message: 'Błąd.' });
        });


     
     


    }else{
      console.log("User not exist");
      return res.render('transfer', { message: 'Nie znaleziono odbiorcy.' });
    }

    })
    .catch(error => {
      console.error('Błąd komunikacji z drugim serwerem:', error);
    });
  }
});
  });

//////
  } catch (error) {
    console.error('Wystąpił błąd:', error);
  }


  
}


async function getSenderId(req, res){
  const decoded = await promisify(jwt.verify)(req.cookies.jwt,
    process.env.JWT_SECRET);
   const senderId = decoded.id;
}

function getuserdata(senderId){

  db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.role != "admin" AND reg_request.id = ?',
  [senderId],(error,res)=>{

  return res;   
  })
 
}
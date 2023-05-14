const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const crypto = require('crypto');
const express = require('express');
const axios = require('axios');


const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});



exports.transfer = async (req, res) => {

    try {
      const { amount, banknumber, description } = req.body;
      console.log(req.body);
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
        process.env.JWT_SECRET);
  
  
      const senderId = decoded.id;
  
      // Pobierz informacje o użytkowniku odbiorcy
      db.query('SELECT COUNT(*) istn from account where account_number = ?', [banknumber], async (error, row) =>{
        console.log(row[0].istn)
        if(row[0].istn == 0){
          console.log("BŁĄDDDD")
          return res.status(400).render('transfer',{ message: 'Nie znaleziono odbiorcy.' });
        }else{
  
      const getRecipientQuery = 'SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id  WHERE account.account_number = ?';
      db.query(getRecipientQuery, [banknumber], async (error, recipientResult) => {
        if (error) throw error;
        console.log("ssssssssssssssssssssssssdsds")
        console.log(recipientResult);
        console.log("ssssssssssssssssssssssssdsds")
        if (!recipientResult || recipientResult === '[]') {
          console.log("BŁĄDDDD")
          return res.status(400).render('transfer',{ message: 'Nie znaleziono odbiorcy.' });
        }
        
       
        //console.log(recipientId);
        // Sprawdź czy użytkownik ma wystarczająco środków na koncie
        const getSenderAccountQuery = 'SELECT * FROM account WHERE user_id = ?';
        db.query(getSenderAccountQuery, [senderId], async (error, senderAccountResult) => {
          if (error) throw error;
  
          if (senderAccountResult[0].bilans < amount) {
            return res.status(400).render('transfer',{ message: 'Brak wystarczających środków na koncie.' });
          }
          
          // Wykonaj przelew
          // const recipientId = recipientResult.id;
          const recipientId = recipientResult[0].id;
          const senderAccountNumber = senderAccountResult[0].account_number;
          const recipientAccountNumber = recipientResult[0].account_number;
          console.log("ssssssssssssssssssssssssssssdsds")
          console.log(recipientAccountNumber);
  
          
          db.beginTransaction(async (error) => {
            if (error) throw error;
            
            // Odejmij kwotę od konta użytkownika wysyłającego
            const updateSenderAccountQuery = 'UPDATE account SET bilans = bilans - ? WHERE user_id = ?';
            db.query(updateSenderAccountQuery, [amount, senderId], async (error) => {
              if (error) {
                db.rollback(() => {
                  throw error;
                });
              }
              
              // Dodaj kwotę do konta użytkownika odbierającego
              const updateRecipientAccountQuery = 'UPDATE account SET bilans = bilans + ? WHERE user_id = ?';
              db.query(updateRecipientAccountQuery, [amount, recipientId], async (error) => {
                if (error) {
                  db.rollback(() => {
                    throw error;
                  });
                }
                
                // Zapisz transakcję w tabeli transactions
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
                    
                    res.status(200).render('transfer',{ message: 'Przelew wykonany pomyślnie.' });
                  });
                });
              });
            });
          });
        });
      
      });
    }});
    } catch (error) {
     // await db.rollback();
      console.log(error);
      res.status(500).render('transfer',{ message: 'Wystąpił błąd podczas wykonywania przelewu.' });
    }
  };



exports.transfer2 = async (req, res) => {

const dataToSend = {
    name: 'John Doe',
    age: 30,
    email: 'johndoe@example.com'
  };

  axios.post('http://localhost:5002/receive', dataToSend)
    .then(response => {
      console.log('Dane zostały wysłane pomyślnie');
      // Obsłuż odpowiedź serwera
      res.send('Dane zostały wysłane pomyślnie');
    })
    .catch(error => {
      console.error('Wystąpił błąd podczas wysyłania danych:', error);
      // Obsłuż błąd
      res.status(500).send('Wystąpił błąd podczas wysyłania danych');
    });



    console.log("TESS");




  };
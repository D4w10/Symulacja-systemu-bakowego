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
      const { amount, banknumber, description, przelew } = req.body;

      console.log("------------------+++++++++++++++++++++++_____________________________");
      console.log(req.body);
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
        process.env.JWT_SECRET);
  
        console.log("-------------------");
        console.log(przelew);
        console.log(decoded);
      const senderId = decoded.id;



        if(przelew == 'wew'){

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
          console.log("sssssssssssssssssssssdddddddddddddddddddddddddddddddddd");
          console.log("")
         if(banknumber==senderAccountResult[0].account_number){
            console.log("BŁĄDDDD")
            return res.status(400).render('transfer',{ message: 'Podałeś swój Numer konta.' });
  
        }
          if(amount<0){
            console.log("BŁĄDDDD")
            return res.status(400).render('transfer',{ message: 'Kwota musi być wieksz od zera' });
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
  }


      if(przelew == 'elixir' ){
        console.log("elixir");

      }

      
      if(przelew == 'sorbnet' ){
        console.log("sorbnet");

        const getSenderAccountQuery = 'SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.id = ?'; 
        
        const receiverBank = banknumber.slice(0,4);



        db.query(getSenderAccountQuery, [senderId], async (error, senderAccountResult2) => {// Pobranie danych użytkowniaka


          const senderBalance = senderAccountResult2[0].bilans; //bilans konta uzytkownika wysyłającego
          const datatosend = {
            senderBank: "7777",
            senderNumber: senderAccountResult2[0].account_number,
            receiverBank,
            receiverNumber: banknumber,
            description,
            amount,

        }
          if (senderBalance >= amount){    //Sprawdzenie czy uzytkownik ma wystarczająco pieniedzy

            const newSenderBalance = senderBalance - amount; //zmienna przetrzymujaca nowa kwote
            
            db.query('UPDATE account SET bilans = ? WHERE user_id = ?', [newSenderBalance,senderId],(error,result)=>{ //ustawienie nowej kwoty w bazie danych
              if (error) {
                console.error(error);
                res.json({ success: false, message: 'An error occurred during bank A transfer.' });
                return;
              }

              axios.post('http://localhost:5002/sorb',datatosend)  //Wysyłanie danych do serwera KIP
              .then(response =>{
                if (response.data.success){
                  res.json({success:true});
                }else{

                  db.query('UPDATE account SET bilans = ? WHERE user_id = ?', [senderBalance,senderId],(error,result)=>{ //przywrucenie stanu konta przed przelewem jeśli wystąpi bład
                    if (error) {
                      console.error(error);
                    }
                  });

                  res.json({ success: false, message: 'Błąd przelwu, pieniadze zwrócone' });

                }
                axios.get('http://localhost:5002/sorb')
                .then(response => {
                  console.log(response.data);
                })
                .catch(error => {
                  console.error(error);
                });


              })
              .catch(error => {
                console.error(error);
                res.json({ success: false, message: 'Błąd podczas przelewu.' });
              });

              
  
            });

          }else{
            res.render({ success: false, message: 'Brak środków na koncie' });
          }


      
         
        })
      
        
      
      
      
      
      
      
      





      }



    } catch (error) {
     // await db.rollback();
      console.log(error);
      res.status(500).render('transfer',{ message: 'Wystąpił błąd podczas wykonywania przelewu.' });
    }
  };



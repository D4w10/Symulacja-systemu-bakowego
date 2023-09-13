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

exports.datachange = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.id = ?', [decoded.id], async (error, resultuse) => {
      // Sprawdzenie, czy nowe hasło i powtórzone hasło są identyczne
      if (newPassword !== confirmPassword) {
        res.render('konto', {
          message: "Hasła się nie zgadzają",
          user: resultuse[0]
        });
        return;
      }

      const userId = decoded.id; // ID zalogowanego użytkownika - przykładowe wartości

      // Pobranie hasła z bazy danych
      const getPasswordQuery = 'SELECT password FROM reg_request WHERE id = ?';
      db.query(getPasswordQuery, [userId], async (err, results) => {
        if (err) {
          console.error('Błąd podczas pobierania hasła: ' + err.stack);
          return;
        }

        // Sprawdzenie poprawności aktualnego hasła
        const hashedPassword = results[0].password;
        const isPasswordMatch = await bcrypt.compare(currentPassword, hashedPassword);
        if (!isPasswordMatch) {
          res.render('konto', {
            message: "Błędne hasło",
            user: resultuse[0]
          });
          return;
        }

        // Zaszyfrowanie nowego hasła
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Aktualizacja hasła w bazie danych
        const updatePasswordQuery = 'UPDATE reg_request SET password = ? WHERE id = ?';
        db.query(updatePasswordQuery, [hashedNewPassword, userId], (err, result) => {
          if (err) {
            console.error('Błąd podczas aktualizacji hasła: ' + err.stack);
            return;
          }

          console.log('Hasło zostało zmienione');

          res.render('konto', {
            message2: "Hasło zostało zmienione",
            user: resultuse[0]
          });
        });
      });
    });

  } catch (error) {
    console.log(error);
  }
};

exports.datachangemail = async (req, res) => {
  try {
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    const newEmail = req.body.newEmail;
    const confirmEmail = req.body.comfirmEmail;
    db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.id = ?', [decoded.id], async (error, resultuse) => {
    if (newEmail !== confirmEmail) {
      res.render('konto', {
        message: "Adresy email nie zgadzają się",
        user: resultuse[0]
      });
      return;
    }

    db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.id = ?', [decoded.id], async (error, resultuse) => {
      // Aktualizacja adresu email w bazie danych
      const updateEmailQuery = 'UPDATE reg_request SET email = ? WHERE id = ?';
      db.query(updateEmailQuery, [newEmail, decoded.id], (err, result) => {
        if (err) {
          console.error('Błąd podczas aktualizacji emaila: ' + err.stack);
          return;
        }

        console.log('Email został zmieniony');
        db.query('SELECT * FROM reg_request INNER JOIN account ON reg_request.id = account.user_id WHERE reg_request.id = ?', [decoded.id], async (error, resultuse) => {

        res.render('konto', {
          message2: "Adres email został zmieniony",
          user: resultuse[0]
         });
        })

      });
    });
  })
  } catch (error) {
    console.log(error);
  }
};

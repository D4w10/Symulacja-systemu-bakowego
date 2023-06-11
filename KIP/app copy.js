const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const cron = require('node-cron');



const port = 4000;

app.use(bodyParser.json());
// Konfiguracja połączenia z bazą danych MySQL
const dbB = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'kip',
};

// Tworzenie połączenia z bazą danych
const db = mysql.createConnection(dbB);


const transferData = {};




const sendFilesSchedule = '0 10 * * *';


cron.schedule(sendFilesSchedule, () => {
  console.log('Harmonogram wysyłki plików JSON');
//  sendFilesToBanks();
});





// function sendFilesToBanks() {
//   const bankIds = Object.keys(transferData);
//   console.log(bankIds);


  
//   bankIds.forEach(bankId => {
//     console.log(bankId);
//     const recipientFilePath = `transfer_${bankId}.json`;

//     // Sprawdź, czy plik istnieje
//     if (fs.existsSync(recipientFilePath)) {
//       // Odczytaj dane z pliku JSON banku odbiorcy
//       const recipientData = fs.readFileSync(recipientFilePath, 'utf8');
//       const transferArray = JSON.parse(recipientData);

//       if (transferArray && transferArray.length > 0) {
//         // Wyślij plik JSON do banku odbiorcy
//         axios.post(`http://localhost:${bankId}/receive_file`, transferArray)
//           .then(response => {
//             console.log(`Plik JSON został wysłany do banku odbiorcy (${bankId})`);
//             // Usuń plik po wysłaniu
//             fs.unlinkSync(recipientFilePath);
//           })
//           .catch(error => {
//             console.error(`Błąd wysyłania pliku JSON do banku odbiorcy (${bankId}):`, error);
//           });
//       } else {
//         console.log(`Brak danych do wysłania dla banku ${bankId}`);
//       }
//     } else {
//       console.log(`Plik JSON dla banku ${bankId} nie istnieje`);
//     }
//   });
// }




app.get('/', (req, res) => {
  res.render('index');
});

app.set('view engine', 'ejs');
app.set('views', './views');








app.post('/send-files-now', (req, res) => {
  console.log('Natychmiastowa wysyłka plików JSON');
  sendFilesToBanks();
  res.sendStatus(200);
});



app.post('/send-transfer/:bankId', (req, res) => {

  const bankId = req.params.bankId;
  const transfer = req.body;
  
 

  const recipientFilePath = `transfer_${transfer.recipientBankId}.json`;

  if (!fs.existsSync(recipientFilePath)) {
    // Jeśli plik nie istnieje, utwórz nowy
    fs.writeFileSync(recipientFilePath, '[]');
  }
  const recipientData = fs.readFileSync(recipientFilePath, 'utf8');
  const recipientTransferData = JSON.parse(recipientData);
  recipientTransferData.push(transfer);
  fs.writeFileSync(recipientFilePath, JSON.stringify(recipientTransferData));

  // Dodaj dane przelewu do pamięci KIP
  if (!transferData[bankId]) {
    transferData[bankId] = [];
  }
  transferData[bankId].push(transfer);

console.log(transfer);



console.log('oooooooooooooooooooooooooooooooooooooooooooooo');
console.log(transferData);


});









app.post('/accountNumber',(req, res) => {

  const receivedData = req.body;
  const banknumber = req.body.accountNumber;
  console.log('Odebrane dane:', receivedData);
  console.log(banknumber);
  var prefix = banknumber.substring(0,4);
  console.log(prefix);
  db.query('INSERT INTO kipdata (account_number, bankprefix) VALUES (?,?)',[banknumber,prefix]);





});

app.post('/accoutexist',(req,res)=>{

const accountNumber = req.body.banknumber;

const query = 'SELECT * FROM kipdata WHERE account_number = ?';
db.query(query, [accountNumber], (error, results) => {
  if (error) {
    console.error('Błąd wykonania zapytania:', error);
    res.status(500).send('Błąd serwera');
    return;
  }

  if (results.length > 0) {
    const response = {
      mes:'Użytkownik istnieje',
      exist: 1
    }
    res.send(response);
  } else {
    const response = {
      mes:'Użytkownik nieistnieje',
      exist: 0
    }
    res.send(response);
  }
});

})








// Nasłuchiwanie na żądania na porcie 4000
app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
});

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












app.get('/', (req, res) => {
  res.render('index');
});

app.set('view engine', 'ejs');
app.set('views', './views');



async function sendFiles(immediate = false) {
  const currentHour = new Date().getHours();

  
  if (immediate || currentHour === 9 || currentHour == 10 || currentHour == 16) {
    const files = ['transfer_7777.json', 'transfer_7778.json'];

  
    for (const file of files) {
      const serverURL = file.includes('7777') ? 'http://localhost:7777/receive-file' : 'http://localhost:7778/receive-file';

      try {
        const fileData = await readFile(file);

       console.log(`Plik ${file} został wysłany.`);
       await deleteFile(file);
        await axios.post(serverURL, fileData, {
          headers: { 'Content-Type': 'application/json' }
          
        });

        
        
      } catch (error) {
        console.error(`Błąd podczas wysyłania pliku ${file}:`, error.message);
      }
    }
  }
}

// Funkcja do odczytu zawartości
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function deleteFile(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

app.get('/send-files', (req, res) => {
  sendFiles(true);
  res.render('',{message:"Pliki zostały wysłane o ile istnieja"});
});


cron.schedule('0 * * * *', () => {
  sendFiles();
  console.log('Start');
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

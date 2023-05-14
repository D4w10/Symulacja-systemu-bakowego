const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/receive', (req, res) => {
  // Odbierz dane przesłane z innego serwera
  const receivedData = req.body;
  
  // Wyświetl odebrane dane w konsoli
  console.log('Odebrane dane:', receivedData);
  
  // Wyślij odpowiedź do serwera, który wysłał dane
  res.json({ message: 'Dane zostały odebrane pomyślnie' });
});

app.listen(5002, () => {
  console.log('Serwer nasłuchuje na porcie 5002');
});
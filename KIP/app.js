const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());


// senderBank: "7777",
//             senderNumber: senderAccountResult2[0].account_number,
//  
//             banknumber,
//             description,
//             amount,

app.post('/sorb', async (req, res) => {
  const { senderBank, senderNumber, receiverBank, receiverNumber, description , amount } = req.body;

  try {
    console.log(req.body);
    console.log(senderBank);
   const test =  axios.post(`http://localhost:${senderBank}/transfer`, {mes: "sorb"})
  .then(response => {
    console.log('Serwer istnieje. Kod statusu:', response.status);
  })
  .catch(error => {
    console.error('Serwer nie istnieje lub wystąpił błąd:', error.message);
  });
 
  console.log("sssssssssssssssssssssssssssssssssss")
  console.log(test.data);

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'bład podczas transferu' });
  }
});


app.listen(5002, () => {
  console.log('Port 5002');
});
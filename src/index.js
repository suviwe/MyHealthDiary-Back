// index.js
import express from 'express';



const hostname = 'localhost';
const app = express();
const port = 3000;

//staattinen html sivusto tarjoillaan palvelimen juuressa
app.use('/', express.static('public'));






app.get('/', (req, res) => {
  res.send('OMA BACKEND, Welcome to my REST API!');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

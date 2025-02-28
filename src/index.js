// index.js
import express from 'express';



const hostname = 'localhost';
const app = express();
const port = 3000;

//staattinen html sivusto tarjoillaan palvelimen juuressa
app.use('/', express.static('public'));

// middleware, joka lukee json datan post pyyntöjen rungostasta
app.use(express.json());





// REST-APIn resurssit tarjoillaan /api/-polun alla
app.get('/api/', (req, res) => {
  console.log('get pyyntö apin juureen lähetetty');
  console.log(req.url);
  res.send('OMA BACKEND, Welcome to my REST API!');
});





app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

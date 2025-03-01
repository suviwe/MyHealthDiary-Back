// index.js
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user-router.js';
import diaryRouter from './routes/diary-router.js';

import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';



const hostname = 'localhost';
const app = express();
const port = 3000;

//staattinen html sivusto tarjoillaan palvelimen juuressa
app.use('/', express.static('public'));
app.use(cors());

// middleware, joka lukee json datan post pyyntöjen rungostasta
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/diary', diaryRouter);





// REST-APIn resurssit tarjoillaan /api/-polun alla
app.get('/api/', (req, res) => {
  console.log('get pyyntö apin juureen lähetetty');
  console.log(req.url);
  res.send('OMA BACKEND, Welcome to my REST API!');
});



app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

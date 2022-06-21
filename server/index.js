import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import userRouters from './routes/users.js';
dotenv.config();

connectDb()

const app = express();

app.use(express.json());

app.use('/users', userRouters);

app.get('/', (req, res) => {
    res.send('Api is running...');
  });

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(
    `Application is running in ${process.env.NODE_ENV} mode at ${port} port.`
  );
});

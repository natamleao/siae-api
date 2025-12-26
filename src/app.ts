import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando`);
});
import express, { Request, Response } from 'express'
import authRoutes from './routes/authRoutes';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json()); 

app.use('/api/v1/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando`);
});
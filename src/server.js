import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Rotas
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js'

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
	return res.send('<h1>Rodando o servidor</h1>');
});

server.use(userRoutes);
server.use(postRoutes)

server.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});

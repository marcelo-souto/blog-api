import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
dotenv.config();

// Rotas
import userRoutes from './routes/userRoutes.js';

const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());
server.use(cors());
server.use(fileUpload({ useTempFiles: true, tempFileDir: './tmp' }));

server.get('/', (req, res) => {
	return res.send('<h1>Rodando o servidor</h1>');
});
server.use(userRoutes);

server.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});

import userController from '../controllers/userController.js';
import { Router } from 'express';
import dotenv from 'dotenv';
import { unlink } from 'fs/promises';
import sharp from 'sharp';
import axios from 'axios';
import { readFileSync } from 'fs';
import uploadFile from '../middlewares/upload.js';
dotenv.config();

const router = Router();

router.get('/user', userController.getAll);
router.get('/user/:userId', userController.getById);
router.post('/user/create', userController.create);
router.get('/user/verifyemail/:token', userController.verifyEmail)

router.post('/user/upload', uploadFile, async (req, res) => {

	const file = req.file

	try {

		await sharp(file.path)
			.resize(null, 500, {
				fit: sharp.fit.cover,
				position: 'right'
			})
			.toFormat('jpeg')
			.toFile(`/tmp/${file.filename}.jpeg`);

		await unlink(file.path);

		const image = readFileSync(`/tmp/${file.filename}.jpeg`);

		const options = {
			method: 'POST',
			url: 'https://api.imgur.com/3/image',
			headers: {
				'Content-Type': 'image/jpeg',
				Authorization: 'Client-ID ' + process.env.CLIENT_ID
			},
			data: image
		};

		const { data } = await axios(options);

		return res
			.status(200)
			.json({ mensagem: 'Imagem enviada com sucesso.', info: data.data });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

// router.post('/user/upload', async (req, res) => {
// 	const file = req.files.upload;

// 	try {
// 		const path = `/tmp/${file.name}`;

// 		await sharp(file.tempFilePath)
// 			.resize(null, 500, {
// 				fit: sharp.fit.cover,
// 				position: 'right'
// 			})
// 			.toFormat('jpeg')
// 			.toFile(path);

// 		await unlink(file.tempFilePath);

// 		const image = readFileSync(path);

// 		const options = {
// 			method: 'POST',
// 			url: 'https://api.imgur.com/3/image',
// 			headers: {
// 				'Content-Type': 'image/jpeg',
// 				Authorization: 'Client-ID ' + process.env.CLIENT_ID
// 			},
// 			data: image
// 		};

// 		const { data } = await axios(options);

// 		return res
// 			.status(200)
// 			.json({ mensagem: 'Imagem enviada com sucesso.', link: data.data.link });
// 	} catch (error) {
// 		return res.status(400).json({ error: error.message });
// 	}
// });

export default router;

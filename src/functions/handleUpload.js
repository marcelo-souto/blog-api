import sharp from 'sharp';
import axios from 'axios';
import { unlink, readFile } from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

export const treatImage = async (path) => {
	try {
		const fileName = Date.now();
		const filePath = '/tmp/' + fileName + '.jpeg';

		await sharp(path)
			.resize(null, 500, { fit: sharp.fit.cover, position: 'right' })
			.toFormat('jpeg')
			.toFile(filePath);

		return filePath;
	} catch (error) {
		throw new Error(error);
	}
};

export const uploadImage = async (file) => {
	try {
		// Trata arquivo e retorna seu caminho
		const filePath = await treatImage(file.path);

		// Exclui arquivo inciail
		await unlink(file.path);

		// Ler o arquivo tratado
		const image = await readFile(filePath);

		const options = {
			method: 'POST',
			url: 'https://api.imgur.com/3/image',
			headers: {
				'Content-Type': 'image/jpeg',
				Authorization: 'Client-ID ' + process.env.CLIENT_ID
			},
			data: image
		};

		// Faz Upload do arquivo
		const { data } = await axios(options);

		return {
			url: data.data.link,
			hash: data.data.deletehash,
			id: data.data.id
		};
	} catch (error) {
		return error.message;
	}
};

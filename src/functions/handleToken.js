import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createToken = (payload) => {
	const token = jwt.sign(payload, process.env.SECRET_KEY, {
		expiresIn: '1d'
	});
	return token;
};

export const verifyToken = (token) => {
	try {
		const result = jwt.verify(token, process.env.SECRET_KEY);
		return result;
	} catch (error) {
		throw Error('Token Inválido.')
	}
};

export const checkToken = () => {};

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const types = {
	emailToken: process.env.SECRET_EMAIL_TOKEN,
	refreshToken: process.env.SECRET_REFRESH_TOKEN,
	accessToken: process.env.SECRET_ACCESS_TOKEN
};

export const createToken = (payload, expiration, type) => {
	const secret = types[type];
	const token = jwt.sign(payload, secret, {
		expiresIn: expiration
	});
	return token;
};

export const verifyToken = (token, type) => {
	const secret = types[type];
	try {
		const result = jwt.verify(token, secret);
		return result;
	} catch (error) {
		throw Error('Token Inválido.')
	}
};

export const checkToken = () => {};

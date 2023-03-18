import { verifyToken } from '../functions/handleToken.js';
import sendResponse from '../config/server/sendResponse.js';
import dotenv from 'dotenv';
dotenv.config();

const checkToken = async (req, res, next) => {
	const header = req.headers['authorization'];
	const token = header && header.split(' ')[1];

	if (!token) return sendResponse(res, 401, 'Token inválido.');

	try {
		const { userId, role } = verifyToken(token, 'accessToken');
		if (userId) req.body.userId = userId;
		if(role) req.body.role = role;
		
		next();
    
	} catch (error) {
		return sendResponse(res, 401, 'Token inválido.');
	}
};

export default checkToken;

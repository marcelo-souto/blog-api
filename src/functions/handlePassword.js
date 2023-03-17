import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export const encryptPassword = async (password) => {
	const salt = process.env.SALT;
	const hashedPassword = await bcrypt.hash(password, +salt);

	return hashedPassword;
};

export const checkPassword = async (password, userPassword) => {
	const match = await bcrypt.compare(password, userPassword);

	if (match) return true;
	else return false;
};

import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const config = {
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD
	},
	tls: {
		rejectUnauthorized: false
	}
};

const transporter = createTransport(config);

export default transporter;

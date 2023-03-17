import transporter from './transporter.js';
import models from './models.js';
import dotenv from 'dotenv';
dotenv.config();

class Email {
	constructor(
		from = `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
		to = '',
		subject = '',
		html = ''
	) {
		this.from = from;
		this.to = to;
		this.subject = subject;
		this.html = html;
	}
	createModel(type, info) {
		if (!models[type]) throw new Error('Este modelo de email não existe.');

		const model = models[type](info);
		this.html = model.html;
		this.subject = model.subject;
		return { from: this.from, html: this.html, subject: this.subject };
	}
	async sendTo(address, model) {
		this.to = address;
		
		try {
			if (!this.to) throw Error();
			
			const email = model ? model : this;

			await transporter.sendMail(email);
			return true;
		} catch (error) {
			throw new Error('Houve um erro durante o envio de email.');
		}
	}
}

export default Email;

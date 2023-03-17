import User from '../models/User.js';
import { Op } from 'sequelize';
import validate from '../functions/validate.js';
import { encryptPassword } from '../functions/handlePassword.js';
import Email from '../config/email/Email.js';
import { createToken, verifyToken } from '../functions/handleToken.js';
import Token from '../models/Token.js';

const userController = {
	getAll: async (req, res) => {
		try {
			const users = await User.findAll();
			return res.status(200).json(users);
		} catch (error) {
			return res.status(400).json({ erro: error.message });
		}
	},
	getById: async (req, res) => {
		const { userId } = req.params;
		try {
			const user = await User.findByPk(userId);
			return res.status(200).json(user);
		} catch (error) {
			return res.status(400).json({ erro: error.message });
		}
	},
	create: async (req, res) => {
		const { name, email, password } = req.body;

		try {
			// Validar valores recebidos
			validate({ email, type: 'email', isRequired: true });
			validate({ nome: name, isRequired: true });
			validate({ senha: password, type: 'password', isRequired: true });

			// Checando se email existe no banco
			const userAlreadyExists = await User.findOne({
				where: { email: `${email}` }
			});

			if (userAlreadyExists)
				return res.status(400).json({ erro: 'Usuário já cadastrado.' });

			// Criptografar senha
			const passwordHash = await encryptPassword(password);

			// Criacao do Usuario
			const user = await User.create({
				name,
				email,
				password: passwordHash
			});

			// Criar token de email
			const token = createToken({ userId: user.userId });

			// Armazenar token de email
			await Token.create({
				userId: user.userId,
				token
			});

			// Criar e enviar email de verificacao
			const verificationEmail = new Email();
			verificationEmail.createModel('verificationEmail', {
				user: user.name,
				token
			});

			await verificationEmail.sendTo(user.email);

			return res.status(201).json(user);
		} catch (error) {
			return res.status(400).json({ erro: error.message });
		}
	},
	verifyEmail: async (req, res) => {
		const { token } = req.params;
		try {
			const { userId } = verifyToken(token);

			const user = await User.findByPk(userId);
			if (!user)
				return res.status(404).json({ message: 'Usuário não encontrado.' });

			const tokenExists = await Token.findOne({
				where: {
					[Op.and]: [{ userId: userId }, { token: token }]
				}
			});

			if (tokenExists) await tokenExists.destroy();

			if (!user.verifiedEmail) {
				await user.update({ verifiedEmail: true });
				return res
					.status(200)
					.json({ message: 'Email verificado com sucesso.' });

			} else {
				return res.status(200).json({ message: 'Email já verificado.' });
			}

		} catch (error) {
			return res.status(400).json({ erro: error.message });
		}
	}
};

export default userController;

import User from '../models/User.js';
import { Op } from 'sequelize';
import validate from '../functions/validate.js';
import { encryptPassword, checkPassword } from '../functions/handlePassword.js';
import Email from '../config/email/Email.js';
import { createToken, verifyToken } from '../functions/handleToken.js';
import Token from '../models/Token.js';
import sendResponse from '../config/server/sendResponse.js';
import { uploadImage } from '../functions/handleUpload.js';

const userController = {
	getAll: async (req, res) => {
		try {
			const users = await User.findAll({ attributes: { exclude: 'password' } });
			return sendResponse(res, 200, null, users);
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	getById: async (req, res) => {
		const { userId } = req.params;
		try {
			const user = await User.findByPk(userId, {
				attributes: { exclude: 'password' }
			});

			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			return sendResponse(res, 200, null, user);
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	logout: async (req, res) => {
		const { userId } = req.params;

		try {
			const user = await User.findByPk(userId)
			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			await user.update({
				refreshToken: null
			})

			return sendResponse(res, 200, 'Usuário desconectado com sucesso.');
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	login: async (req, res) => {
		const { email, password } = req.body;

		try {
			validate({ email, isRequired: true });
			validate({ senha: password, isRequired: true });

			const user = await User.findOne({ where: { email: `${email}` } });
			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			const result = await checkPassword(password, user.password);
			if (!result) return sendResponse(res, 401);

			const refreshToken = createToken({}, '7d');

			await user.update({
				refreshToken
			});

			const accessToken = createToken(
				{ userId: user.userId, role: user.role },
				'1d'
			);

			return sendResponse(res, 200, null, { refreshToken, accessToken });
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	create: async (req, res) => {
		const { name, email, password, role } = req.body;

		try {
			// Validar valores recebidos
			validate({ email, type: 'email', isRequired: true });
			validate({ nome: name, isRequired: true });
			validate({ senha: password, type: 'password', isRequired: true });
			validate({ role, type: 'role', isRequired: true });

			// Checando se email existe no banco
			const userAlreadyExists = await User.findOne({
				where: { email: `${email}` }
			});

			if (userAlreadyExists)
				return sendResponse(res, 400, 'Usuário já cadastrado.');

			// Criptografar senha
			const passwordHash = await encryptPassword(password);

			// Criacao do Usuario
			const user = await User.create({
				name,
				email,
				role: role,
				password: passwordHash
			});

			// Criar token de email
			const token = createToken({ userId: user.userId }, '1d');

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

			return sendResponse(res, 201, 'Usuário criado com sucesso.');
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	update: async (req, res) => {
		const { email, name, userId } = req.body;

		try {
			let avatar;
			if (req.file) avatar = await uploadImage(req.file);

			if (!name && !email && !req.file)
				return sendResponse(res, 400, 'Não foram enviadas informações.');

			validate({ email, type: 'email' });
			validate({ nome: name });

			const user = await User.findByPk(userId);
			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			if (user.email === email || user.name === name)
				return sendResponse(
					res,
					400,
					'Novas informações devem ser diferentes das anteriores.'
				);

			const emailAlreadyExists = await User.findOne({
				where: { email: `${email}` }
			});

			if (emailAlreadyExists)
				return sendResponse(res, 400, 'Email já cadastrado.');

			await user.update({
				name: name ? name : user.name,
				email: email ? email : user.email,
				avatar: avatar ? avatar : user.avatar
			});

			return sendResponse(res, 200, 'Informações atualizadas com sucesso.');
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	delete: async (req, res) => {
		const { userId } = req.body;

		try {
			const user = await User.findByPk(userId);
			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			await user.destroy();

			return sendResponse(res, 200, 'Usuário excluído com sucesso.');
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	changePassword: async (req, res) => {
		const { password, newPassword, confirmPassword, userId } = req.body;

		try {
			validate({ senha: newPassword, type: 'password', isRequired: true });

			const user = await User.findByPk(userId);
			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			const result = await checkPassword(password, user.password);
			if (!result) return sendResponse(res, 401, 'Senha incorreta.');

			const isTheSamePassword = await checkPassword(newPassword, user.password);
			if (isTheSamePassword)
				return sendResponse(
					res,
					400,
					'Sua nova senha deve ser diferente da atual.'
				);

			if (newPassword !== confirmPassword)
				return sendResponse(
					res,
					400,
					'Senha e confirmação de senha devem ser iguais.'
				);

			const passwordHash = await encryptPassword(newPassword);

			await user.update({
				password: passwordHash
			});

			return sendResponse(res, 200, 'Senha atualizada com sucesso.');
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	verifyEmail: async (req, res) => {
		const { token } = req.params;
		try {
			const { userId } = verifyToken(token);

			const user = await User.findByPk(userId);
			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			const tokenExists = await Token.findOne({
				where: {
					[Op.and]: [{ userId: userId }, { token: token }]
				}
			});

			if (tokenExists) await tokenExists.destroy();

			if (!user.verifiedEmail) {
				await user.update({ verifiedEmail: true });
				return sendResponse(res, 200, 'Email verificado com sucesso.');
			}

			return sendResponse(res, 400, 'Email já verificado.');
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	}
};

export default userController;

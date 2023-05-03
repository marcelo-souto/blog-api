// Funcoes de Apoio
import sendResponse from '../config/server/sendResponse.js';
import validate from '../functions/validate.js';

// Modelos
import Category from '../models/Category.js';
import User from '../models/User.js';

const categoryController = {
	getAll: async (req, res) => {
		try {
			const categories = await Category.findAll();
			return sendResponse(res, 200, null, categories);
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	getById: async (req, res) => {
		const { categoryId } = req.params;

		try {
			const category = await Category.findByPk(categoryId);
			if (!category) return sendResponse(res, 404, 'Categoria não encontrada.');

			return sendResponse(res, 200, null, category);
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	create: async (req, res) => {
		const { userId, name } = req.body;

		try {
			const user = await User.findByPk(userId);
			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			const categoryAlreadyExist = await Category.findOne({
				where: { name: `${name}` }
			});

			if (categoryAlreadyExist) 
				return sendResponse(res, 400, 'Categoria já cadastrada.');

			validate({ nome: name, isRequired: true });

			const newCategory = await Category.create({
				name: name,
				userId: userId
			});

			return sendResponse(res, 201, null, newCategory);
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	update: async (req, res) => {
  },
	delete: async (req, res) => {}
};

export default categoryController;

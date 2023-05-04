// Funcoes de apoio
import sendResponse from '../config/server/sendResponse.js';
import createSlug from '../functions/handleSlug.js';
import validate from '../functions/validate.js';

// Modelos
import Post from '../models/Post.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import CategoryPost from '../models/CategoryPost.js';
import Like from '../models/Like.js';
import { verifyToken } from '../functions/handleToken.js';

const postController = {
	getAll: async (req, res) => {

		const { _limit, _page, _user } = Object.entries(req.query).reduce((prev, curr) => ({...prev, [curr[0]]: +curr[1] }), {});

		try {
			// Pegar posts
			const posts = await Post.scope(['user', 'likes', 'categories']).findAll({
				limit: _limit || 4,
				offset: ((_limit * _page) - _limit),
        where: _user && { userId: _user }
			});

			const header = req.headers['authorization'];
			const token = header && header.split(' ')[1];
			const userId = token && verifyToken(token, 'accessToken').userId;

			// Tratar quantidade de likes e like do usuario
			const postsWithTotalLikes = posts.map((item) => {
				const postInfo = item.toJSON();
				const isLiked =
					userId &&
					postInfo.likes.findIndex((like) => like.userId === userId) > -1;
				const post = {
					...postInfo,
					totalLikes: postInfo.likes.length,
					isLiked
				};

				delete post.likes;
				return post;
			});

			return sendResponse(res, 200, null, postsWithTotalLikes);
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	getBySlug: async (req, res) => {
		const { slug } = req.params;

		try {
			// Pegar post conforme slug passado
			const post = await Post.scope(['user', 'categories', 'likes']).findOne({
				where: { slug: `${slug}` }
			});

			// Se o post nao existir
			if (!post) return sendResponse(res, 404, 'Post não encontrado.');

			// Artualizando as visualizações
			post.increment('views', { by: 1 });

			// Total de likes do post
			const totalLikes = post.likes.length;

			return sendResponse(res, 200, null, { ...post.toJSON(), totalLikes });
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	create: async (req, res) => {
		const { userId, title, content, categories } = req.body;

		try {
			// Confirmando se o usuario existe
			const user = await User.findByPk(userId);
			if (!user) return sendResponse(res, 404, 'Usuário não encontrado.');

			// Checando se foi passado alguma categoria
			if (categories.length < 1)
				return sendResponse(
					res,
					400,
					'Você tem que escolher pelo menos 1 categoria.'
				);

			// Validando valores
			validate({ titulo: title, isRequired: true });
			validate({ conteudo: content, isRequired: true });

			// Procurando e checando se as categorias existem
			const categoriesExist = await Category.findAll({
				where: { categoryId: categories }
			});

			if (categoriesExist.length < 1)
				return sendResponse(
					res,
					404,
					'Oops... Categoria(s) não encontrada(s).'
				);

			// Criando o slug do post
			const slug = createSlug(title);

			// Criando o post
			const post = await Post.create({
				userId,
				title,
				slug,
				content
			});

			// Adicionando as categorias
			post.addCategories(categoriesExist);

			return sendResponse(res, 201, null, post);
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	update: async (req, res) => {},
	delete: async (req, res) => {}
};

export default postController;

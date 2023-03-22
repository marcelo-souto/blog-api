import Post from '../models/Post.js';
import sendResponse from '../config/server/sendResponse.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import CategoryPost from '../models/CategoryPost.js';
import Like from '../models/Like.js';

const postController = {
	getAll: async (req, res) => {
		try {
			const posts = await Post.findAll({
				include: [
					{
						model: User,
						attributes: ['name', 'userId']
					},
					{
						model: Category,
						attributes: ['name', 'categoryId']
					}
				]
			});

			return sendResponse(res, 200, null, posts);
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	},
	getById: async (req, res) => {
		const { postId } = req.params;
		try {
			const likes = await Like.count({ where: { postId: postId } });
			const post = await Post.findByPk(postId, {
				include: [
					{
						model: User,
						attributes: ['name', 'userId']
					},
					{
						model: Category,
						through: CategoryPost,
						attributes: ['name', 'categoryId']
					}
				]
			});

			if (!post) return sendResponse(res, 404, 'Post não encontrado');

			post.increment('views', { by: 1 });

			return sendResponse(res, 200, null, { ...post.toJSON(), likes });
		} catch (error) {
			return sendResponse(res, 400, error.message);
		}
	}
};

export default postController;

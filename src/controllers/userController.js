import User from '../models/User.js';

const userController = {
	getAll: async (req, res) => {
		try {
			const users = await User.findAll();
			return res.status(200).json(users);
		} catch (error) {
			return res.status(400).json({ erro: error.message });
		}
	},
	create: async (req, res) => {
		const { name, email, password } = req.body;

		try {
			const user = await User.create({
				name,
				email,
				password
			});

			return res.status(201).json(user);
		} catch (error) {
			return res.status(400).json({ erro: error.message });
		}
	}
};

export default userController;

import sequelize from '../config/database/dbconfig.js';
import { DataTypes } from 'sequelize';
import Category from './Category.js';
import Post from './Post.js';

const CategoryPost = sequelize.define(
	'CategoryPost',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		}
	},
	{ timestamps: false }
);

Category.belongsToMany(Post, { through: CategoryPost, constraints: false });
Post.belongsToMany(Category, { through: CategoryPost, constraints: false });

// CategoryPost.sync({force: true})

export default CategoryPost;

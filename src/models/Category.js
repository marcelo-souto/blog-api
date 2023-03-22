import sequelize from '../config/database/dbconfig.js';
import { DataTypes } from 'sequelize';
import User from './User.js';

const Category = sequelize.define(
	'categories',
	{
		categoryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{ timestamps: false }
);

// Relacionamentos

User.hasMany(Category, { foreignKey: 'userId' });
Category.hasOne(User, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });

export default Category;

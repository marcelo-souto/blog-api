import sequelize from '../database/dbconfig.js';
import { DataTypes, Deferrable } from 'sequelize';

const User = sequelize.define(
	'users',
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{ timestamps: false }
);


export default User
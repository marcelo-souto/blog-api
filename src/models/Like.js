import sequelize from '../config/database/dbconfig.js';
import { DataTypes } from 'sequelize';
import Post from './Post.js';
import User from './User.js';

const Like = sequelize.define(
	'likes',
	{
		likeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		postId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{ timestamps: false }
);

Like.belongsTo(User, { foreignKey: 'userId', constraints: false });
Like.hasOne(User, { foreignKey: 'userId', constraints: false });
User.hasMany(Like, { foreignKey: 'userId', constraints: false });

Like.belongsTo(Post, { foreignKey: 'postId', constraints: false });
Like.hasOne(Post, { foreignKey: 'postId', constraints: false });
Post.hasMany(Like, { foreignKey: 'postId', constraints: false });

// async function doLike() {
// 	try {
// 		const like = await Like.create({ userId: 1, postId: 1 });
// 		console.log(like)
// 	} catch (error) {
// 		console.log(error.message)
// 	}
// }

// doLike()

// Like.sync({ force: true });

// Foreign Keys userId e postId

// Criando um índice secundário na coluna 'userId' da tabela 'tokens'
// const createIndexQuery = "CREATE INDEX postId_index ON likes (postId);";

// Executando a consulta SQL personalizada usando o método query() do Sequelize
// await sequelize.query(createIndexQuery);

export default Like;

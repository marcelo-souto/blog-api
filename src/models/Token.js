import sequelize from '../config/database/dbconfig.js';
import { DataTypes } from 'sequelize';
import User from './User.js';

const Token = sequelize.define(
	'tokens',
	{
		tokenId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{ timestamps: false }
);

User.hasOne(Token, { foreignKey: 'userId' });
Token.belongsTo(User, { foreignKey: 'userId' });

// Token.sync({ force: true });

/* ==================== DISCLAIMER ====================

O planetScale não aceita foreign keys então é necessario 
a criação de um indice paralelo que ainda assim garante 
a relação entre as entidades, segue abaixo o codido 
utilizado para resolver o problema:

Criando um índice secundário na coluna 'userId' da tabela 'tokens'
const createIndexQuery = "CREATE INDEX userId_index ON tokens (userId);";

Executando a consulta SQL personalizada usando o método query() do Sequelize
await sequelize.query(createIndexQuery); */

export default Token;

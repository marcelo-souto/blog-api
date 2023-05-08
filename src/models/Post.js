import sequelize from "../config/database/dbconfig.js";
import { DataTypes } from "sequelize";

import User from "./User.js";

const Post = sequelize.define(
  "posts",
  {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    scopes: {
      likes: {
        include: [
          {
            association: "likes",
            attributes: ["userId"],
          },
        ],
      },
      user: {
        include: [
          {
            association: "user",
            attributes: ["name", "userId"],
          },
        ],
      },
      categories: {
        include: [
          {
            association: "categories",
            attributes: ["name", "categoryId"],
          },
        ],
      },
    },
  }
);
0
// Relacionamentos

Post.hasOne(User, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Post, { foreignKey: "userId" });

// Post.sync({ alter: true });

export default Post;

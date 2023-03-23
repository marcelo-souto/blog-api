import sequelize from "../config/database/dbconfig.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.JSON,
      defaultValue: {
        url: null,
        hash: null,
        id: null,
      },
    },
    refreshToken: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
    },
    verifiedEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    scopes: {
      posts: { include: [{ association: "posts" }] },
      likes: { include: [{ association: "likes" }] },
    },
  }
);

// User.sync({ force: true });

export default User;

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.post, {
        as: "posts",
        foreignKey: "userId",
      });
      user.hasMany(models.hired, {
        as: "offers",
        foreignKey: "orderTo",
      });
      user.hasMany(models.hired, {
        as: "hires",
        foreignKey: "orderBy",
      });
      user.hasMany(models.art, {
        as: "arts",
        foreignKey: "userId",
      });
      user.hasMany(models.follow, {
        as: "following",
        foreignKey: "followedBy",
      });
      user.hasMany(models.follow, {
        as: "followers",
        foreignKey: "followTo",
      });
    }
  }
  user.init(
    {
      email: DataTypes.STRING,
      fullName: DataTypes.STRING,
      greeting: DataTypes.STRING,
      avatar: DataTypes.STRING,
      password: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};

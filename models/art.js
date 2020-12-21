"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class art extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      art.belongsTo(models.user, {
        as: "arts",
        foreignKey: "userId",
      });
    }
  }
  art.init(
    {
      userId: DataTypes.INTEGER,
      art: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "art",
    }
  );
  return art;
};

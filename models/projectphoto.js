"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class projectPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      projectPhoto.belongsTo(models.project, {
        as: "photos",
        foreignKey: "projectId",
      });
    }
  }
  projectPhoto.init(
    {
      projectId: DataTypes.INTEGER,
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "projectPhoto",
    }
  );
  return projectPhoto;
};

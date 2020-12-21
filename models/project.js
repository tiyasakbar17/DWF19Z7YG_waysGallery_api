"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      project.hasMany(models.projectPhoto, {
        as: "photos",
        foreignKey: "projectId",
      });
      project.belongsTo(models.hired, {
        as: "project",
        foreignKey: "hiredId",
      });
    }
  }
  project.init(
    {
      hiredId: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};

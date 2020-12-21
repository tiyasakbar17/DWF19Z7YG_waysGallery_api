"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class hired extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      hired.belongsTo(models.user, {
        as: "hires",
        foreignKey: "orderBy",
      });
      hired.belongsTo(models.user, {
        as: "offers",
        foreignKey: "orderTo",
      });
      hired.hasOne(models.project, {
        as: "project",
        foreignKey: "hiredId",
      });
    }
  }
  hired.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      price: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      orderBy: DataTypes.INTEGER,
      orderTo: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "hired",
    }
  );
  return hired;
};

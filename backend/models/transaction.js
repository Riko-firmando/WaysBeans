"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaction.hasMany(models.order, {
        as: "orders",
        foreignKey: {
          name: "transactionID",
        },
      }),
        transaction.belongsTo(models.user, {
          as: "user",
          foreignKey: {
            name: "userID",
          },
        });
    }
  }
  transaction.init(
    {
      userID: DataTypes.INTEGER,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      codePos: DataTypes.STRING,
      address: DataTypes.STRING,
      attachment: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};

const { DataTypes } = require('sequelize');

function makeDrinks(sequelize) {
  return sequelize.define('Drink', {
    name: DataTypes.STRING,
    flavor: DataTypes.STRING,
    toppings: DataTypes.STRING,
    sweetness: DataTypes.INTEGER,
  });
}

module.exports = { makeDrinks };
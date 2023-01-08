const { DataTypes } = require('sequelize');

function addDrink(sequelize) {
  return sequelize.define('Favorites', {
    name: DataTypes.STRING,
    flavor: DataTypes.STRING,
    toppings: DataTypes.STRING,
    sweetness: DataTypes.INTEGER,
  });
}

module.exports = { addDrink };

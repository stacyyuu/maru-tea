const { Sequelize } = require('sequelize');
const { makeDrinks } = require('./menu.model');
const { addDrink } = require('./favorites.model');
const Collection = require('./class-collection');

const DATABASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'sqlite::memory:'
    : process.env.DATABASE_URL;

const CONNECTION_OPTIONS =
  process.env.NODE_ENV === 'test'
    ? {logging: false}
    : {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      };

const sequelize = new Sequelize(DATABASE_URL, CONNECTION_OPTIONS);
// creates a Sequelize constructor - info that it needs is database url and connection options
const Menu = makeDrinks(sequelize);
const Favorites = addDrink(sequelize);

module.exports = { 
  sequelize,
  menuCollection: new Collection(Menu),
  favoritesCollection: new Collection(Favorites), 
};
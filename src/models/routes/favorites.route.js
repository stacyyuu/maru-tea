const express = require('express');
const { favoritesCollection, menuCollection } = require('../index');
const { checkRole, checkJWT } = require('../../auth/routes');

const favoritesRoutes = express();
favoritesRoutes.use(express.json());

const getFavorites = async (_, res) => {
  const allDrinks = await favoritesCollection.read()
  res.json(allDrinks)
}

const getDrink = async (req, res, next) => {
  const id = req;
  const drink = await menuCollection.read(id);
  return drink.dataValues;
}
const getFavorite = async (req, res, next) => {
  const id = req.params.id;
  const drink = await favoritesCollection.read(id);
  drink === null ? next() : res.json(drink);
}

const createFavorite = async (req, res, next) => {
  let favoriteDrink;
  try {
    favoriteDrink = await getDrink(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
  
  const name = favoriteDrink.name;
  const flavor = favoriteDrink.flavor;
  const toppings = favoriteDrink.toppings;
  const sweetness = favoriteDrink.sweetness;
  const drink = await favoritesCollection.create({
    name: name,
    flavor: flavor,
    toppings: toppings, 
    sweetness: sweetness,
  })
  res.json(drink)
}

const updateFavoriteDrink = async (req, res, next) => {
  const id = req.params.id;
  let drink;
  const toppings = req.body.toppings ?? drink.toppings;
  const sweetness = req.body.sweetness ?? drink.sweetness;
  console.log(req.body)
  let updatedFavorites = {
    toppings: toppings,
    sweetness: sweetness,
  };
  drink = await favoritesCollection.update(updatedFavorites, id)
  res.json(drink)
}

const deleteDrink = async (req, res, next) => {
  const id = req.params.id
  const drink = await favoritesCollection.delete(id)
  if (drink === null) {
      next()
  } else {
      await drink
      res.json({})
  }
}

// Routes
favoritesRoutes.use(checkJWT);
favoritesRoutes.get('/favorites', checkRole(['user', 'admin']), getFavorites); // Retrieve All
favoritesRoutes.get('/menu/:id', checkRole(['user', 'admin']), getDrink); // Retrieve One
favoritesRoutes.get('/favorites/:id', checkRole(['user', 'admin']), getFavorite); // Retrieve One
favoritesRoutes.post('/favorites/:id', checkRole(['user', 'admin']), createFavorite); // Create
favoritesRoutes.put('/favorites/:id', checkRole(['user', 'admin']), updateFavoriteDrink); // Update
favoritesRoutes.delete('/favorites/:id', checkRole(['user','admin']), deleteDrink); // Delete

module.exports = {
  favoritesRoutes,
};
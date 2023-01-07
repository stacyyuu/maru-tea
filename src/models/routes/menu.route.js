const express = require('express');
const { menuCollection } = require('../index');
const { checkRole, checkJWT } = require('../../auth/routes');

const menuRoutes = express();

const getMenu = async (_, res) => {
  const allDrinks = await menuCollection.read()
  res.json(allDrinks)
}

const getDrink = async (req, res, next) => {
  const id = req.params.id;
  const drink = await menuCollection.read(id)
  drink === null ? next() : res.json(drink)
}

const createDrink = async (req, res) => {
  const name = req.body.name;
  const flavor = req.body.flavor;
  const toppings = req.body.toppings;
  const sweetness = req.body.sweetness;
  const drink = await menuCollection.create({
    name: name,
    flavor: flavor,
    toppings: toppings, 
    sweetness: sweetness,
  })
  res.json(drink)
}

const updateDrink = async (req, res, next) => {
  const id = req.params.id;
  let drink;
  const name = req.body.name ?? drink.name;
  const flavor = req.body.flavor ?? drink.flavor;
  const toppings = req.body.toppings ?? drink.toppings;
  const sweetness = req.body.sweetness ?? drink.sweetness;
  console.log(req.body)
  let updatedDrink = {
    name: name,
    flavor: flavor,
    toppings: toppings,
    sweetness: sweetness,
  };
  drink = await menuCollection.update(updatedDrink, id)
  res.json(drink)
}

const deleteDrink = async (req, res, next) => {
  const id = req.params.id
  const drink = await menuCollection.delete(id)
  if (drink === null) {
      next()
  } else {
      await drink
      res.json({})
  }
}

// Routes
menuRoutes.use(checkJWT);
menuRoutes.get('/menu', checkRole(['user', 'admin']), getMenu); // Retrieve All
menuRoutes.get('/menu/:id', checkRole(['user', 'admin']), getDrink); // Retrieve One
menuRoutes.post('/menu', checkRole(['admin']), createDrink); // Create
menuRoutes.put('/menu/:id', checkRole(['admin']), updateDrink); // Update
menuRoutes.delete('/menu/:id', checkRole(['admin']), deleteDrink); // Delete

module.exports = {
  menuRoutes,
};
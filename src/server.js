const express = require('express');
const server = express();
const logger = require('./middleware/logger');
const notFound = require('./error-handlers/404');
const serverError = require('./error-handlers/500');
const { sequelize } = require('./models');
const { authRoutes, checkJWT } = require('./auth');
const { menuRoutes } = require('./models/routes/menu.route');
const { favoritesRoutes } = require('./models/routes/favorites.route');

const PORT = process.env.PORT || 3002;
server.use(express.json());
server.use(authRoutes);
server.use(menuRoutes);
server.use(favoritesRoutes);
server.use(logger);

server.get('/loggedin', checkJWT, (req, res) => {
  res.status(200).send('You are logged in, ' + req.username);
});

server.use(serverError);
server.use('*', notFound);

const start = () => {
  server.listen(PORT, async () => {
    await sequelize.sync({ alter: true });
    console.log(`listening on ${PORT}`);
  });
};

module.exports = {
  server,
  start,
};

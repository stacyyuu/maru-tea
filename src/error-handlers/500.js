module.exports = (err, req, res, next) => {
  res.status(500).send(`There was a problem! 🧨 ${err}`);
};

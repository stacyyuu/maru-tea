module.exports = (req, _, next) => {
  // Log out the request path
  console.log(req.path);
  next();
};

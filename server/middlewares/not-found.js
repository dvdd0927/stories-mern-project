const notFoundMiddleware = async (req, res, next) => {
  res.status(404).send("Route doesn't exist");
};

module.exports = notFoundMiddleware;

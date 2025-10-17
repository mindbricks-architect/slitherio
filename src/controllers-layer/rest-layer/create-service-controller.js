const PlayerSessionServiceRestController = require("./PlayerSessionServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new PlayerSessionServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};

const mainRouters = require("./main");

const sessionRouter = require("./session-router");

module.exports = {
  ...mainRouters,
  PlayerSessionServiceRestController: require("./PlayerSessionServiceRestController"),
  ...sessionRouter,
};

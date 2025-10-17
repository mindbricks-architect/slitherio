const PlayerSessionServiceMcpController = require("./PlayerSessionServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new PlayerSessionServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};

module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    playerSessionMcpRouter: require("./playerSession")(headers),
  };
};

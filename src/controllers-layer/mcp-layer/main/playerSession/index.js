module.exports = (headers) => {
  // PlayerSession Db Object Rest Api Router
  const playerSessionMcpRouter = [];

  // createPlayerSession controller
  playerSessionMcpRouter.push(require("./create-playersession-api")(headers));
  // updatePlayerSession controller
  playerSessionMcpRouter.push(require("./update-playersession-api")(headers));
  // deletePlayerSession controller
  playerSessionMcpRouter.push(require("./delete-playersession-api")(headers));
  // getPlayerSession controller
  playerSessionMcpRouter.push(require("./get-playersession-api")(headers));
  // listPlayerSessions controller
  playerSessionMcpRouter.push(require("./list-playersessions-api")(headers));

  return playerSessionMcpRouter;
};

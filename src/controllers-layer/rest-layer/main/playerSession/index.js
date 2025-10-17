const express = require("express");

// PlayerSession Db Object Rest Api Router
const playerSessionRouter = express.Router();

// add PlayerSession controllers

// createPlayerSession controller
playerSessionRouter.post(
  "/v1/playersessions",
  require("./create-playersession-api"),
);
// updatePlayerSession controller
playerSessionRouter.patch(
  "/v1/playersessions/:playerSessionId",
  require("./update-playersession-api"),
);
// deletePlayerSession controller
playerSessionRouter.delete(
  "/v1/playersessions/:playerSessionId",
  require("./delete-playersession-api"),
);
// getPlayerSession controller
playerSessionRouter.get(
  "/v1/playersessions/:playerSessionId",
  require("./get-playersession-api"),
);
// listPlayerSessions controller
playerSessionRouter.get(
  "/v1/playersessions",
  require("./list-playersessions-api"),
);

module.exports = playerSessionRouter;

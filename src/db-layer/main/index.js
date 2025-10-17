const playerSessionFunctions = require("./playerSession");

module.exports = {
  // main Database
  createPlayerSession: playerSessionFunctions.createPlayerSession,
  getIdListOfPlayerSessionByField:
    playerSessionFunctions.getIdListOfPlayerSessionByField,
  getPlayerSessionById: playerSessionFunctions.getPlayerSessionById,
  getPlayerSessionAggById: playerSessionFunctions.getPlayerSessionAggById,
  getPlayerSessionListByQuery:
    playerSessionFunctions.getPlayerSessionListByQuery,
  getPlayerSessionStatsByQuery:
    playerSessionFunctions.getPlayerSessionStatsByQuery,
  getPlayerSessionByQuery: playerSessionFunctions.getPlayerSessionByQuery,
  updatePlayerSessionById: playerSessionFunctions.updatePlayerSessionById,
  updatePlayerSessionByIdList:
    playerSessionFunctions.updatePlayerSessionByIdList,
  updatePlayerSessionByQuery: playerSessionFunctions.updatePlayerSessionByQuery,
  deletePlayerSessionById: playerSessionFunctions.deletePlayerSessionById,
  deletePlayerSessionByQuery: playerSessionFunctions.deletePlayerSessionByQuery,
  getPlayerSessionBySessionToken:
    playerSessionFunctions.getPlayerSessionBySessionToken,
  dbScriptCreatePlayersession:
    playerSessionFunctions.dbScriptCreatePlayersession,
  dbScriptUpdatePlayersession:
    playerSessionFunctions.dbScriptUpdatePlayersession,
  dbScriptDeletePlayersession:
    playerSessionFunctions.dbScriptDeletePlayersession,
  dbScriptGetPlayersession: playerSessionFunctions.dbScriptGetPlayersession,
  dbScriptListPlayersessions: playerSessionFunctions.dbScriptListPlayersessions,
};

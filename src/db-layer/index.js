const mainFunctions = require("./main");

module.exports = {
  // main Database
  createPlayerSession: mainFunctions.createPlayerSession,
  getIdListOfPlayerSessionByField:
    mainFunctions.getIdListOfPlayerSessionByField,
  getPlayerSessionById: mainFunctions.getPlayerSessionById,
  getPlayerSessionAggById: mainFunctions.getPlayerSessionAggById,
  getPlayerSessionListByQuery: mainFunctions.getPlayerSessionListByQuery,
  getPlayerSessionStatsByQuery: mainFunctions.getPlayerSessionStatsByQuery,
  getPlayerSessionByQuery: mainFunctions.getPlayerSessionByQuery,
  updatePlayerSessionById: mainFunctions.updatePlayerSessionById,
  updatePlayerSessionByIdList: mainFunctions.updatePlayerSessionByIdList,
  updatePlayerSessionByQuery: mainFunctions.updatePlayerSessionByQuery,
  deletePlayerSessionById: mainFunctions.deletePlayerSessionById,
  deletePlayerSessionByQuery: mainFunctions.deletePlayerSessionByQuery,
  getPlayerSessionBySessionToken: mainFunctions.getPlayerSessionBySessionToken,
  dbScriptCreatePlayersession: mainFunctions.dbScriptCreatePlayersession,
  dbScriptUpdatePlayersession: mainFunctions.dbScriptUpdatePlayersession,
  dbScriptDeletePlayersession: mainFunctions.dbScriptDeletePlayersession,
  dbScriptGetPlayersession: mainFunctions.dbScriptGetPlayersession,
  dbScriptListPlayersessions: mainFunctions.dbScriptListPlayersessions,
};

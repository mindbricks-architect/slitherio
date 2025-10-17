const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  createPlayerSession: utils.createPlayerSession,
  getIdListOfPlayerSessionByField: utils.getIdListOfPlayerSessionByField,
  getPlayerSessionById: utils.getPlayerSessionById,
  getPlayerSessionAggById: utils.getPlayerSessionAggById,
  getPlayerSessionListByQuery: utils.getPlayerSessionListByQuery,
  getPlayerSessionStatsByQuery: utils.getPlayerSessionStatsByQuery,
  getPlayerSessionByQuery: utils.getPlayerSessionByQuery,
  updatePlayerSessionById: utils.updatePlayerSessionById,
  updatePlayerSessionByIdList: utils.updatePlayerSessionByIdList,
  updatePlayerSessionByQuery: utils.updatePlayerSessionByQuery,
  deletePlayerSessionById: utils.deletePlayerSessionById,
  deletePlayerSessionByQuery: utils.deletePlayerSessionByQuery,
  getPlayerSessionBySessionToken: utils.getPlayerSessionBySessionToken,
  dbScriptCreatePlayersession: dbApiScripts.dbScriptCreatePlayersession,
  dbScriptUpdatePlayersession: dbApiScripts.dbScriptUpdatePlayersession,
  dbScriptDeletePlayersession: dbApiScripts.dbScriptDeletePlayersession,
  dbScriptGetPlayersession: dbApiScripts.dbScriptGetPlayersession,
  dbScriptListPlayersessions: dbApiScripts.dbScriptListPlayersessions,
};

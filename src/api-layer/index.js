module.exports = {
  PlayerSessionServiceManager: require("./service-manager/PlayerSessionServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // PlayerSession Db Object
  CreatePlayerSessionManager: require("./main/playerSession/create-playersession-api"),
  UpdatePlayerSessionManager: require("./main/playerSession/update-playersession-api"),
  DeletePlayerSessionManager: require("./main/playerSession/delete-playersession-api"),
  GetPlayerSessionManager: require("./main/playerSession/get-playersession-api"),
  ListPlayerSessionsManager: require("./main/playerSession/list-playersessions-api"),
  integrationRouter: require("./integrations/testRouter"),
};

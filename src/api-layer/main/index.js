module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // PlayerSession Db Object
  CreatePlayerSessionManager: require("./playerSession/create-playersession-api"),
  UpdatePlayerSessionManager: require("./playerSession/update-playersession-api"),
  DeletePlayerSessionManager: require("./playerSession/delete-playersession-api"),
  GetPlayerSessionManager: require("./playerSession/get-playersession-api"),
  ListPlayerSessionsManager: require("./playerSession/list-playersessions-api"),
};

const PlayerSessionServiceGrpcController = require("./PlayerSessionServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new PlayerSessionServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};

const { UpdatePlayerSessionManager } = require("apiLayer");

const PlayerSessionRestController = require("../../PlayerSessionServiceRestController");

class UpdatePlayerSessionRestController extends PlayerSessionRestController {
  constructor(req, res) {
    super("updatePlayerSession", "updateplayersession", req, res);
    this.dataName = "playerSession";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdatePlayerSessionManager(this._req, "rest");
  }
}

const updatePlayerSession = async (req, res, next) => {
  const controller = new UpdatePlayerSessionRestController(req, res);
  try {
    await controller.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updatePlayerSession;

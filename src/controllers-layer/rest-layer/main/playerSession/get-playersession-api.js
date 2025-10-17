const { GetPlayerSessionManager } = require("apiLayer");

const PlayerSessionRestController = require("../../PlayerSessionServiceRestController");

class GetPlayerSessionRestController extends PlayerSessionRestController {
  constructor(req, res) {
    super("getPlayerSession", "getplayersession", req, res);
    this.dataName = "playerSession";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetPlayerSessionManager(this._req, "rest");
  }
}

const getPlayerSession = async (req, res, next) => {
  const controller = new GetPlayerSessionRestController(req, res);
  try {
    await controller.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getPlayerSession;

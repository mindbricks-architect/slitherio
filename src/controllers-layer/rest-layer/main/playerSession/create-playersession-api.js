const { CreatePlayerSessionManager } = require("apiLayer");

const PlayerSessionRestController = require("../../PlayerSessionServiceRestController");

class CreatePlayerSessionRestController extends PlayerSessionRestController {
  constructor(req, res) {
    super("createPlayerSession", "createplayersession", req, res);
    this.dataName = "playerSession";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreatePlayerSessionManager(this._req, "rest");
  }
}

const createPlayerSession = async (req, res, next) => {
  const controller = new CreatePlayerSessionRestController(req, res);
  try {
    await controller.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createPlayerSession;

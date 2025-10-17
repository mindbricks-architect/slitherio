const { DeletePlayerSessionManager } = require("apiLayer");

const PlayerSessionRestController = require("../../PlayerSessionServiceRestController");

class DeletePlayerSessionRestController extends PlayerSessionRestController {
  constructor(req, res) {
    super("deletePlayerSession", "deleteplayersession", req, res);
    this.dataName = "playerSession";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeletePlayerSessionManager(this._req, "rest");
  }
}

const deletePlayerSession = async (req, res, next) => {
  const controller = new DeletePlayerSessionRestController(req, res);
  try {
    await controller.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deletePlayerSession;

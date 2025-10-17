const { ListPlayerSessionsManager } = require("apiLayer");

const PlayerSessionRestController = require("../../PlayerSessionServiceRestController");

class ListPlayerSessionsRestController extends PlayerSessionRestController {
  constructor(req, res) {
    super("listPlayerSessions", "listplayersessions", req, res);
    this.dataName = "playerSessions";
    this.crudType = "list";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListPlayerSessionsManager(this._req, "rest");
  }
}

const listPlayerSessions = async (req, res, next) => {
  const controller = new ListPlayerSessionsRestController(req, res);
  try {
    await controller.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listPlayerSessions;

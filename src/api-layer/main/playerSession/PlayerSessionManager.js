const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const PlayerSessionServiceManager = require("../../service-manager/PlayerSessionServiceManager");

/* Base Class For the Crud Routes Of DbObject PlayerSession */
class PlayerSessionManager extends PlayerSessionServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "playerSession";
    this.modelName = "PlayerSession";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = PlayerSessionManager;

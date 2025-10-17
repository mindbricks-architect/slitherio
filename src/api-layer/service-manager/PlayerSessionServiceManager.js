const ApiManager = require("./ApiManager");

const { md5 } = require("common");

class PlayerSessionServiceManager extends ApiManager {
  constructor(request, options) {
    super(request, options);
    this.serviceCodename = "slitherio-playersession-service";
    this.membershipCache = new Map();
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
  }
}

module.exports = PlayerSessionServiceManager;

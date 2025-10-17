const PlayerSessionManager = require("./PlayerSessionManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { getRedisData } = require("common");
const {
  PlayersessionDeletedPublisher,
} = require("../../api-events/publishers");

const getIntegrationClient = require("../../integrations");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { dbScriptDeletePlayersession } = require("dbLayer");

class DeletePlayerSessionManager extends PlayerSessionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deletePlayerSession",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
    });

    this.dataName = "playerSession";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.playerSessionId = this.playerSessionId;
  }

  async checkBasicAuth() {
    if (this.checkAbsolute()) return true;
  }

  readRestParameters(request) {
    this.playerSessionId = request.params?.playerSessionId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.playerSessionId = request.mcpParams.playerSessionId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  // where clause methods

  async getRouteQuery() {
    return { id: this.playerSessionId };

    // handle permission filter later
  }

  async buildWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async fetchInstance() {
    const { getPlayerSessionByQuery } = require("dbLayer");
    this.playerSession = await getPlayerSessionByQuery(this.whereClause);
    if (!this.playerSession) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
    this._instance = this.playerSession;
  }

  async checkInstance() {
    if (!this.playerSession) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameterType_playerSessionId(paramValue) {
    if (!isValidUUID(paramValue)) {
      return false;
    }

    return true;
  }

  checkParameter_playerSessionId() {
    if (this.playerSessionId == null) {
      throw new BadRequestError("errMsg_playerSessionIdisRequired");
    }

    if (Array.isArray(this.playerSessionId)) {
      throw new BadRequestError("errMsg_playerSessionIdMustNotBeAnArray");
    }

    // Parameter Type: ID

    if (!this.checkParameterType_playerSessionId(this.playerSessionId)) {
      throw new BadRequestError("errMsg_playerSessionIdTypeIsNotValid");
    }
  }

  checkParameters() {
    if (this.playerSessionId) this.checkParameter_playerSessionId();
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.playerSession?._owner === this.session.userId;
  }

  async doBusiness() {
    const playersession = await dbScriptDeletePlayersession(this);
    return playersession;
  }

  async addToOutput() {}

  async raiseEvent() {
    PlayersessionDeletedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
        //**errorLog
      },
    );
  }

  // Work Flow

  // Action Store
}

module.exports = DeletePlayerSessionManager;

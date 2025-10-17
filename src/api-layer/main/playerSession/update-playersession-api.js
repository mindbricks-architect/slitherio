const PlayerSessionManager = require("./PlayerSessionManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { getRedisData } = require("common");
const {
  PlayersessionUpdatedPublisher,
} = require("../../api-events/publishers");

const getIntegrationClient = require("../../integrations");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { dbScriptUpdatePlayersession } = require("dbLayer");

class UpdatePlayerSessionManager extends PlayerSessionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updatePlayerSession",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
    });

    this.dataName = "playerSession";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.playerSessionId = this.playerSessionId;
    jsonObj.displayName = this.displayName;
    jsonObj.connectionStatus = this.connectionStatus;
    jsonObj.lastKnownAvatarId = this.lastKnownAvatarId;
    jsonObj.leaveTime = this.leaveTime;
    jsonObj.finalScore = this.finalScore;
    jsonObj.finalRank = this.finalRank;
    jsonObj.reconnectExpiry = this.reconnectExpiry;
  }

  async checkBasicAuth() {
    if (this.checkAbsolute()) return true;
  }

  readRestParameters(request) {
    this.playerSessionId = request.params?.playerSessionId;
    this.displayName = request.body?.displayName;
    this.connectionStatus = request.body?.connectionStatus;
    this.lastKnownAvatarId = request.body?.lastKnownAvatarId;
    this.leaveTime = request.body?.leaveTime;
    this.finalScore = request.body?.finalScore;
    this.finalRank = request.body?.finalRank;
    this.reconnectExpiry = request.body?.reconnectExpiry;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.playerSessionId = request.mcpParams.playerSessionId;
    this.displayName = request.mcpParams.displayName;
    this.connectionStatus = request.mcpParams.connectionStatus;
    this.lastKnownAvatarId = request.mcpParams.lastKnownAvatarId;
    this.leaveTime = request.mcpParams.leaveTime;
    this.finalScore = request.mcpParams.finalScore;
    this.finalRank = request.mcpParams.finalRank;
    this.reconnectExpiry = request.mcpParams.reconnectExpiry;
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

  // data clause methods

  async buildDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      displayName: this.displayName,
      connectionStatus: this.connectionStatus,
      lastKnownAvatarId: this.lastKnownAvatarId,
      leaveTime: this.leaveTime,
      finalScore: this.finalScore,
      finalRank: this.finalRank,
      reconnectExpiry: this.reconnectExpiry,
    };

    let isEmpty = true;
    for (const key of Object.keys(dataClause)) {
      if (dataClause[key] !== undefined) {
        isEmpty = false;
        break;
      }
    }

    if (isEmpty) {
      throw new BadRequestError("errMsg_UpdateDataClauseCanNotBeEmpty");
    }

    return dataClause;
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

  checkParameter_displayName() {
    if (this.displayName == null) return;

    if (Array.isArray(this.displayName)) {
      throw new BadRequestError("errMsg_displayNameMustNotBeAnArray");
    }

    // Parameter Type: String
  }

  checkParameterType_connectionStatus(paramValue) {
    function isInt(value) {
      return (
        !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10))
      );
    }

    const enumOptions = ["connected", "disconnected", "reconnecting"];
    if (typeof paramValue !== "string") {
      if (isInt(paramValue)) {
        paramValue = Number(paramValue);
        if (paramValue >= 0 && paramValue <= enumOptions.length - 1) {
          paramValue = enumOptions[paramValue];
          return paramValue;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    if (!enumOptions.includes(paramValue.toLowerCase())) {
      return false;
    }

    return true;
  }

  checkParameter_connectionStatus() {
    if (this.connectionStatus == null) {
      throw new BadRequestError("errMsg_connectionStatusisRequired");
    }

    if (Array.isArray(this.connectionStatus)) {
      throw new BadRequestError("errMsg_connectionStatusMustNotBeAnArray");
    }

    // Parameter Type: Enum

    const enumResult = this.checkParameterType_connectionStatus(
      this.connectionStatus,
    );
    if (enumResult === false) {
      throw new BadRequestError("errMsg_connectionStatusTypeIsNotValid");
    } else if (enumResult !== true) {
      this.connectionStatus = enumResult;
    }
  }

  checkParameter_lastKnownAvatarId() {
    if (this.lastKnownAvatarId == null) return;

    if (Array.isArray(this.lastKnownAvatarId)) {
      throw new BadRequestError("errMsg_lastKnownAvatarIdMustNotBeAnArray");
    }

    // Parameter Type: String
  }

  checkParameterType_leaveTime(paramValue) {
    const isDate = (timestamp) => new Date(timestamp).getTime() > 0;
    if (!isDate(paramValue)) {
      return false;
    }

    return true;
  }

  checkParameter_leaveTime() {
    if (this.leaveTime == null) return;

    if (Array.isArray(this.leaveTime)) {
      throw new BadRequestError("errMsg_leaveTimeMustNotBeAnArray");
    }

    // Parameter Type: Date

    if (!this.checkParameterType_leaveTime(this.leaveTime)) {
      throw new BadRequestError("errMsg_leaveTimeTypeIsNotValid");
    }
  }

  checkParameterType_finalScore(paramValue) {
    if (isNaN(paramValue)) {
      return false;
    }

    return true;
  }

  checkParameter_finalScore() {
    if (this.finalScore == null) return;

    if (Array.isArray(this.finalScore)) {
      throw new BadRequestError("errMsg_finalScoreMustNotBeAnArray");
    }

    // Parameter Type: Integer

    if (!this.checkParameterType_finalScore(this.finalScore)) {
      throw new BadRequestError("errMsg_finalScoreTypeIsNotValid");
    }
  }

  checkParameterType_finalRank(paramValue) {
    if (isNaN(paramValue)) {
      return false;
    }

    return true;
  }

  checkParameter_finalRank() {
    if (this.finalRank == null) return;

    if (Array.isArray(this.finalRank)) {
      throw new BadRequestError("errMsg_finalRankMustNotBeAnArray");
    }

    // Parameter Type: Integer

    if (!this.checkParameterType_finalRank(this.finalRank)) {
      throw new BadRequestError("errMsg_finalRankTypeIsNotValid");
    }
  }

  checkParameterType_reconnectExpiry(paramValue) {
    const isDate = (timestamp) => new Date(timestamp).getTime() > 0;
    if (!isDate(paramValue)) {
      return false;
    }

    return true;
  }

  checkParameter_reconnectExpiry() {
    if (this.reconnectExpiry == null) return;

    if (Array.isArray(this.reconnectExpiry)) {
      throw new BadRequestError("errMsg_reconnectExpiryMustNotBeAnArray");
    }

    // Parameter Type: Date

    if (!this.checkParameterType_reconnectExpiry(this.reconnectExpiry)) {
      throw new BadRequestError("errMsg_reconnectExpiryTypeIsNotValid");
    }
  }

  checkParameters() {
    if (this.playerSessionId) this.checkParameter_playerSessionId();

    if (this.displayName) this.checkParameter_displayName();

    if (this.connectionStatus) this.checkParameter_connectionStatus();

    if (this.lastKnownAvatarId) this.checkParameter_lastKnownAvatarId();

    if (this.leaveTime) this.checkParameter_leaveTime();

    if (this.finalScore) this.checkParameter_finalScore();

    if (this.finalRank) this.checkParameter_finalRank();

    if (this.reconnectExpiry) this.checkParameter_reconnectExpiry();
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.playerSession?._owner === this.session.userId;
  }

  async doBusiness() {
    const playersession = await dbScriptUpdatePlayersession(this);
    return playersession;
  }

  async addToOutput() {}

  async raiseEvent() {
    PlayersessionUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
        //**errorLog
      },
    );
  }

  // Work Flow

  // Action Store
}

module.exports = UpdatePlayerSessionManager;

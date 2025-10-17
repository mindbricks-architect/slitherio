const PlayerSessionManager = require("./PlayerSessionManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { getRedisData } = require("common");
const {
  PlayersessionCreatedPublisher,
} = require("../../api-events/publishers");

const getIntegrationClient = require("../../integrations");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { dbScriptCreatePlayersession } = require("dbLayer");

class CreatePlayerSessionManager extends PlayerSessionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createPlayerSession",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
    });

    this.dataName = "playerSession";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.playerSessionId = this.playerSessionId;
    jsonObj.displayName = this.displayName;
    jsonObj.sessionToken = this.sessionToken;
    jsonObj.connectionStatus = this.connectionStatus;
    jsonObj.lastKnownAvatarId = this.lastKnownAvatarId;
    jsonObj.joinTime = this.joinTime;
    jsonObj.leaveTime = this.leaveTime;
    jsonObj.finalScore = this.finalScore;
    jsonObj.finalRank = this.finalRank;
    jsonObj.reconnectExpiry = this.reconnectExpiry;
  }

  async checkBasicAuth() {
    if (this.checkAbsolute()) return true;
  }

  readRestParameters(request) {
    this.playerSessionId = request.body?.playerSessionId;
    this.displayName = request.body?.displayName;
    this.sessionToken = request.body?.sessionToken;
    this.connectionStatus = request.body?.connectionStatus;
    this.lastKnownAvatarId = request.body?.lastKnownAvatarId;
    this.joinTime = request.body?.joinTime;
    this.leaveTime = request.body?.leaveTime;
    this.finalScore = request.body?.finalScore;
    this.finalRank = request.body?.finalRank;
    this.reconnectExpiry = request.body?.reconnectExpiry;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.playerSessionId = request.mcpParams.playerSessionId;
    this.displayName = request.mcpParams.displayName;
    this.sessionToken = request.mcpParams.sessionToken;
    this.connectionStatus = request.mcpParams.connectionStatus;
    this.lastKnownAvatarId = request.mcpParams.lastKnownAvatarId;
    this.joinTime = request.mcpParams.joinTime;
    this.leaveTime = request.mcpParams.leaveTime;
    this.finalScore = request.mcpParams.finalScore;
    this.finalRank = request.mcpParams.finalRank;
    this.reconnectExpiry = request.mcpParams.reconnectExpiry;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  // data clause methods

  async buildDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.playerSessionId = this.id;
    if (!this.playerSessionId) this.playerSessionId = newUUID(false);

    const dataClause = {
      id: this.playerSessionId,
      displayName: this.displayName,
      sessionToken: this.sessionToken,
      connectionStatus: this.connectionStatus,
      lastKnownAvatarId: this.lastKnownAvatarId,
      joinTime: this.joinTime,
      leaveTime: this.leaveTime,
      finalScore: this.finalScore,
      finalRank: this.finalRank,
      reconnectExpiry: this.reconnectExpiry,
    };

    return dataClause;
  }

  checkParameterType_playerSessionId(paramValue) {
    if (!isValidUUID(paramValue)) {
      return false;
    }

    return true;
  }

  checkParameter_playerSessionId() {
    if (this.playerSessionId == null) return;

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

  checkParameter_sessionToken() {
    if (this.sessionToken == null) {
      throw new BadRequestError("errMsg_sessionTokenisRequired");
    }

    if (Array.isArray(this.sessionToken)) {
      throw new BadRequestError("errMsg_sessionTokenMustNotBeAnArray");
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

  checkParameterType_joinTime(paramValue) {
    const isDate = (timestamp) => new Date(timestamp).getTime() > 0;
    if (!isDate(paramValue)) {
      return false;
    }

    return true;
  }

  checkParameter_joinTime() {
    if (this.joinTime == null) {
      throw new BadRequestError("errMsg_joinTimeisRequired");
    }

    if (Array.isArray(this.joinTime)) {
      throw new BadRequestError("errMsg_joinTimeMustNotBeAnArray");
    }

    // Parameter Type: Date

    if (!this.checkParameterType_joinTime(this.joinTime)) {
      throw new BadRequestError("errMsg_joinTimeTypeIsNotValid");
    }
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

    if (this.sessionToken) this.checkParameter_sessionToken();

    if (this.connectionStatus) this.checkParameter_connectionStatus();

    if (this.lastKnownAvatarId) this.checkParameter_lastKnownAvatarId();

    if (this.joinTime) this.checkParameter_joinTime();

    if (this.leaveTime) this.checkParameter_leaveTime();

    if (this.finalScore) this.checkParameter_finalScore();

    if (this.finalRank) this.checkParameter_finalRank();

    if (this.reconnectExpiry) this.checkParameter_reconnectExpiry();
  }

  async doBusiness() {
    const playersession = await dbScriptCreatePlayersession(this);
    return playersession;
  }

  async addToOutput() {}

  async raiseEvent() {
    PlayersessionCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
        //**errorLog
      },
    );
  }

  // Work Flow

  // Action Store
}

module.exports = CreatePlayerSessionManager;

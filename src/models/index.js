const { DataTypes } = require("sequelize");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");
const { hexaLogger } = require("common");

const PlayerSession = require("./playerSession");

PlayerSession.prototype.getData = function () {
  const data = this.dataValues;

  for (const key of Object.keys(data)) {
    if (key.startsWith("json_")) {
      data[key] = JSON.parse(data[key]);
      const newKey = key.slice(5);
      data[newKey] = data[key];
      delete data[key];
    }
  }

  // set enum Index and enum value
  const connectionStatusOptions = ["connected", "disconnected", "reconnecting"];
  const dataTypeconnectionStatusPlayerSession = typeof data.connectionStatus;
  const enumIndexconnectionStatusPlayerSession =
    dataTypeconnectionStatusPlayerSession === "string"
      ? connectionStatusOptions.indexOf(data.connectionStatus)
      : data.connectionStatus;
  data.connectionStatus_idx = enumIndexconnectionStatusPlayerSession;
  data.connectionStatus =
    enumIndexconnectionStatusPlayerSession > -1
      ? connectionStatusOptions[enumIndexconnectionStatusPlayerSession]
      : null;

  data._iPublic = true;

  return data;
};

module.exports = {
  PlayerSession,
  updateElasticIndexMappings,
};

const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const playerSessionMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  displayName: { type: "keyword", index: true },
  sessionToken: { type: "keyword", index: true },
  connectionStatus: { type: "keyword", index: true },
  connectionStatus_: { type: "keyword" },
  lastKnownAvatarId: { type: "keyword", index: false },
  joinTime: { type: "date", index: false },
  leaveTime: { type: "date", index: false },
  finalScore: { type: "integer", index: false },
  finalRank: { type: "integer", index: false },
  reconnectExpiry: { type: "date", index: false },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("playerSession", playerSessionMapping);
    await new ElasticIndexer("playerSession").updateMapping(
      playerSessionMapping,
    );
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;

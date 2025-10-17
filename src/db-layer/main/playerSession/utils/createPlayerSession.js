const { HttpServerError, BadRequestError } = require("common");

const { ElasticIndexer } = require("serviceCommon");

const { PlayerSession } = require("models");
const { hexaLogger, newUUID } = require("common");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("playerSession");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["sessionToken", "connectionStatus", "joinTime"];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data.id) {
    data.id = newUUID();
  }
};

const createPlayerSession = async (data) => {
  try {
    validateData(data);

    const current_playerSession = data.id
      ? await PlayerSession.findByPk(data.id)
      : null;
    let newplayerSession = null;

    if (current_playerSession) {
      delete data.id;

      await current_playerSession.update(data);
      newplayerSession = current_playerSession;
    }

    if (!newplayerSession) {
      newplayerSession = await PlayerSession.create(data);
    }

    const _data = newplayerSession.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    //**errorLog
    throw new HttpServerError("errMsg_dbErrorWhenCreatingPlayerSession", err);
  }
};

module.exports = createPlayerSession;

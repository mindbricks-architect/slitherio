const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { PlayerSession } = require("models");
const { Op } = require("sequelize");

const getIdListOfPlayerSessionByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const options = {
      attributes: ["id"],
    };
    if (fieldName) {
      options.where = isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] } }
        : { [fieldName]: fieldValue };
    }

    let playerSessionIdList = await PlayerSession.findAll(options);

    if (!playerSessionIdList) {
      throw new NotFoundError(
        `PlayerSession with the specified criteria not found`,
      );
    }

    playerSessionIdList = playerSessionIdList.map((item) => item.id);
    return playerSessionIdList;
  } catch (err) {
    //**errorLog
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPlayerSessionIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfPlayerSessionByField;

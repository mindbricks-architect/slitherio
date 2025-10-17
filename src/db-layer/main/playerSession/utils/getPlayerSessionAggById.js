const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { PlayerSession } = require("models");
const { Op } = require("sequelize");

const getPlayerSessionAggById = async (playerSessionId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const playerSession = Array.isArray(playerSessionId)
      ? await PlayerSession.findAll({
          where: {
            id: { [Op.in]: playerSessionId },
          },
          include: includes,
        })
      : await PlayerSession.findByPk(playerSessionId, { include: includes });

    if (!playerSession) {
      return null;
    }

    const playerSessionData =
      Array.isArray(playerSessionId) && playerSessionId.length > 0
        ? playerSession.map((item) => item.getData())
        : playerSession.getData();
    await PlayerSession.getCqrsJoins(playerSessionData);
    return playerSessionData;
  } catch (err) {
    //**errorLog
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPlayerSessionAggById",
      err,
    );
  }
};

module.exports = getPlayerSessionAggById;

const { HttpServerError } = require("common");

let { PlayerSession } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getPlayerSessionById = async (playerSessionId) => {
  try {
    const playerSession = Array.isArray(playerSessionId)
      ? await PlayerSession.findAll({
          where: {
            id: { [Op.in]: playerSessionId },
          },
        })
      : await PlayerSession.findByPk(playerSessionId);

    if (!playerSession) {
      return null;
    }
    return Array.isArray(playerSessionId)
      ? playerSession.map((item) => item.getData())
      : playerSession.getData();
  } catch (err) {
    console.log(err);
    //**errorLog
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPlayerSessionById",
      err,
    );
  }
};

module.exports = getPlayerSessionById;

const { HttpServerError, BadRequestError } = require("common");

const { PlayerSession } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPlayerSessionByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const playerSession = await PlayerSession.findOne({
      where: query,
    });

    if (!playerSession) return null;
    return playerSession.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPlayerSessionByQuery",
      err,
    );
  }
};

module.exports = getPlayerSessionByQuery;

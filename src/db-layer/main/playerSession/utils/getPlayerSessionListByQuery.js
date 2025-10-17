const { HttpServerError, BadRequestError } = require("common");

const { PlayerSession } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getPlayerSessionListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const playerSession = await PlayerSession.findAll({
      where: query,
    });

    //should i add not found error or only return empty array?
    if (!playerSession || playerSession.length === 0) return [];

    //      if (!playerSession || playerSession.length === 0) {
    //      throw new NotFoundError(
    //      `PlayerSession with the specified criteria not found`
    //  );
    //}

    return playerSession.map((item) => item.getData());
  } catch (err) {
    //**errorLog
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPlayerSessionListByQuery",
      err,
    );
  }
};

module.exports = getPlayerSessionListByQuery;

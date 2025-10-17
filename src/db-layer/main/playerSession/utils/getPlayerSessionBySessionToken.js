const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { hexaLogger } = require("common");
const { PlayerSession } = require("models");
const { Op } = require("sequelize");

const getPlayerSessionBySessionToken = async (sessionToken) => {
  try {
    const playerSession = await PlayerSession.findOne({
      where: { sessionToken: sessionToken },
    });

    if (!playerSession) {
      return null;
    }
    return playerSession.getData();
  } catch (err) {
    //**errorLog
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPlayerSessionBySessionToken",
      err,
    );
  }
};

module.exports = getPlayerSessionBySessionToken;

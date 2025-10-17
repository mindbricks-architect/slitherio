const { HttpServerError, BadRequestError } = require("common");
const { PlayerSession } = require("models");
const { Op } = require("sequelize");
// shoul i add softdelete condition?
const deletePlayerSessionByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const rows = await PlayerSession.findAll({ where: query });
    if (!rows || rows.length === 0) return [];

    await PlayerSession.destroy({ where: query });
    return rows.map((item) => item.getData());
  } catch (err) {
    //**errorLog
    throw new HttpServerError(
      "errMsg_dbErrorWhenDeletingPlayerSessionByQuery",
      err,
    );
  }
};

module.exports = deletePlayerSessionByQuery;

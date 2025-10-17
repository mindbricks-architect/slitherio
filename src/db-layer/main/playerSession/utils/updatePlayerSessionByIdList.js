const { HttpServerError } = require("common");

const { PlayerSession } = require("models");
const { Op } = require("sequelize");

const updatePlayerSessionByIdList = async (idList, dataClause) => {
  try {
    let rowsCount = null;
    let rows = null;

    const options = { where: { id: { [Op.in]: idList } }, returning: true };

    [rowsCount, rows] = await PlayerSession.update(dataClause, options);
    const playerSessionIdList = rows.map((item) => item.id);
    return playerSessionIdList;
  } catch (err) {
    //**errorLog
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPlayerSessionByIdList",
      err,
    );
  }
};

module.exports = updatePlayerSessionByIdList;

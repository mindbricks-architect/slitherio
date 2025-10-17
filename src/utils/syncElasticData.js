const {
  getPlayerSessionById,
  getIdListOfPlayerSessionByField,
} = require("dbLayer");
const path = require("path");
const fs = require("fs");
const { ElasticIndexer } = require("serviceCommon");

const indexPlayerSessionData = async () => {
  const playerSessionIndexer = new ElasticIndexer("playerSession", {
    isSilent: true,
  });
  console.log("Starting to update indexes for PlayerSession");
  const idList = (await getIdListOfPlayerSessionByField()) ?? [];
  const chunkSize = 500;
  let total = 0;
  for (let i = 0; i < idList.length; i += chunkSize) {
    const chunk = idList.slice(i, i + chunkSize);
    const dataList = await getPlayerSessionById(chunk);
    if (dataList.length) {
      await playerSessionIndexer.indexBulkData(dataList);
      await playerSessionIndexer.deleteRedisCache();
    }
    total += dataList.length;
  }
  return total;
};

const syncElasticIndexData = async () => {
  const startTime = new Date();
  console.log("syncElasticIndexData started", startTime);

  try {
    const dataCount = await indexPlayerSessionData();
    console.log(
      "PlayerSession agregated data is indexed, total playerSessions:",
      dataCount,
    );
  } catch (err) {
    console.log(
      "Elastic Index Error When Syncing PlayerSession data",
      err.toString(),
    );
    console.log(err);
    //**errorLog
  }

  const elapsedTime = new Date() - startTime;
  console.log("initElasticIndexData ended -> elapsedTime:", elapsedTime);
};

module.exports = syncElasticIndexData;

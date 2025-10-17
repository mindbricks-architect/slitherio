//ask about this no other option other than softdelete
const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { PlayerSession } = require("models");
const { ElasticIndexer } = require("serviceCommon");

const deletePlayerSessionById = async (id) => {
  try {
    if (typeof id === "object") {
      id = id.id;
    }
    if (!id)
      throw new BadRequestError("ID is required in utility delete function");

    const existingDoc = await PlayerSession.findByPk(id);
    if (!existingDoc) {
      throw new NotFoundError(`Record with ID ${id} not found.`);
    }

    await existingDoc.destroy();

    const elasticIndexer = new ElasticIndexer("playerSession");
    await elasticIndexer.deleteData(id);

    return existingDoc.getData();
  } catch (err) {
    //**errorLog
    throw new HttpServerError(
      "An unexpected error occurred during the delete operation.",
      err,
    );
  }
};

module.exports = deletePlayerSessionById;

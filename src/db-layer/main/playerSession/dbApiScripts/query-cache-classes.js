const { QueryCache, QueryCacheInvalidator } = require("common");

const { Op } = require("sequelize");

class PlayerSessionQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("playerSession", [], Op.and, Op.eq, input, wClause);
  }
}

class PlayerSessionQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("playerSession", []);
  }
}

module.exports = {
  PlayerSessionQueryCache,
  PlayerSessionQueryCacheInvalidator,
};

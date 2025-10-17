const { ServicePublisher } = require("serviceCommon");

// PlayerSession Event Publisher Classes

// Publisher class for createPlayerSession api
const { PlayersessionCreatedTopic } = require("./topics");
class PlayersessionCreatedPublisher extends ServicePublisher {
  constructor(playersession, session, requestId) {
    super(PlayersessionCreatedTopic, playersession, session, requestId);
  }

  static async Publish(playersession, session, requestId) {
    const _publisher = new PlayersessionCreatedPublisher(
      playersession,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updatePlayerSession api
const { PlayersessionUpdatedTopic } = require("./topics");
class PlayersessionUpdatedPublisher extends ServicePublisher {
  constructor(playersession, session, requestId) {
    super(PlayersessionUpdatedTopic, playersession, session, requestId);
  }

  static async Publish(playersession, session, requestId) {
    const _publisher = new PlayersessionUpdatedPublisher(
      playersession,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for deletePlayerSession api
const { PlayersessionDeletedTopic } = require("./topics");
class PlayersessionDeletedPublisher extends ServicePublisher {
  constructor(playersession, session, requestId) {
    super(PlayersessionDeletedTopic, playersession, session, requestId);
  }

  static async Publish(playersession, session, requestId) {
    const _publisher = new PlayersessionDeletedPublisher(
      playersession,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for getPlayerSession api
const { PlayersessionRetrivedTopic } = require("./topics");
class PlayersessionRetrivedPublisher extends ServicePublisher {
  constructor(playersession, session, requestId) {
    super(PlayersessionRetrivedTopic, playersession, session, requestId);
  }

  static async Publish(playersession, session, requestId) {
    const _publisher = new PlayersessionRetrivedPublisher(
      playersession,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for listPlayerSessions api
const { PlayersessionsListedTopic } = require("./topics");
class PlayersessionsListedPublisher extends ServicePublisher {
  constructor(playersessions, session, requestId) {
    super(PlayersessionsListedTopic, playersessions, session, requestId);
  }

  static async Publish(playersessions, session, requestId) {
    const _publisher = new PlayersessionsListedPublisher(
      playersessions,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

module.exports = {
  PlayersessionCreatedPublisher,
  PlayersessionUpdatedPublisher,
  PlayersessionDeletedPublisher,
  PlayersessionRetrivedPublisher,
  PlayersessionsListedPublisher,
};

const { sequelize } = require("common");
const { DataTypes } = require("sequelize");

//Represents an anonymous player&#39;s ephemeral in-session identity. Manages temporary display name, session token, connection state, avatar linkage, and session lifetime. No persistence beyond active session.
const PlayerSession = sequelize.define(
  "playerSession",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    displayName: {
      // Temporary player display name (chosen/provided by player or auto-generated guest label)
      type: DataTypes.STRING,
      allowNull: true,
    },
    sessionToken: {
      // A unique, ephemeral token identifying this player session; required for reconnection/resume and anti-abuse.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "default",
    },
    connectionStatus: {
      // Current ephemeral connection state: 'connected', 'disconnected', 'reconnecting'.
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "connected",
    },
    lastKnownAvatarId: {
      // Points to the current in-game avatar for sync with gameWorld service. Used for reconnection/clean removal.
      type: DataTypes.STRING,
      allowNull: true,
    },
    joinTime: {
      // Timestamp when player joined the game session.
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    leaveTime: {
      // Timestamp when player left/disconnected from the session (or null if still active).
      type: DataTypes.DATE,
      allowNull: true,
    },
    finalScore: {
      // Final score delivered to player upon exit/disconnect (populated via game event feedback).
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    finalRank: {
      // Final ranking for player in this session, provided at exit/summary.
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reconnectExpiry: {
      // Deadline for player to reconnect before session is fully purged (set at disconnect).
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["connectionStatus"],
      },
      {
        unique: false,
        fields: ["reconnectExpiry"],
      },

      {
        unique: true,
        fields: ["sessionToken"],
      },
    ],
  },
);

module.exports = PlayerSession;

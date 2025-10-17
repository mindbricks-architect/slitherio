const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const basePath =
    process.env.SERVICE_URL_SUFFIX ?? `${process.env.SERVICE_SHORT_NAME}-api`;
  const baseUrl = process.env.SERVICE_URL ?? "mindbricks.com";
  const shortName = process.env.SERVICE_SHORT_NAME?.toLowerCase();
  const authUrl = shortName ? baseUrl.replace(shortName, "auth") : baseUrl;

  const config = {
    basePath: basePath,
    name: "slitherio - playerSession",
    brand: {
      name: "slitherio",
      image: "https://minioapi.masaupp.com/mindbricks/favico.ico",
      moduleName: "playerSession",
      version: process.env.SERVICE_VERSION || "1.0.0",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "PlayerSession",
        description:
          "Represents an anonymous player&#39;s ephemeral in-session identity. Manages temporary display name, session token, connection state, avatar linkage, and session lifetime. No persistence beyond active session.",
        reference: {
          tableName: "playerSession",
          properties: [
            {
              name: "displayName",
              type: "String",
            },

            {
              name: "sessionToken",
              type: "String",
            },

            {
              name: "connectionStatus",
              type: "Enum",
            },

            {
              name: "lastKnownAvatarId",
              type: "String",
            },

            {
              name: "joinTime",
              type: "Date",
            },

            {
              name: "leaveTime",
              type: "Date",
            },

            {
              name: "finalScore",
              type: "Integer",
            },

            {
              name: "finalRank",
              type: "Integer",
            },

            {
              name: "reconnectExpiry",
              type: "Date",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "POST",
            url: `${basePath}/v1/playersessions`,
            title: "Create Playersession",
            query: [],

            body: {
              type: "json",
              content: {
                displayName: "String",
                sessionToken: "String",
                connectionStatus: "Enum",
                lastKnownAvatarId: "String",
                joinTime: "Date",
                leaveTime: "Date",
                finalScore: "Integer",
                finalRank: "Integer",
                reconnectExpiry: "Date",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: `${basePath}/v1/playersessions/{playerSessionId}`,
            title: "Update Playersession",
            query: [],

            body: {
              type: "json",
              content: {
                displayName: "String",
                connectionStatus: "Enum",
                lastKnownAvatarId: "String",
                leaveTime: "Date",
                finalScore: "Integer",
                finalRank: "Integer",
                reconnectExpiry: "Date",
              },
            },

            parameters: [
              {
                key: "playerSessionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: `${basePath}/v1/playersessions/{playerSessionId}`,
            title: "Delete Playersession",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "playerSessionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: `${basePath}/v1/playersessions/{playerSessionId}`,
            title: "Get Playersession",
            query: [],

            parameters: [
              {
                key: "playerSessionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: `${basePath}/v1/playersessions`,
            title: "List Playersessions",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};

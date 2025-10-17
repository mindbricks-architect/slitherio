const { UpdatePlayerSessionManager } = require("apiLayer");
const { z } = require("zod");

const PlayerSessionMcpController = require("../../PlayerSessionServiceMcpController");

class UpdatePlayerSessionMcpController extends PlayerSessionMcpController {
  constructor(params) {
    super("updatePlayerSession", "updateplayersession", params);
    this.dataName = "playerSession";
    this.crudType = "update";
  }

  createApiManager() {
    return new UpdatePlayerSessionManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        playerSession: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            displayName: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Temporary player display name (chosen/provided by player or auto-generated guest label)",
              ),
            sessionToken: z
              .string()
              .max(255)
              .describe(
                "A unique, ephemeral token identifying this player session; required for reconnection/resume and anti-abuse.",
              ),
            connectionStatus: z
              .enum(["connected", "disconnected", "reconnecting"])
              .describe(
                "Current ephemeral connection state: 'connected', 'disconnected', 'reconnecting'.",
              ),
            lastKnownAvatarId: z
              .string()
              .max(255)
              .optional()
              .nullable()
              .describe(
                "Points to the current in-game avatar for sync with gameWorld service. Used for reconnection/clean removal.",
              ),
            joinTime: z
              .string()
              .describe("Timestamp when player joined the game session."),
            leaveTime: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Timestamp when player left/disconnected from the session (or null if still active).",
              ),
            finalScore: z
              .number()
              .int()
              .optional()
              .nullable()
              .describe(
                "Final score delivered to player upon exit/disconnect (populated via game event feedback).",
              ),
            finalRank: z
              .number()
              .int()
              .optional()
              .nullable()
              .describe(
                "Final ranking for player in this session, provided at exit/summary.",
              ),
            reconnectExpiry: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Deadline for player to reconnect before session is fully purged (set at disconnect).",
              ),
          })
          .describe(
            "Represents an anonymous player's ephemeral in-session identity. Manages temporary display name, session token, connection state, avatar linkage, and session lifetime. No persistence beyond active session.",
          ),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
      playerSessionId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that will be updated",
        ),

      displayName: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Temporary player display name (chosen/provided by player or auto-generated guest label)",
        ),

      connectionStatus: z
        .enum([])
        .describe(
          "Current ephemeral connection state: 'connected', 'disconnected', 'reconnecting'.",
        ),

      lastKnownAvatarId: z
        .string()
        .max(255)
        .optional()
        .describe(
          "Points to the current in-game avatar for sync with gameWorld service. Used for reconnection/clean removal.",
        ),

      leaveTime: z
        .string()
        .optional()
        .describe(
          "Timestamp when player left/disconnected from the session (or null if still active).",
        ),

      finalScore: z
        .number()
        .int()
        .optional()
        .describe(
          "Final score delivered to player upon exit/disconnect (populated via game event feedback).",
        ),

      finalRank: z
        .number()
        .int()
        .optional()
        .describe(
          "Final ranking for player in this session, provided at exit/summary.",
        ),

      reconnectExpiry: z
        .string()
        .optional()
        .describe(
          "Deadline for player to reconnect before session is fully purged (set at disconnect).",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "updatePlayerSession",
    description:
      "Update a player&#39;s session state (e.g., connectionStatus for reconnection, disconnect, or avatar sync).",
    parameters: UpdatePlayerSessionMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      console.log("Mcp Request Received", mcpParams);
      mcpParams.headers = headers;
      const controller = new UpdatePlayerSessionMcpController(mcpParams);
      try {
        const result = await controller.processRequest();
        //return UpdatePlayerSessionMcpController.getOutputSchema().parse(result);
        console.log("Mcp Response Ready", JSON.stringify(result));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (err) {
        console.log("Mcp Error Occured", err.message);
        //**errorLog
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }
    },
  };
};

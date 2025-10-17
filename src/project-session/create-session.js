module.exports = {
  createSession: () => {
    const SessionManager = require("./slitherio-session");
    return new SessionManager();
  },
};

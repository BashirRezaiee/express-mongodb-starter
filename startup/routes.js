const errorMiddleware = require("../middleware/error");

module.exports = function(app) {
  app.use("/auth", require("../routes/auth"));
  app.use("/users", require("../routes/users"));

  app.use(errorMiddleware);
};

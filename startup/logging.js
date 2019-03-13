const { format } = require("winston");
let winston = require("winston");

module.exports = function() {
  require("express-async-errors");

  winston.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info"
    })
  );

  winston.add(
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error"
    })
  );

  winston.exceptions.handle(
    new winston.transports.File({
      filename: "logs/exceptions.log"
    })
  );

  winston.exitOnError = false;

  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({
        format: format.combine(format.colorize(), format.simple()),
        handleExceptions: true
      })
    );
  }

  process.on("unhandledRejection", ex => {
    throw ex;
  });
};

const mongoose = require("mongoose");
const Fawn = require("fawn");
const config = require("config");
const winston = require("winston");

module.exports = () => {
  const options = {
    useNewUrlParser: true
  };
  const url =
    process.env.NODE_ENV === "production"
      ? config.get("db_host_prod")
      : config.get("db_host_dev");

  mongoose
    .connect(url, options)
    .then(() => {
      winston.info("connected to database.");

      // init Fawn
      Fawn.init(mongoose);
    })
    .catch(() => {
      winston.error("could not connect to mongodb...");
    });
};

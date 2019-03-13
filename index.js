const express = require("express");
let winston = require("winston");
const cors = require("cors");

const app = express();

app.use(express.json());

const corsOptions = {
  exposedHeaders: "Content-Disposition"
};

app.use(cors(corsOptions));

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3090;
app.listen(port, () => {
  winston.info(`server started on port: ${port}`);
});

// environment
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// importing modules
const cors = require("cors");
const express = require("express");
const config = require("./config");
const routes = require("./routes");

// initializations
const app = express();
require("./config/mongo")();

// settings
app.set("env", config.env);
app.set("host", config.host);
app.set("port", config.port);
app.disable("x-powered-by");

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// route implementations
app.use("/api", routes);

// starting the server
app.listen(app.get("port"), app.get("host"), () => console.log(`Server running on ${app.get("host")}:${app.get("port")} in ${app.get("env")} mode`));
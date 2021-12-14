const mongoose = require("mongoose");

const connect = () => mongoose
    .connect(process.env.DB_URI)
    .then(db => console.log("database is connected"))
    .catch(err => console.error(err));

module.exports = connect;
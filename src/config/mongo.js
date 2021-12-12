const mongoose = require("mongoose");

const URI = process.env.DB_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

const connect = () => mongoose.connect(URI, options)
    .then(db => console.log("database is connected"))
    .catch(err => console.error(err));

module.exports = connect;
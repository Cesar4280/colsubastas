const { connect } = require("mongoose");

const mongodb = () => connect(process.env.DB_URI)
    .then(mongoose => console.log("Database is connected"))
    .catch(error => console.error(error));

module.exports = mongodb;
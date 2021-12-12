const { notFound, internalError } = require("../helpers/response")

exports.validId = (err, req, res, next) => {
    console.log("En middleware validId -> " + err);
    if (err.name === "CastError") return notFound(res, "Formato invalido de ID");
    internalError(res);
};
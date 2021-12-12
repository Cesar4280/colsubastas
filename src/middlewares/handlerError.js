const { notFound, internalError } = require("../helpers/response")

exports.getOneById = (error, request, response, next) => {
    console.log("En middleware getOneById -> " + error);
    if (error.name === "CastError") return notFound(response, "Formato invalido de ID");
    internalError(response);
};
const { notFound, internalError } = require("../helpers/response");

exports.catchError = (error, request, response, next) => error.name === "CastError" ?
    notFound(response, "Id enviado no cumple la PSI") : internalError(res);
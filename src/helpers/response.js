const { getISOFormat } = require("./datetime");

const httpResponse = (code = 200, status = "Ok", message = "success", body) => {
    const response = { code, status, message, responseTime: getISOFormat() };
    if (Boolean(body)) response.data = body;
    return response;
}

exports.success = (response, message, body) => {
    response.json(httpResponse(200, "Ok", message, body));
};

exports.created = (response, message, body) => {
    response.status(201).json(httpResponse(201, "Created", message, body));
};

exports.internalError = (response) => {
    response.status(500).json(httpResponse(500, "Internal Server Error", "Servicio inactivo por el momento"));
};

exports.notFound = (response, message) => {
    response.status(404).json(httpResponse(404, "Not Found", message));
};

exports.conflict = (response, message) => {
    response.status(409).json(httpResponse(409, "Conflict", message));
};

exports.unauthorized = (response, message) => {
    response.status(401).json(httpResponse(401, "Unauthorized", message));
};

exports.forbidden = (response, message) => {
    response.status(403).json(httpResponse(403, "Forbidden", message));
};

exports.badRequest = (response, message) => {
    response.status(400).json(httpResponse(400, "Bad Request", message));
};
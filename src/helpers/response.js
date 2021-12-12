const { getISOFormat } = require("./datetime");

exports.success = (response, message, body) => {
    response.json({
        code: 200,
        status: "Ok",
        data: body,
        message,
        responseTime: getISOFormat()
    });
};

exports.created = (response, message, body) => {
    const JSON = { code: 201, status: "Created", message, responseTime: getISOFormat() };
    if (body !== undefined) Object.assign(JSON, { data: body });
    response.status(201).json(JSON);
};

exports.internalError = (response) => {
    response.status(500).json({
        code: 500,
        status: "Internal Server Error",
        message: "Servicio inactivo por el momento",
        responseTime: getISOFormat()
    });
};

exports.notFound = (response, message) => {
    response.status(404).json({
        code: 404,
        status: "Not Found",
        message,
        responseTime: getISOFormat()
    });
};

exports.conflict = (response, message) => {
    response.status(409).json({
        code: 409,
        status: "Conflict",
        message,
        responseTime: getISOFormat()
    });
};

exports.unauthorized = (response, message) => {
    response.status(401).json({
        code: 401,
        status: "Unauthorized",
        message,
        responseTime: getISOFormat()
    });
};

exports.forbidden = (response, message) => {
    response.status(403).json({
        code: 403,
        status: "Forbidden",
        message,
        responseTime: getISOFormat()
    });
};

exports.badRequest = (response, message) => {
    response.status(400).json({
        code: 400,
        status: "Bad Request",
        message,
        responseTime: getISOFormat()
    });
};
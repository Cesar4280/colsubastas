const { getISOFormat } = require("./datetime");

const status = new Map([
    [200, "Ok"],          [201, "Created"],
    [400, "Bad Request"], [401, "Unauthorized"],
    [403, "Forbidden"],   [404, "Not Found"],
    [409, "Conflict"],    [500, "Internal Server Error"]
]);

const jsonObject = (code, message, data) => {
    const json = { code, status: status.get(code), message, responseTime: getISOFormat() };
    return data === undefined ? json : Object.assign(json, { data });
};

module.exports = function (response, code, message, body) {
    response.status(code).json(jsonObject(code, message, body));
};
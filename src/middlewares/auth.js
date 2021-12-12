const { userModel } = require("../models");
const { jwt, string, response } = require("../helpers");

exports.checkAuth = (req, res, next) => {
    try {
        const bearerHeader = req.get("Authorization");
        if (bearerHeader === undefined) return response.unauthorized(res, "Token no proporcionado");
        if (!string.startsWith(bearerHeader, "bearer")) return response.unauthorized(res, "Token invalido");
        req.tokenSession = bearerHeader.substring(7);
        next();
    } catch (error) {
        console.log(error);
        response.internalError(res);
    }
}

exports.checkRoleAuth = roles => async (req, res, next) => {
    try {
        const payload = await jwt.verifyToken(req.tokenSession);
        if (payload === null) return response.unauthorized(res, "Token invalido");
        const valid = roles.some(role => string.startsWith(payload.role, role));
        if (!valid) return response.forbidden(res, "Prohibido acceder al recurso");
        next();
    } catch (error) {
        console.log(error);
        response.internalError(res);
    }
}

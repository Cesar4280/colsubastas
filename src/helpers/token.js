const jwt = require("jsonwebtoken");

const { secret } = require("../config");
const { expiration } = require("../helpers/datetime");

exports.tokenSign = async data => { // { _id: data.USUARIO_ID, role: data.ROL_USUARIO_ID }
    return await jwt.sign(data, secret, { expiresIn: expiration });
};

exports.verifyToken = async token => {
    let data = null;
    try {
        data = await jwt.verify(token, secret);
    } catch (error) {
        console.log(error);
    }
    return data;
};
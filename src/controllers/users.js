const { User } = require("../models");
const { httpResponse } = require("../helpers");
const { isValidObjectId } = require("mongoose");

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!isValidObjectId(id)) return httpResponse(res, 400, "Id enviado no cumple la PSI");
        const user = await User.findById(id);
        return user === null ?
            httpResponse(res, 404, "Usuario no encontrado") :
            httpResponse(res, 200, "Usuario encontrado", user);
    } catch (err) {
        console.log(err);
        httpResponse(res, 500, "Servicio inactivo por el momento");
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        httpResponse(res, 200, "Listado de usuarios", users);
    } catch (err) {
        console.log(err);
        httpResponse(res, 500, "Algo ha ido mal en el servidor");
    }
};

exports.addUser = async (req, res) => {
    try {
        const data = [409, "Nombre de usuario ya registrado"];
        const { document, birthdate } = req.body;
        const { issue_date } = document;
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            birthdate: new Date(birthdate),
            document: {
                _type: document._type,
                number: document.number,
                issue_date: new Date(issue_date)
            },
            active: true
        });
        user.password = await user.encryptPassword(user.password);
        let exist = await User.findOne({ username: user.username })
        if (exist !== null) return httpResponse(res, ...data);
        data[1] = data[1].replace("Nombre de usuario", "Correo electronico");
        exist = await User.findOne({ email: user.email });
        if (exist !== null) return httpResponse(res, ...data);
        data[1] = data[1].replace("Correo electronico", "Número de documento");
        exist = await User.findOne({ "document.number": user.document.number });
        if (exist !== null) return httpResponse(res, ...data);
        await user.save();
        httpResponse(res, 201, "Usuario agregado al sistema", user);
    } catch (err) {
        console.log(err);
        httpResponse(res, 500, "Ocurrio un problema en el servidor");
    }
};
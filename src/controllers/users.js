const { User } = require("../models");
const { httpResponse } = require("../helpers");
const { isValidObjectId } = require("mongoose");

exports.getUser = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const user = await User.findById(id);
        return user === null ?
            httpResponse(response, 404, "Usuario no encontrado") :
            httpResponse(response, 200, "Usuario encontrado", user);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Servicio inactivo en el momento");
    }
};

exports.getUsers = async (request, response) => {
    try {
        const users = await User.find();
        httpResponse(response, 200, "Listado de usuarios", users);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Algo ha ido mal en el servidor");
    }
};

exports.addUser = async (request, response) => {
    try {
        const { document, birthdate } = request.body;
        const { issue_date } = document;
        const user = new User({
            name: request.body.name,
            email: request.body.email,
            username: request.body.username,
            password: request.body.password,
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
        const content = [response, 409, "Nombre de usuario ya registrado"];
        if (exist !== null) return httpResponse(...content);
        content[2] = "Correo electrónico ya registrado";
        exist = await User.findOne({ email: user.email });
        if (exist !== null) return httpResponse(...content);
        content[2] = "Número de documento ya registrado";
        exist = await User.findOne({ "document.number": user.document.number });
        if (exist !== null) return httpResponse(...content);
        await user.save();
        httpResponse(response, 201, "Usuario agregado al sistema", user);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};
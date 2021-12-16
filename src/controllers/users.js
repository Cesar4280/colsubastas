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
        const { document, birthdate, role } = request.body;
        const { issue_date } = document;
        const user = new User({
            name:       request.body.name,
            email:      request.body.email,
            username:   request.body.username,
            password:   request.body.password,
            birthdate:  new Date(birthdate),
            document: {
                _type:      document._type,
                number:     document.number,
                issue_date: new Date(issue_date)
            },
            role:   role ?? "user",
            active: true
        });
        const message = await User.checkUser(user);
        if (message !== "") return httpResponse(response, 409, message);
        user.password = await user.encryptPassword(user.password);
        await user.save();
        httpResponse(response, 201, "Usuario agregado al sistema", user);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};

exports.signIn = async (request, response) => {
    const { username, password } = request.body;
    const user = await User.findOne({ username });
    const message = "Usuario o contraseña incorrectas";
    if (user === null) return httpResponse(response, 404, message);
    const valid = await user.matchPassword(password);
    if (valid) return httpResponse(response, 200, "Estas autenticado", user);
    httpResponse(response, 404, message);
};
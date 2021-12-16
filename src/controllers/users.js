const { User } = require("../models");
const { httpResponse } = require("../helpers");
const { isValidObjectId } = require("mongoose");

exports.getUser = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const user = await User.findOne({ _id: id, active: true });
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
        const users = await User.find({ active: true });
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
    try {
        const { username, password } = request.body;
        const message = "Usuario o contraseña incorrectas";
        const user = await User.findOne({ username, active: true });
        if (user === null) return httpResponse(response, 404, message);
        const valid = await user.matchPassword(password);
        if (valid) return httpResponse(response, 200, "Estas autenticado", user);
        httpResponse(response, 404, message);
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};

exports.updateUser = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const user = await User.findOne({ _id: id, active: true });
        if (user === null) return httpResponse(response, 404, "Usuario no encontrado");
        const { name, email, username, password, birthdate, document } = request.body;
        const { _type, number, issue_date } = document;
        if(Boolean(name))       user.name = name;
        if(Boolean(email))      user.email = email;
        if(Boolean(username))   user.username = username;
        if(Boolean(birthdate))  user.birthdate = new Date(birthdate);
        if(Boolean(_type))      user.document._type = _type;
        if(Boolean(number))     user.document.number = number;
        if(Boolean(issue_date)) user.document.issue_date = new Date(issue_date) ;
        if(Boolean(password))   user.password = await user.encryptPassword(password);
        await user.save();
        httpResponse(response, 200, "Usuario actualizado");
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};

exports.deleteUser = async (request, response) => {
    try {
        const { id } = request.params;
        if (!isValidObjectId(id)) return httpResponse(response, 400, "Id enviado no cumple la PSI");
        const user = await User.findOne({ _id: id, active: true });
        if (user === null) return httpResponse(response, 404, "Usuario no encontrado");
        user.active = false;
        await user.save();
        httpResponse(response, 200, "Usuario eliminado");
    } catch (error) {
        console.log(error);
        httpResponse(response, 500, "Ocurrio un problema en el servidor");
    }
};
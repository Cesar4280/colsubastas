const { User } = require("../models");
const { response } = require("../helpers");

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        if (user === null) response.notFound(res, "Usuario no encontrado");
        response.success(res, "Usuario encontrado", user);
    } catch (error) {
        console.log(error);
        response.internalError(res);
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ username: "asc" });
        response.success(res, "Listado de usuarios", users);
    } catch (error) {
        console.log(error);
        response.internalError(res);
    }
};

exports.addUser = async (req, res) => {
    try {
        const { document, birthdate } = req.body;
        const { issue_date } = document;
        const user = new User({
            name:      req.body.name, 
            email:     req.body.email, 
            username:  req.body.username, 
            password:  req.body.password, 
            birthdate: new Date(birthdate),
            document: {
                _type:      document._type,
                number:     document.number,
                issue_date: new Date(issue_date)
            }
        });
        user.password = await user.encryptPassword(user.password); 
        await user.save();
        response.created(res, "Usuario agregado al sistema", user);
    } catch (error) {
        console.log(error);
        response.internalError(res);
    }
};
const router = require("express").Router();
const { userController: controller } = require("../controllers");

router.get("/", controller.getUsers);         //NOTE: todos los usuarios
router.get("/:id", controller.getUser);       //NOTE: un usuario por id
router.post("/", controller.signUp);          //NOTE: agregar un usuario
router.put("/:id", controller.updateUser)     //NOTE: actualizar un usuario
router.post("/login", controller.signIn)      //NOTE: inicio de sesión
router.delete("/:id", controller.removeUser); //NOTE: eliminar un usuario

module.exports = router;
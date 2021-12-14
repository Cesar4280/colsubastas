const router = require("express").Router();
const { userController: controller } = require("../controllers");

router.get("/", controller.getUsers);   // todos los usuarios
router.get("/:id", controller.getUser); // un usuario por id
router.post("/", controller.addUser);   // agregar un usuario

module.exports = router;
const router = require("express").Router();
const { getOneById } = require("../middlewares/handlerError");
const { userController: controller } = require("../controllers");

router.get("/", controller.getUsers);   // todos los usuarios
router.get("/:id", controller.getUser); // un usuario por id
router.post("/", controller.addUser);   // agregar un usuarios

router.use(getOneById);

module.exports = router;
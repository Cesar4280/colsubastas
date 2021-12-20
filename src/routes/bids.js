const router = require("express").Router();
const { bidController: controller } = require("../controllers");

router.get("/", controller.getProducts);         //NOTE: todos los productos
router.get("/:id", controller.getProduct);       //NOTE: un producto por id
router.post("/", controller.addBid);             //NOTE: agregar una puja
router.put("/:id", controller.updateProduct)     //NOTE: actualizar un producto
router.delete("/:id", controller.removeProduct); //NOTE: eliminar un producto

module.exports = router;
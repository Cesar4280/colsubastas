const router = require("express").Router();
const { bidController: controller } = require("../controllers");

router.get("/", controller.getBids);             //NOTE: todas los pujas
router.get("/:id", controller.getBid);           //NOTE: una puja por id
router.get("/:id/winner", controller.getWinner); //NOTE: una puja por id
router.post("/", controller.addBid);             //NOTE: agregar una puja
router.put("/:id", controller.updateProduct);    //NOTE: actualizar una puja
router.patch("/:id", controller.addContestant);  //NOTE: actualizar una puja
router.delete("/:id", controller.removeProduct); //NOTE: eliminar una puja
router.delete("/:id/user/:_id", controller.removeContestant); //NOTE: eliminar una puja

module.exports = router;
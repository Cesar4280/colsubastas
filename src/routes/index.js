const userRoutes = require("./users");
const { validId } = require("../middlewares/handlerError");

/*
const saleRoutes = require("./sales");
const dressRoutes = require("./dresses");
*/

const router = require("express").Router();

router.use("/users", userRoutes);

router.use(validId);

/*
router.use("/sales", saleRoutes);
router.use("/dresses", dressRoutes);
*/

module.exports = router;
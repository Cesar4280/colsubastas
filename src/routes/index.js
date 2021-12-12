const userRoutes = require("./users");
const { getOneById } = require("../middlewares/handlerError");

/*
const saleRoutes = require("./sales");
const dressRoutes = require("./dresses");
*/

const router = require("express").Router();

router.use("/users", userRoutes);

router.use(getOneById);

/*
router.use("/sales", saleRoutes);
router.use("/dresses", dressRoutes);
*/

module.exports = router;
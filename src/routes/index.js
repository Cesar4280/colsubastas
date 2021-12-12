const userRoutes = require("./users");

/*
const saleRoutes = require("./sales");
const dressRoutes = require("./dresses");
*/

const router = require("express").Router();

router.use("/users", userRoutes);

/*
router.use("/sales", saleRoutes);
router.use("/dresses", dressRoutes);
*/

module.exports = router;
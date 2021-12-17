const userRoutes = require("./users");
const productRoutes = require("./products");

/*
const saleRoutes = require("./sales");
const dressRoutes = require("./dresses");
*/

const router = require("express").Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);

/*
router.use("/sales", saleRoutes);
router.use("/dresses", dressRoutes);
*/

module.exports = router;
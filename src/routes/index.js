const bidRoutes = require("./bids");
const userRoutes = require("./users");
const productRoutes = require("./products");

const router = require("express").Router();

router.use("/bids", bidRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);

module.exports = router;
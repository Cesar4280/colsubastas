const userRoutes = require("./users");
const productRoutes = require("./products");

// const saleRoutes = require("./sales");

const router = require("express").Router();

router.use("/users", userRoutes);
router.use("/products", productRoutes);

// router.use("/sales", saleRoutes);

module.exports = router;
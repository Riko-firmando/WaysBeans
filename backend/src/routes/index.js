const express = require("express");

const router = express.Router();

const {
  register,
  login,
  checkAuth,
  validation,
} = require("../controllers/auth");
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const {
  getCarts,
  addCart,
  updateCart,
  deleteCart,
} = require("../controllers/cart");

const { addOrder } = require("../controllers/order");

const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  userTransactions,
} = require("../controllers/transaction");

// middleware
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");
const { updateFile } = require("../middlewares/updateFile");

// auth
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);
router.post("/validation", validation);

// product
router.post("/product", auth, uploadFile("photo"), addProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.patch("/product/:id", auth, updateFile("photo"), updateProduct);
router.delete("/product/:id", auth, deleteProduct);

// cart
router.get("/carts", auth, getCarts);
router.post("/cart", auth, addCart);
router.patch("/cart/:id", auth, updateCart);
router.delete("/cart/:id", auth, deleteCart);

// order
router.post("/order", addOrder);

// transaction
router.get("/transactions", auth, getTransactions);
router.post("/transaction", auth, uploadFile("attachment"), addTransaction);
router.patch("/transaction/:id", auth, updateTransaction);
router.delete("/transaction/:id", auth, deleteTransaction);
router.get("/my-transactions", auth, userTransactions);

module.exports = router;

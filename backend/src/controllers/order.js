const { order } = require("../../models");

exports.addOrder = async (req, res) => {
  try {
    await order.create({
      productID: req.body.productID,
      transactionID: req.body.transactionID,
      qty: req.body.qty,
    });

    res.send({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

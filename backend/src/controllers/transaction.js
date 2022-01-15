const { transaction, user, order, product } = require("../../models");

exports.getTransactions = async (req, res) => {
  try {
    let data = await transaction.findAll({
      attributes: {
        exclude: ["updatedAt", "userID"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "phone", "role"],
          },
        },
        {
          model: order,
          as: "orders",
          attributes: {
            exclude: ["createdAt", "updatedAt", "productID", "transactionID"],
          },
          include: {
            model: product,
            as: "product",
            attributes: {
              exclude: ["createdAt", "updatedAt", "userID"],
            },
          },
        },
      ],
    });

    res.send({
      status: "success",
      transactions: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { id } = req.user;
    const body = req.body;
    const newData = await transaction.create({
      userID: id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      codePos: req.body.codePos,
      attachment: req.file.filename,
      status: "Waiting Approve",
    });

    const data = await transaction.findOne({
      where: {
        id: newData.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userID"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "photo", "status"],
          },
        },
        {
          model: order,
          as: "orders",
          attributes: {
            exclude: ["createdAt", "updatedAt", "productID", "transactionID"],
          },
          include: {
            model: product,
            as: "product",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });
    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await transaction.update(req.body, {
      where: {
        id,
      },
    });
    const newData = await transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userID"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "photo", "status"],
          },
        },
        {
          model: order,
          as: "orders",
          attributes: {
            exclude: ["createdAt", "updatedAt", "productID", "transactionID"],
          },
          include: {
            model: product,
            as: "product",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });

    res.send({
      status: "success",
      message: "update transaction finished",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await transaction.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: "success",
      message: `delete transaction with id = ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

// user transactions
exports.userTransactions = async (req, res) => {
  try {
    const { id } = req.user;

    let data = await transaction.findAll({
      where: {
        userID: id,
      },
      attributes: {
        exclude: ["updatedAt", "userID"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: order,
          as: "orders",
          attributes: {
            exclude: ["createdAt", "updatedAt", "transactionID", "productID"],
          },
          include: {
            model: product,
            as: "product",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });

    const path = "http://localhost:5000/uploads/";

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        photo: path + item.orders[0].product.photo,
      };
    });

    let subtotal = 0;
    let qty;
    data = data.map((transaction) => {
      subtotal = 0;
      qty = 0;
      transaction.orders.map((order) => {
        subtotal += order.product.price * order.qty;
        qty += order.qty;
      });
      return {
        ...transaction,
        subtotal,
        totalQty: qty,
      };
    });

    res.send({
      status: "success",
      transactions: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

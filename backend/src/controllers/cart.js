const { cart, user, product } = require("../../models");

exports.getCarts = async (req, res) => {
  try {
    const { id } = req.user;
    let data = await cart.findAll({
      where: {
        userID: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userID"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "status", "id"],
          },
        },
        {
          model: product,
          as: "product",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
          },
        },
      ],
    });

    const path = "http://localhost:5000/uploads/";

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        photo: path + item.product.photo,
      };
    });

    res.status(200).send({
      status: "success",
      carts: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.addCart = async (req, res) => {
  try {
    const { id } = req.user;
    const data = req.body;

    await cart.create({
      ...data,
      userID: id,
    });

    res.status(202).send({
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

exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await cart.update(data, {
      where: {
        id,
      },
    });

    const mycart = await cart.findOne({
      where: {
        id,
      },
    });

    res.status(202).send({
      message: "success",
      cart: mycart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    await cart.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `cart with id = ${id} have been delete`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

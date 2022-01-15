const fs = require("fs");

const { product } = require("../../models");

exports.addProduct = async (req, res) => {
  try {
    const newData = req.body;

    const data = await product.create({ ...newData, photo: req.file.filename });

    const newProduct = await product.findOne({
      where: {
        id: data.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "success",
      product: newProduct,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let data = await product.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const path = "http://localhost:5000/uploads/";

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        photo: path + item.photo,
      };
    });

    res.send({
      status: "success",
      products: data,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const path = "http://localhost:5000/uploads/";

    data.photo = path + data.photo;

    res.send({
      status: "success",
      product: data,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const oldData = await product.findOne({
      where: {
        id,
      },
    });
    if (req.file) {
      const path = "./uploads/";
      oldData.photo = path + oldData.photo;
      fs.unlink(oldData.photo, (err) => {
        if (err) throw err;
        console.log("file was deleted");
      });
      await product.update(
        { ...data, photo: req.file.filename },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await product.update(
        { ...data, photo: oldData.photo },
        {
          where: {
            id,
          },
        }
      );
    }

    res.send({
      status: "success",
      message: "product have been updated",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = await product.findOne({
      where: {
        id,
      },
    });

    const path = "./uploads/";
    oldData.photo = path + oldData.photo;
    fs.unlink(oldData.photo, (err) => {
      if (err) throw err;
      console.log("file was deleted");
    });

    await product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "product have been deleted",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

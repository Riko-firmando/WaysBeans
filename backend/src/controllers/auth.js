const { user } = require("../../models");

// bcrypt package
const bcrypt = require("bcrypt");

// joi package
const joi = require("joi");

const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.required": "email is required",
      "string.email": "must be a valid email",
      "string.empty": "email is required",
    }),
    password: joi.string().required().min(4).messages({
      "string.required": "password is required",
      "string.min": "password must be at least 4 characters",
      "string.empty": "password is required",
    }),
    fullname: joi.string().required().min(4).messages({
      "string.required": "name is required",
      "string.empty": "name is required",
      "string.min": "name must be at least 4 characters ",
    }),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.send({
      status: "failed",
      message: error.details[0].message,
    });
  }
  try {
    // we generate salt (random value) with 10 rounds
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const createdData = await user.create({
      email: req.body.email,
      password: hashedPassword,
      fullname: req.body.fullname,
      status: "customer",
      photo: "profile.png",
    });

    const userData = await user.findOne({
      where: {
        id: createdData.id,
      },
    });

    const SECRET_KEY = "waysbeans-batch28";
    const payload = {
      id: userData.id,
      email: userData.email,
      fullname: userData.fullname,
      status: userData.status,
    };

    const token = jwt.sign(payload, SECRET_KEY);
    return res.status(200).send({
      status: "success",
      message: "user have been register",
      user: {
        email: createdData.email,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      "string.empty": `email is required `,
      "any.required": `email is required `,
      "string.email": "must be a valid email",
    }),
    password: joi.string().min(4).required().messages({
      // "string.min": `Password must be at least 4 characters`,
      "string.empty": `password is required `,
      "string.required": `password is required `,
      "string.min": `password must be at least 4 characters`,
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.send({
      status: "failed",
      message: error.details[0].message,
    });
  }
  try {
    const { email, password } = req.body;
    const userData = await user.findOne({
      where: {
        email,
      },
    });

    if (!userData) {
      return res.send({
        status: "failed",
        message: "email & password not match",
      });
    }

    const isMatching = await bcrypt.compare(password, userData.password);
    if (!isMatching) {
      return res.send({
        status: "failed",
        message: "email & password not match",
      });
    }

    const SECRET_KEY = "waysbeans-batch28";
    const payload = {
      id: userData.id,
      email: userData.email,
      fullname: userData.fullname,
      status: userData.status,
    };

    const token = jwt.sign(payload, SECRET_KEY);

    res.send({
      status: "success",
      message: "Login success",
      user: {
        email: userData.email,
        token,
        status: userData.status,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    let data = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!data) {
      res.status(404).send({
        status: "failed",
        message: "no user data",
      });
    }

    const path = "http://localhost:5000/uploads/";

    data.photo = path + data.photo;

    res.status(200).send({
      status: "success",
      user: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.validation = async (req, res) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required().empty().messages({
        "string.email": "must be a valid email",
        "string.required": "email is required",
        "string.empty": "email is required",
      }),
      password: joi.string().required().min(4).messages({
        "string.required": "password is required",
        "string.empty": "password is required",
        "string.min": "password must be at least 4 characters",
      }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.send({
        status: "failed",
        message: error.details[0].message,
      });
    }

    return res.send({
      status: "success",
      message: "",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

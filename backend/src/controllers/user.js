const { user } = require("../../models/user");

exports.updateUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: " server error",
    });
  }
};

const createProductController = (req, res) => {
  console.log(req.body);

  return res.send({
    message: "ok",
    status: 2000,
  });
};

module.exports = { createProductController };

// const { verifyUser, verifyToken } = require("../utils/verifyToken.js");
module.exports = app => {
  const controller = require("../controllers/controller.js");

  var router = require("express").Router();

  // Create a new Spot
  router.get("/emailSend", controller.emailHome);


  app.use("/api", router);
};

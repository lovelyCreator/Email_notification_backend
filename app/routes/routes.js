// const { verifyUser, verifyToken } = require("../utils/verifyToken.js");
module.exports = app => {
  const controller = require("../controllers/controller.js");

  var router = require("express").Router();

  // Create a new Spot
  router.post("/emailSend", controller.emailHome);
  router.get("/unset", controller.unset)


  app.use("/api", router);
};

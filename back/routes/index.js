const express = require("express");

const authRouter = require("./auth.routes");
const taskRouter = require("./task.routes");
const isAuth = require("../middleware/auth.middleware");

const mainRouter = express.Router();


mainRouter.use("/task", isAuth, taskRouter);
mainRouter.use(authRouter);

module.exports = mainRouter;
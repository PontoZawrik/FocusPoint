const express = require("express");
const controllers = require("../controllers");
const taskRouter = express.Router();


taskRouter.get("/get-user-data", controllers.getUserData);
taskRouter.post("/add", controllers.add);
taskRouter.delete("/:id", controllers.delete);

module.exports = taskRouter;
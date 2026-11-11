const express = require("express");
const controllers = require("../controllers");
const productRouter = express.Router();


productRouter.get("/by-id/:id", controllers.getById);
productRouter.get("/get-user-data", controllers.getUserData);
productRouter.post("/add", controllers.add);
productRouter.put("/:id", controllers.update);
productRouter.delete("/:id", controllers.delete);

module.exports = productRouter;

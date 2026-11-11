const express = require("express")
const controllers = require("../controllers")

const isAuth = require("../middleware/auth.middleware")
const router = express.Router()

router.post("/login", controllers.login)
router.get("/logout", isAuth, controllers.logout)

router.get("/auth", isAuth, controllers.auth)

module.exports = router;
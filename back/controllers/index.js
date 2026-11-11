const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { jwtSecret, jwtExpiresIn } = require("../config")
const rep = require("../repository")


module.exports = {
  login: async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    try {
      const user = await rep.findUserByUsername(username);
      console.log(user);

      if (!user) {
        console.log("User not found:", username);
        return res
          .status(401)
          .send({ success: false, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res
          .status(401)
          .send({ success: false, message: "Invalid credentials" });
      }

      const payload = {
        username: user.username
      };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

      res.status(200).send({ success: true, token: token });
    } 
    catch (error) {
      console.error("Login error:", error);
      res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  },

  logout: async (req, res) => {
    res.status(200).send({
      success: true,
    })
  },

  auth: async (req, res) => {
    res.status(200).send({
      isAuthenticated: true,
    })
  },



  getUserData: async (req, res) => {
    res.json(await rep.getUserData(req.user.username));
  },

  add: async (req, res) => {
    const { name, description, priority, tags } = req.body;
    await rep.addProduct(req.user.username, { name, description, priority, tags });
    res.status(200).json({ success: true });
  },

  delete: async (req, res) => {
    const { id } = req.params;
    const result = await rep.deleteProduct(req.user.username, id);

    res.status(200).json({
      result,
    })
  },
};

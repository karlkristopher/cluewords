const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validateRegister = require("../validations/register");
const validateLogin = require("../validations/login");
const config = require("../config");

module.exports = {
  async register(req, res, next) {
    console.log("req.body", req.body);
    try {
      const { errors, isValid } = validateRegister(req.body);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          errors,
        });
      }

      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success: false,
          errors: { email: "Email already exists" },
        });
      }

      const newUser = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      });

      const payload = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      const token = jwt.sign(payload, config.secret);
      const hour = 3600000;
      res.cookie("token", token, {
        expires: new Date(Date.now() + hour * 24),
        httpOnly: true,
      });

      return res.status(201).json({
        token: token,
      });
    } catch (e) {
      return next(e);
    }
  },

  async login(req, res, next) {
    try {
      const { errors, isValid } = validateLogin(req.body);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          errors,
        });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: { email: "Email does not exist" },
        });
      }

      const isMatch = await user.comparePassword(req.body.password);
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImageLocation: user.profileImageLocation,
        };
        const token = jwt.sign(payload, config.secret);

        const hour = 3600000;
        res.cookie("token", token, {
          expires: new Date(Date.now() + hour * 24),
        });

        return res.status(200).json({
          token: token,
        });
      }

      return res.status(400).json({
        success: false,
        errors: { password: "Incorrect password" },
      });
    } catch (e) {
      return next(e);
    }
  },

  // Logout
  logout(req, res, next) {
    res.clearCookie("token");
    res.send({ message: "Logout successful" });
  },
};

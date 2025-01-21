const logger = require("../utils/logger");
const { validateRegistration } = require("../utils/validation");
const User = require("../models/userModel");

const register = async (req, res) => {
  logger.info("Registration endpoint reached");
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("validation Error ", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn("User already exists ");
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    user = new User({ username, email, password });
    await user.save();
    logger.info("User successfully created ");
  } catch (error) {}
};

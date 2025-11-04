const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.getJWT = function () {
  const user = this;

  const token = jwt.sign({ id: user._id }, process.env.jwtSecret);
  return token;
};
userSchema.methods.verifyPassword = async function (passwordByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isCorrect = await bcrypt.compare(passwordByUser, hashedPassword);
  return isCorrect;
};
module.exports = mongoose.model("User", userSchema);

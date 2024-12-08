const mongoose = require("mongoose");
const validator = require("validator");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter an Username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Enter an Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an Password"],
    minlength: [6, "Minimum Password length is 6 chracters"],
  },

});

// static validation for signup
userSchema.statics.signup = async function (username, email, password) {
  if (!username || !email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Enter an Valid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Enter a strong password");
  }
  const emailExist = await this.findOne({ email });
  if (emailExist) {
    throw Error("This email already exist");
  }
  const nameExist = await this.findOne({ username });
  if (nameExist) {
    throw Error("This Username already exist");
  }
  const user = await this.create({ username, email, password });
  return user;
};

// static validation for login
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

// for hashing password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

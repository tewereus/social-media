const mongoose = require("mongoose");
const argon2 = require("argon2");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.modified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      return next(error);
    }
  }
});

userSchema.methods.comparePassword = async function (currentPassword) {
  try {
    return argon2.verify(this.password, currentPassword);
  } catch (error) {
    throw error;
  }
};

userSchema.index({ username: "text" });

//Export the model
module.exports = mongoose.model("User", userSchema);

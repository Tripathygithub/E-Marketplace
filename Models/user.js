const mongoose = require("mongoose");
const passwordHash = require("password-hash");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
    },
    password:{
        type:String,
    },
    token: {
      type: String,
    },
    image: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (userPassword) {
  return passwordHash.verify(userPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

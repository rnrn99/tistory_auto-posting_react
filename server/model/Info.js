const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const saltRounds = 10;

const infoSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  appId: String,
  secretKey: String,
  redirectUri: String,
  code: String,
  accessToken: String,
});

// accessToken 암호화
infoSchema.pre("save", function (next) {
  var info = this;

  if (info.isModified("accessToken")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(info.accessToken, salt, function (err, hash) {
        if (err) return next(err);
        info.accessToken = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const Info = mongoose.model("Info", infoSchema);

module.exports = { Info };

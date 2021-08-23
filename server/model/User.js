const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 10,
  },
  userId: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 4,
  },
  role: {
    type: Number,
    default: 1,
  },
  token: String,
});

// 회원가입 전 비밀번호 암호화
userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, result) {
    if (err) return cb(err);
    else cb(null, result);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "eagles");

  user.token = token;

  user.save(function (err, user) {
    if (err) return cb(err);
    else cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, "eagles", function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };

const express = require("express");
const router = express.Router();
const { User } = require("../model/User");
const { auth } = require("../middleware/auth");

// 회원가입
router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, userInfo });
  });
});

// 로그인
router.post("/login", (req, res) => {
  User.findOne({ userId: req.body.userId }, (err, user) => {
    if (!user) {
      return res.json({
        success: false,
        message: "아이디가 존재하지 않습니다.",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          success: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ success: true, uniqueId: user._id });
      });
    });
  });
});

// 로그아웃
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? true : false,
    isAuth: true,
    name: req.user.name,
    userId: req.user.userId,
    role: req.user.role,
  });
});

module.exports = router;

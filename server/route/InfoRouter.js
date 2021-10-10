const express = require("express");
const router = express.Router();
const axios = require("axios");
const { Info } = require("../model/Info");

router.post("/addinfo", (req, res) => {
  const info = new Info(req.body);

  info.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

router.post("/getAccessToken", (req, res) => {
  axios
    .get("https://www.tistory.com/oauth/access_token?", {
      params: {
        client_id: req.body.appId,
        client_secret: req.body.secretKey,
        redirect_uri: req.body.redirectUri,
        code: req.body.code,
        grant_type: "authorization_code",
      },
    })
    .then((response) => {
      if (response) {
        return res.status(200).json({
          success: true,
          access_token: response.data.access_token,
        });
      }
    });
});

router.post("/getCategoryId", (req, res) => {
  axios
    .get("https://www.tistory.com/apis/category/list?", {
      params: {
        access_token: req.body.accessToken,
        output: "json",
        blogName: req.body.redirectUri,
      },
    })
    .then((response) => {
      let categories = response.data.tistory.item.categories;
      let length = response.data.tistory.item.categories.length;
      for (var i = 0; i < length; i++) {
        if (categories[i].name === req.body.category) {
          return res.status(200).json({
            success: true,
            categoryId: categories[i].id,
          });
        }
      }
    });
});

router.post("/getInfo", (req, res) => {
  Info.find({ user: req.body.uniqueId })
    .sort({ dateCreated: -1 })
    .populate("user")
    .exec((err, info) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, info });
    });
});

module.exports = router;

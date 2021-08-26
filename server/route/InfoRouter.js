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
      //   console.log(response.data.access_token);
      if (response) {
        return res.status(200).json({
          success: true,
          access_token: response.data.access_token,
        });
      }
    });
});

module.exports = router;

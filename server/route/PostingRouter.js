const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { getGameURL } = require("../scrape/scrape");
const config = require("../config/key");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiSecret,
  secure: true,
});

router.post("/getGameResult", (req, res) => {
  const month = req.body.month;
  const date = req.body.date;
  const teamCode = req.body.teamCode;
  console.log(req.body);

  getGameURL(month, date, teamCode);

  setTimeout(() => {
    //cloudinary 가서 사진 있으면 성공 없으면 실패
    cloudinary.v2.search
      .expression("posting")
      .execute()
      .then((response) => {
        if (response.total_count === 0) {
          return res.json({
            success: false,
          });
        }
        return res.status(200).json({ success: true });
      });
  }, 11000);
});

router.get("/getImage", (req, res) => {
  cloudinary.v2.search
    .expression("posting")
    .execute()
    .then((response) => {
      if (response.total_count === 0) {
        return res.json({
          success: false,
        });
      }
      let image = new Array();
      for (const i of response.resources) {
        image.push(i.filename);
      }

      return res.status(200).json({
        success: true,
        image: image.reverse(),
      });
    });
});

router.post("/posting", (req, res) => {
  // 글 포스팅
});

module.exports = router;

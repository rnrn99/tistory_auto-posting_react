const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { getGameURL } = require("../scrape/scrape");
const dir = "./upload";

router.post("/getGameResult", (req, res) => {
  const month = req.body.month;
  const date = req.body.date;
  const teamCode = req.body.teamCode;
  console.log(req.body);

  getGameURL(month, date, teamCode);

  setTimeout(() => {
    fs.readdir(dir, (err, files) => {
      console.log(files);
      if (files) {
        return res.status(200).json({
          success: true,
          image: files.reverse(),
        });
      } else {
        return res.status(400).json({
          success: false,
        });
      }
    });
  }, 7000);
});

router.post("/getReplacer", (req, res) => {
  let file = req.body.image;
  let formData = new FormData();
  formData.append("uploadedfile", fs.createReadStream(dir + "/" + file));
  axios
    .post("https://www.tistory.com/apis/post/attach?", formData, {
      headers: {
        ...formData.getHeaders(),
      },
      params: {
        access_token: req.body.accessToken,
        blogName: req.body.redirectUri,
        output: "json",
      },
    })
    .then((response) => {
      return res.status(200).json({
        success: true,
        filename: file,
        replacer: response.data.tistory.replacer,
      });
    });
});

router.post("/posting", (req, res) => {
  // 글 포스팅
});

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const { getGameURL } = require("../scrape/scrape");
const dir = "./server/scrape/image";

router.post("/getGameResult", (req, res) => {
  const month = req.body.month;
  const date = req.body.date;
  const teamCode = req.body.teamCode;
  console.log(req.body);

  getGameURL(month, date, teamCode);

  setTimeout(() => {
    fs.readdir(dir, (err, files) => {
      if (files) {
        return res.status(200).json({
          success: true,
          image: files,
        });
      } else {
        return res.status(400).json({
          success: false,
        });
      }
    });
  }, 5000);
});

module.exports = router;

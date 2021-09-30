const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getGameURL } = require("../scrape/scrape");

router.post("/getGameResult", (req, res) => {
  const month = req.body.month;
  const date = req.body.date;
  const teamCode = req.body.teamCode;

  getGameURL(month, date, teamCode);

  return res.status(200).json({
    success: true,
  });
});

module.exports = router;

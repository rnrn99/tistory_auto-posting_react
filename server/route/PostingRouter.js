const express = require("express");
const router = express.Router();
const axios = require("axios");
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
  }, 20000);
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
  let image = req.body.image;

  const keyEnter = '<h3 data-ke-size="size23">&nbsp;</h3>';
  let content = "";

  content =
    '<p style="text-align: right;" data-ke-size="size16">이 글은 프로그램에 의해 자동으로 업로드된 글입니다.</p>';
  content += keyEnter + keyEnter;

  if (image.length === 8) {
    // DH 경기 있는 날
    for (var i = 0; i < 2; i++) {
      content += `<h3 data-ke-size="size23">${i + 1}차전 경기 결과</h3>`;
      content += '<p data-ke-size="size14">&nbsp;</p>';
      content += `<img src="https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/${
        image[i * 4]
      }"></img>`;
      content += keyEnter;

      content += `<h3 data-ke-size="size23">${i + 1}차전 기록 그래프</h3>`;
      content += '<p data-ke-size="size14">&nbsp;</p>';
      content += `<img src="https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/${
        image[i * 4 + 1]
      }"></img>`;
      content += keyEnter;

      content += `<h3 data-ke-size="size23">${i + 1}차전 선수단 기록</h3>`;
      content += '<p data-ke-size="size14">&nbsp;</p>';
      content += `<img src="https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/${
        image[i * 4 + 2]
      }"></img>`;
      content += `<img src="https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/${
        image[i * 4 + 3]
      }"></img>`;
      content += keyEnter;
    }
  } else {
    content += `<h3 data-ke-size="size23">경기 결과</h3>`;
    content += '<p data-ke-size="size14">&nbsp;</p>';
    content += `<img src="https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/${image[0]}"></img>`;
    content += keyEnter;

    content += `<h3 data-ke-size="size23">기록 그래프</h3>`;
    content += '<p data-ke-size="size14">&nbsp;</p>';
    content += `<img src="https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/${image[1]}"></img>`;
    content += keyEnter;

    content += `<h3 data-ke-size="size23">선수단 기록</h3>`;
    content += '<p data-ke-size="size14">&nbsp;</p>';
    content += `<img src="https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/${image[2]}"></img>`;
    content += `<img src="https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/${image[3]}"></img>`;
    content += keyEnter;
  }

  content += keyEnter;
  content += `<h3 data-ke-size="size23">Comment</h3>`;
  content += '<p data-ke-size="size14">&nbsp;</p>';
  content += `<p data-ke-size="size16">${req.body.comment}</p>`;
  content += keyEnter;

  axios
    .post("https://www.tistory.com/apis/post/write?", {
      access_token: req.body.accessToken,
      output: "json",
      blogName: req.body.redirectUri,
      title: req.body.postingTitle,
      content: content,
      category: req.body.category,
      tag: req.body.tag,
      visibility: "3",
    })
    .then((response) => {
      if (response.data.tistory.status === "200") {
        // 블로그 업로드 후 cloudinary에 저장한 사진 삭제
        cloudinary.api.delete_resources_by_prefix(
          "posting/",
          function (result) {},
        );
        return res.status(200).json({
          success: true,
          url: response.data.tistory.url,
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
      return res.json({ success: false });
    });
});

module.exports = router;

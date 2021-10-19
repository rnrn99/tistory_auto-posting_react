const driver = require("selenium-webdriver");
const { By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("../config/key");
const cloudinary = require("cloudinary");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiSecret,
  secure: true,
});

let service = null;
let browser = null;

let teamName = "";
let link = new Array(); // 경기 결과 페이지 URL
let isDH = false; // 더블헤더 일정 유무

const enterPage = (link, month, date, teamCode) => {
  switch (teamCode) {
    case "NC":
      teamName = "NC";
      break;
    case "OB":
      teamName = "두산";
      break;
    case "KT":
      teamName = "KT";
      break;
    case "LG":
      teamName = "LG";
      break;
    case "WO":
      teamName = "키움";
      break;
    case "HT":
      teamName = "KIA";
      break;
    case "LT":
      teamName = "롯데";
      break;
    case "SS":
      teamName = "삼성";
      break;
    case "SK":
      teamName = "SSG";
      break;
    case "HH":
      teamName = "한화";
      break;
  }
  try {
    for (let i = 0; i < link.length; i++) {
      (function (x) {
        setTimeout(async () => {
          browser.get(link[x]);

          // 페이지 로딩 기다림
          await browser.wait(
            until.elementLocated(
              By.xpath(
                '//*[@id="content"]/div/div[2]/section[1]/div[2]/div[3]/div[1]/div[2]',
              ),
            ),
            2000,
          );

          setTimeout(async () => {
            // 홈, 원정 확인 & 승, 패 여부 확인 -> ex.한화승김민우
            let team = await browser
              .findElement(
                By.xpath(
                  '//*[@id="content"]/div/div[2]/section[1]/div[2]/div[3]/div[1]/div[2]',
                ),
              )
              .getText();

            // 경기 결과 이미지 저장
            await browser
              .findElement(By.className("Home_game_head__3EEZZ"))
              .takeScreenshot()
              .then((image) => {
                let uploadStream = cloudinary.v2.uploader.upload_stream({
                  public_id: `result_${month}${date}_${x}`,
                  folder: "posting",
                });
                let content = "data:image/png;base64," + image;

                streamifier.createReadStream(content).pipe(uploadStream);
              });

            // 경기 그래프 이미지 저장
            await browser
              .findElement(By.className("TeamVS_comp_team_vs__fpu3N"))
              .takeScreenshot()
              .then((image) => {
                let uploadStream = cloudinary.v2.uploader.upload_stream({
                  public_id: `recordGraph_${month}${date}_${x}`,
                  folder: "posting",
                });
                let content = "data:image/png;base64," + image;

                streamifier.createReadStream(content).pipe(uploadStream);
              });

            if (!team.includes(teamName)) {
              // 해당 팀 원정 경기

              // 야수 기록 이미지 저장
              await browser
                .findElements(By.className("PlayerRecord_table_area__1fIBC"))
                .then((record) => {
                  record[0].takeScreenshot().then((image) => {
                    let uploadStream = cloudinary.v2.uploader.upload_stream({
                      public_id: `playerRecord_${month}${date}_${x}`,
                      folder: "posting",
                    });
                    let content = "data:image/png;base64," + image;

                    streamifier.createReadStream(content).pipe(uploadStream);
                  });
                });

              // 투수 기록 이미지 저장
              await browser
                .findElements(By.className("PlayerRecord_table_area__1fIBC"))
                .then((record) => {
                  record[2].takeScreenshot().then((image) => {
                    let uploadStream = cloudinary.v2.uploader.upload_stream({
                      public_id: `pitcherRecord_${month}${date}_${x}`,
                      folder: "posting",
                    });
                    let content = "data:image/png;base64," + image;

                    streamifier.createReadStream(content).pipe(uploadStream);

                    if (x === link.length - 1) {
                      browser.quit();
                    }
                  });
                });
            } else {
              // 해당 팀 홈 경기

              // 야수 기록 이미지 저장
              await browser
                .findElements(By.className("PlayerRecord_table_area__1fIBC"))
                .then((record) => {
                  record[1].takeScreenshot().then((image) => {
                    let uploadStream = cloudinary.v2.uploader.upload_stream({
                      public_id: `playerRecord_${month}${date}_${x}`,
                      folder: "posting",
                    });
                    let content = "data:image/png;base64," + image;

                    streamifier.createReadStream(content).pipe(uploadStream);
                  });
                });

              // 투수 기록 이미지 저장
              await browser
                .findElements(By.className("PlayerRecord_table_area__1fIBC"))
                .then((record) => {
                  record[3].takeScreenshot().then((image) => {
                    let uploadStream = cloudinary.v2.uploader.upload_stream({
                      public_id: `pitcherRecord_${month}${date}_${x}`,
                      folder: "posting",
                    });
                    let content = "data:image/png;base64," + image;

                    streamifier.createReadStream(content).pipe(uploadStream);
                    if (x === link.length - 1) {
                      browser.quit();
                    }
                  });
                });
            }
          }, 1000);
        }, 2000 * x);
      })(i);
    }
  } catch (error) {
    if (error) {
      console.log("capture error");
      browser.quit();
    }
  }
};

exports.getGameURL = async (month, date, teamCode) => {
  service = new chrome.ServiceBuilder(config.chromedriverPath).build();
  chrome.setDefaultService(service);

  let options = new chrome.Options();

  if (process.env.NODE_ENV === "production") {
    options.setChromeBinaryPath(config.chromeBin);
  }

  options.addArguments("--headless");
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");
  options.addArguments("--start-fullscreen");
  options.addArguments([
    'user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"',
  ]);

  browser = new driver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  month = parseInt(month) > 9 ? month : "0" + month;
  date = parseInt(date) > 9 ? date : "0" + date;

  let url = `https://sports.news.naver.com/kbaseball/schedule/index?date=20210922&month=${month}&year=2021&teamCode=${teamCode}#`;
  browser.get(url);

  // 게임 테이블 가져오기
  let game = await browser.findElement(By.className("tb_wrap"));

  if (date % 2 === 0) {
    game = await game.findElements(By.className("sch_tb2"));
  } else {
    game = await game.findElements(By.className("sch_tb"));
  }

  // DH 일정 체크
  await game[parseInt((date - 1) / 2)]
    .findElements(By.css("tr"))
    .then((element) => {
      if (element.length > 1) {
        isDH = true;
      } else {
        isDH = false;
      }
    });

  // 원하는 게임의 결과 페이지 주소 가져오기
  if (!isDH) {
    game[parseInt((date - 1) / 2)]
      .findElement(By.className("td_btn"))
      .findElement(By.css("a"))
      .getAttribute("href")
      .then(function (href) {
        link.push(href);
        enterPage(link, month, date, teamCode);
      });
  } else {
    await game[parseInt((date - 1) / 2)]
      .findElements(By.className("td_btn"))
      .then(async function (links) {
        for (let i = 0; i < 2; i++) {
          let href = await links[i]
            .findElement(By.css("a"))
            .getAttribute("href");
          link.push(href);
        }
        enterPage(link, month, date, teamCode);
      });
  }
};

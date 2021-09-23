const driver = require("selenium-webdriver");
const { By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

const screen = {
  width: 1920,
  height: 1080,
};

const service = new chrome.ServiceBuilder(
  "server/scrape/chromedriver.exe",
).build();
chrome.setDefaultService(service);

const browser = new driver.Builder()
  .forBrowser("chrome")
  .setChromeOptions(new chrome.Options().headless().windowSize(screen))
  .build();

// 받아와야 할 데이터
let month = 9;
let date = 23;
const teamCode = "HH";
const teamName = "한화";

month = month > 9 ? month : "0" + String(month);
date = date > 9 ? date : "0" + String(date);

let link = new Array(); // 경기 결과 페이지 URL
let isDH = false; // 더블헤더 일정 유무
let isWin = false; // 승리 여부

const makeFolder = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const enterPage = (link) => {
  for (let i = 0; i < link.length; i++) {
    (function (x) {
      setTimeout(() => {
        browser.get(link[x]);

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
            .then((image, err) => {
              fs.writeFile(
                `./server/scrape/image/result_${month}${date}_${x}.png`,
                image,
                "base64",
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                },
              );
            });

          // 경기 그래프 이미지 저장
          await browser
            .findElement(By.className("TeamVS_comp_team_vs__fpu3N"))
            .takeScreenshot()
            .then((image, err) => {
              fs.writeFile(
                `./server/scrape/image/recodeGraph_${month}${date}_${x}.png`,
                image,
                "base64",
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                },
              );
            });

          if (!team.includes(teamName)) {
            // 해당 팀 원정 경기

            if (team.includes("투") || team.includes("승")) {
              isWin = false;
            } else {
              isWin = true;
            }

            // 야수 기록 이미지 저장
            await browser
              .findElements(By.className("PlayerRecord_table_area__1fIBC"))
              .then((record) => {
                record[0].takeScreenshot().then((image, err) => {
                  fs.writeFile(
                    `./server/scrape/image/playerRecord_${month}${date}_${x}.png`,
                    image,
                    "base64",
                    (err) => {
                      if (err) {
                        console.log(err);
                      }
                    },
                  );
                });
              });

            // 투수 기록 이미지 저장
            await browser
              .findElements(By.className("PlayerRecord_table_area__1fIBC"))
              .then((record) => {
                record[2].takeScreenshot().then((image, err) => {
                  fs.writeFile(
                    `./server/scrape/image/pitcherRecord_${month}${date}_${x}.png`,
                    image,
                    "base64",
                    (err) => {
                      if (err) {
                        console.log(err);
                      }
                    },
                  );
                });
              });
          } else {
            // 해당 팀 홈 경기
            if (team.includes("승")) {
              isWin = true;
            } else {
              isWin = false;
            }

            // 야수 기록 이미지 저장
            await browser
              .findElements(By.className("PlayerRecord_table_area__1fIBC"))
              .then((record) => {
                record[1].takeScreenshot().then((image, err) => {
                  fs.writeFile(
                    `./server/scrape/image/playerRecord_${month}${date}_${x}.png`,
                    image,
                    "base64",
                    (err) => {
                      if (err) {
                        console.log(err);
                      }
                    },
                  );
                });
              });

            // 투수 기록 이미지 저장
            await browser
              .findElements(By.className("PlayerRecord_table_area__1fIBC"))
              .then((record) => {
                record[3].takeScreenshot().then((image, err) => {
                  fs.writeFile(
                    `./server/scrape/image/pitcherRecord_${month}${date}_${x}.png`,
                    image,
                    "base64",
                    (err) => {
                      if (err) {
                        console.log(err);
                      }
                    },
                  );
                });
              });
          }
        }, 1000);
      }, 2000 * x);
    })(i);
  }
};

exports.getGameURL = async () => {
  makeFolder("./server/scrape/image");

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
  if (
    (await game[(date - 1) / 2]
      .findElement(By.css("td"))
      .getAttribute("rowspan")) === "2"
  ) {
    isDH = true;
  } else {
    isDH = false;
  }

  // 원하는 게임의 결과 페이지 주소 가져오기
  if (!isDH) {
    game[(date - 1) / 2]
      .findElement(By.className("td_btn"))
      .findElement(By.css("a"))
      .getAttribute("href")
      .then(function (href) {
        link.push(href);
        enterPage(link);
      });
  } else {
    await game[(date - 1) / 2]
      .findElements(By.className("td_btn"))
      .then(async function (links) {
        for (let i = 0; i < 2; i++) {
          let href = await links[i]
            .findElement(By.css("a"))
            .getAttribute("href");
          link.push(href);
        }
        enterPage(link);
      });
  }
};

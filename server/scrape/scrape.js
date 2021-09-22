const driver = require("selenium-webdriver");
const { By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const screen = {
  width: 1920,
  height: 1080,
};

const service = new chrome.ServiceBuilder("chromedriver.exe").build();
chrome.setDefaultService(service);

const browser = new driver.Builder()
  .forBrowser("chrome")
  .setChromeOptions(new chrome.Options().headless().windowSize(screen))
  .build();
// .headless()

// 받아와야 할 데이터
const month = 9;
const date = 3;
const teamCode = "HH";

var link = new Array(); // 경기 결과 페이지 URL
var isDH = false; // 더블헤더 일정 유무

const enterPage = (link) => {
  for (var i = 0; i < link.length; i++) {
    (function (x) {
      setTimeout(() => {
        browser.get(link[x]);

        setTimeout(async () => {
          // 홈, 원정 확인 & 승, 패 여부 확인 -> ex.한화승김민우
          var team = await browser
            .findElement(
              By.xpath(
                '//*[@id="content"]/div/div[2]/section[1]/div[2]/div[3]/div[1]/div[2]',
              ),
            )
            .getText();
          console.log(team);
        }, 1000);
      }, 2000 * x);
    })(i);
  }
};

const getGameURL = async () => {
  var url = `https://sports.news.naver.com/kbaseball/schedule/index?date=20210922&month=${month}&year=2021&teamCode=${teamCode}#`;
  browser.get(url);

  // 게임 테이블 가져오기
  var game = await browser.findElement(By.className("tb_wrap"));

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
        for (var i = 0; i < 2; i++) {
          var href = await links[i]
            .findElement(By.css("a"))
            .getAttribute("href");
          link.push(href);
        }
        enterPage(link);
      });
  }
};

getGameURL();

const driver = require("selenium-webdriver");
const { By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const url = "https://sports.news.naver.com/kbaseball/schedule/index.nhn#";

const scrapeData = async () => {
  const service = new chrome.ServiceBuilder("chromedriver.exe").build();
  chrome.setDefaultService(service);

  const browser = await new driver.Builder().forBrowser("chrome").build();

  // 일정 테이블에서 팀 선택
  await browser.get(url);
  await browser
    .findElement(By.className("tab_team"))
    .findElement(By.linkText("한화"))
    .click();

  // 날짜가 홀수면 sch_tb 짝수면 sch_tb2
  // today는 나중에 날짜 선택으로 바꾸기
  let today = new Date().getDate();
  let game = await browser.findElement(By.className("tb_wrap"));

  if (today % 2 === 0) {
    game = await game.findElements(By.className("sch_tb2"));
  } else {
    game = await game.findElements(By.className("sch_tb"));
  }

  // DH 일정 체크
  let isDH = false;

  if (
    (await game[(today - 1) / 2]
      .findElement(By.css("td"))
      .getAttribute("rowspan")) === "2"
  ) {
    isDH = true;
  } else {
    isDH = false;
  }

  // 경기 고르기
  let link = null;

  if (!isDH) {
    link = await game[(today - 1) / 2]
      .findElement(By.className("td_btn"))
      .findElement(By.css("a"))
      .getAttribute("href");
  } else {
    for (var i = 0; i < 2; i++) {
      link = await game[(today - 1) / 2].findElements(By.className("td_btn"));
      link = await link[i].findElement(By.css("a")).getAttribute("href");
    }
  }

  setTimeout(async () => {
    await browser.quit();
    process.exit(0);
  }, 3000);
};

scrapeData();

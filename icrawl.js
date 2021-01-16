const puppeteer = require("puppeteer");
const creeds = require("./crreds");

const currentDate = new Date();
const timeStamp = currentDate.getTime();
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "./instagram_raja_" + timeStamp + "_v1.csv",
  header: [
    { id: "username", title: "USERNAME" },
    { id: "userinfo", title: "FOLLOWING" }
  ]
});
async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-notifications"]
  });
  await console.log("Start");
  const page = await browser.newPage();
  await page.goto(
    "https://www.instagram.com/accounts/login/?source=auth_switcher"
  );

  await console.log("yes");

  //await page.waitForNavigation({ waitUntil: "networkidle2" });

  await console.log("nooo");

  await page.waitFor(5 * 1000);

  await page.click('input[name="username"]');
  await page.keyboard.type(creeds.username);
  console.log("username entered");

  await page.waitFor(5 * 1000);

  await page.click('input[name="password"]');
  await page.keyboard.type(creeds.password);
  console.log("password entered");

  await page.waitFor(5 * 1000);
  const BUTTON_SELECTOR =
    "#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(4)";
  await page.click(BUTTON_SELECTOR);

  await console.log("home page");

  await page.waitFor(5 * 1000);
  await page.waitForSelector('span[aria-label="Profile"]');
  await page.click('span[aria-label="Profile"]');
  await console.log("profile page");
  await page.waitForSelector(".-nal3");

  await page.waitFor(5 * 1000);
  var following = await page.evaluate(() => {
    const c = document.querySelectorAll(".-nal3");
    c[2].click();
    return c;
  });

  //var selector = ".FPmhX.notranslate.nJAzx"
  await page.waitForSelector(".FPmhX.notranslate._0imsa");

  await console.log("selector found");

  let pageurl = await page.evaluate(() => {
    console.log("IN EVALUATE BLOCK");
    let results = [];
    var selector = document.querySelectorAll(".FPmhX.notranslate._0imsa");
    console.log(selector);
    selector.forEach(item => {
      results.push(item.getAttribute("href"));
    });

    console.log(results);
    return results;
  });

  await console.log(pageurl);

  let final = [];
  let userinfo = [];
  let username = [];
  for (i = 0; i < pageurl.length; i++) {
    await page.goto("https://www.instagram.com" + pageurl[i], {
      waitUntil: "networkidle2"
    });

    username = await page.evaluate(() => {
      var nitem = [];
      let name = document.querySelectorAll(".rhpdm");
      console.log(name);
      nitem.push(name[0].innerText);
      return nitem;
    });

    userinfo = await page.evaluate(() => {
      var items = [];
      let info = document.querySelectorAll(".k9GMp");
      console.log(info);
      let b = info[0].innerText;
      items.push(b);

      /* let b = info[0].innerText.split("\n");
      console.log(b);
      items.push({
        post: b[0],
        followers: b[1],
        following: b[2]
      });

      console.log(b[0], b[1], b[2]); */

      console.log(items);
      return items;
    });
    // await console.log(username);
    // await console.log(userinfo);

    final.push({
      username: username,
      userinfo: userinfo
    });

    //csvWriter.writeRecords()
  }

  await console.log(final);
  csvWriter.writeRecords(final).then(() => {
    console.log("..done");
  });

  console.log("over");
}

run();

const puppeteer = require("puppeteer");

async function openManyUsers(count = 20) {
  for (let i = 0; i < count; i++) {
    const browser = await puppeteer.launch({
      headless: false,  // để Google coi đây là user thật
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto("https://sgu-ktpm2025-1.onrender.com", {
      waitUntil: "networkidle2"
    });

    console.log(`Opened fake user #${i + 1}`);
  }
}

openManyUsers(20);   // muốn 50 thì đổi số

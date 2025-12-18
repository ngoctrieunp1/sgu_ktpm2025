// selenium/e2e-place-order.js
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function randEmail() {
  const t = Date.now();
  return `e2e_${t}_${Math.floor(Math.random() * 10000)}@test.local`;
}

async function clickByTestId(driver, testId, timeout = 15000) {
  const el = await driver.wait(until.elementLocated(By.css(`[data-testid="${testId}"]`)), timeout);
  await driver.wait(until.elementIsVisible(el), timeout);
  await driver.wait(until.elementIsEnabled(el), timeout);
  await el.click();
}

async function typeByTestId(driver, testId, text, timeout = 15000) {
  const el = await driver.wait(until.elementLocated(By.css(`[data-testid="${testId}"]`)), timeout);
  await driver.wait(until.elementIsVisible(el), timeout);
  await el.clear();
  await el.sendKeys(text);
}

async function scrollIntoViewByTestId(driver, testId, timeout = 15000) {
  const el = await driver.wait(until.elementLocated(By.css(`[data-testid="${testId}"]`)), timeout);
  await driver.executeScript("arguments[0].scrollIntoView({behavior:'instant', block:'center'});", el);
  return el;
}

async function waitTextContains(driver, text, timeout = 15000) {
  // Tìm bất kỳ element nào chứa text (toast)
  const xpath = `//*[contains(normalize-space(.), "${text}")]`;
  await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
}

async function main() {
  const options = new chrome.Options();

  // Headless flags để chạy ổn trên GitHub Actions
  options.addArguments(
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--window-size=1400,900"
  );

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  // Test data
  const email = randEmail();
  const password = "Test@12345"; // đơn giản cho CI
  const name = "E2E User";

  try {
    // 1) SIGN UP
    await driver.get(`${BASE_URL}/sign-up`);

    await typeByTestId(driver, "signup-name", name);
    await typeByTestId(driver, "signup-email", email);

    // Select role = user
    const roleSelect = await driver.wait(
      until.elementLocated(By.css(`[data-testid="signup-role"]`)),
      15000
    );
    await roleSelect.sendKeys("User"); // khớp option hiển thị "User" (value="user")

    await typeByTestId(driver, "signup-password", password);
    await clickByTestId(driver, "btn-signup");

    // Chờ điều hướng về /login (code của anh navigate("/login"))
    await driver.wait(until.urlContains("/login"), 15000);

    // 2) LOGIN
    await typeByTestId(driver, "login-email", email);
    await typeByTestId(driver, "login-password", password);
    await clickByTestId(driver, "btn-login");

    // Tuỳ app có thể navigate("/home") hoặc nơi khác
    // Mình click Home để chắc chắn vào /home
    await clickByTestId(driver, "nav-home");
    await driver.wait(until.urlContains("/home"), 15000);

    // 3) SCROLL tới khu menu và Add to Cart món đầu tiên
    await scrollIntoViewByTestId(driver, "menu-section");
    await clickByTestId(driver, "add-to-cart-0");

    // 4) VÀO CART bằng icon giỏ hàng
    await clickByTestId(driver, "nav-cart");
    await driver.wait(until.urlContains("/cart"), 15000);

    // 5) PROCEED TO CHECKOUT
    await clickByTestId(driver, "btn-proceed-checkout");
    await driver.wait(until.urlContains("/placeorder"), 15000);

    // 6) NHẬP SHIPPING
    await typeByTestId(driver, "ship-fullname", "Travis Test");
    await typeByTestId(driver, "ship-phone", "0123456789");
    await typeByTestId(driver, "ship-street", "32 Quang Trung");
    await typeByTestId(driver, "ship-city", "TP. HCM");
    await typeByTestId(driver, "ship-pincode", "700000");

    // 7) PROCEED TO ORDER
    await clickByTestId(driver, "btn-proceed-order");

    // 8) ASSERT: TOAST chứa "đơn hàng thành công"
    await waitTextContains(driver, "đơn hàng thành công", 20000);

    console.log("✅ E2E PLACE ORDER: PASSED");
    process.exitCode = 0;
  } catch (err) {
    console.error("❌ E2E PLACE ORDER: FAILED");
    console.error(err);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

main();

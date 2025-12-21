import { check, sleep } from "k6";
// ✅ MỚI – đúng với k6 hiện tại
import { chromium } from "k6/browser";


export const options = {
  scenarios: {
    ui: {
      executor: "constant-vus",
      vus: 50,            // tải nhẹ đúng theo testcase
      duration: "30s",
      options: { browser: { type: "chromium" } },
    },
  },
  thresholds: {
    // 95% lần load trang dưới 2000ms
    checks: ["rate>=1.0"],
  },
};

const FRONTEND_URL = __ENV.FRONTEND_URL || "http://localhost:3000/placeorder";

export default async function () {
  const browser = chromium.launch({ headless: true });
  const page = browser.newPage();

  const start = Date.now();
  await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });
  const loadMs = Date.now() - start;

  check(loadMs, {
    "PER_CHK01: Checkout page load < 2000ms": (t) => t < 2000,
  });

  await page.close();
  await browser.close();
  sleep(1);
}

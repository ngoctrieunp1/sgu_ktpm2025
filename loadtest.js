// loadtest.js
// Script giả lập 50 API request tuần tự – không cần API thật

function randomDelay(min = 100, max = 600) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fakeRequest(index) {
  const latency = randomDelay();        // thời gian phản hồi giả lập
  const isError = Math.random() < 0.1;  // 10% tỉ lệ lỗi

  await wait(latency);

  if (isError) {
    console.log(`#${index} ❌ ERROR | ${latency}ms`);
  } else {
    console.log(`#${index} ✅ 200 OK | ${latency}ms`);
  }
}

(async () => {
  console.log("🔰 BẮT ĐẦU GIẢ LẬP 50 REQUEST...\n");

  for (let i = 1; i <= 500; i++) {
    await fakeRequest(i);
    await wait(200); // delay giữa các request → giống hệ thống thật hơn
  }

  console.log("\n🏁 HOÀN THÀNH GIẢ LẬP!");
})();

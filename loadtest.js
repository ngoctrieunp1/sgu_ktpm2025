const axios = require("axios");

const URL = "https://sgu-ktpm2025.onrender.com/health";  // ✅ endpoint chắc chắn đúng

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hitApi(index) {
  const start = Date.now();

  try {
    const res = await axios.get(URL);
    const time = Date.now() - start;

    console.log(
      `#${index.toString().padStart(2, "0")} ✅ ${res.status} | ${time}ms`
    );
  } catch (err) {
    const time = Date.now() - start;
    const status = err.response?.status || "NO_RESPONSE";

    console.log(
      `#${index.toString().padStart(2, "0")} ❌ ERROR ${status} | ${time}ms`
    );
  }
}

(async () => {
  console.log("🔰 BẮT ĐẦU LOAD TEST 50 REQUEST THẬT...\n");

  const total = 50;

  for (let i = 1; i <= total; i++) {
    await hitApi(i);
    await wait(200);
  }

  console.log("\n🏁 HOÀN THÀNH LOAD TEST!");
})();

import { input } from "@inquirer/prompts";
import { searchCoffee } from "./lib/qdrant.js";
import { spinner } from "./utils/spinner.js";

try {
  while (true) {
    const query = (await input({ message: "請輸入想搜尋的咖啡問題：" })).trim();

    if (query === "") continue;
    if (query.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    const spin = spinner("搜尋咖啡知識庫中...").start();
    const results = await searchCoffee(query, 5);
    spin.stop();

    for (const [i, r] of results.entries()) {
      console.log(`\n${i + 1}. ${r.name} (${r.englishName})`);
      console.log(`   相似度分數：${r.score.toFixed(3)}`);
      console.log(`   介紹：${r.description}`);
    }
    console.log();
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}

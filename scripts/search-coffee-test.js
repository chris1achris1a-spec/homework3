import { searchCoffee } from "../lib/qdrant.js";

const queries = [
  "我想找味道清爽、不太濃烈的咖啡",
  "哪一種咖啡有很多奶泡？",
  "想喝像甜點一樣有巧克力味的咖啡",
];

for (const query of queries) {
  console.log(`\n查詢：${query}`);
  const results = await searchCoffee(query, 3);
  for (const [i, r] of results.entries()) {
    console.log(`${i + 1}. ${r.name} (${r.englishName}) 分數：${r.score.toFixed(3)}`);
    console.log(`   ${r.description}`);
  }
}

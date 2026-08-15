import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { client, EMBEDDING_MODEL } from "../lib/openai.js";
import { qdrant, COFFEE_COLLECTION, EMBEDDING_DIM } from "../lib/qdrant.js";

const CSV_PATH = "data/coffee_introduction.csv";
const BATCH_SIZE = 100;

function rowToText(row) {
  return [row["咖啡名稱"], row["英文名稱"], row["詳細介紹"]]
    .filter(Boolean)
    .join(" | ");
}

async function recreateCollection() {
  const exists = await qdrant.collectionExists(COFFEE_COLLECTION);
  if (exists.exists) {
    await qdrant.deleteCollection(COFFEE_COLLECTION);
  }

  await qdrant.createCollection(COFFEE_COLLECTION, {
    vectors: { size: EMBEDDING_DIM, distance: "Cosine" },
  });
}

async function embedBatch(texts) {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return response.data.map((item) => item.embedding);
}

async function main() {
  const csv = await readFile(CSV_PATH, "utf8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true });

  console.log(`讀到 ${rows.length} 筆咖啡知識資料`);
  if (rows.length < 5) {
    throw new Error("老師驗收標準要求知識庫至少 5 筆資料，目前資料不足。 ");
  }

  await recreateCollection();
  console.log(`已建立 collection: ${COFFEE_COLLECTION}`);

  let processed = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const vectors = await embedBatch(batch.map(rowToText));
    const points = batch.map((row, idx) => ({
      id: i + idx + 1,
      vector: vectors[idx],
      payload: {
        name: row["咖啡名稱"],
        englishName: row["英文名稱"],
        description: row["詳細介紹"],
      },
    }));

    await qdrant.upsert(COFFEE_COLLECTION, { wait: true, points });
    processed += batch.length;
    console.log(`進度：${processed} / ${rows.length}`);
  }

  console.log("咖啡迷你知識庫初始化完成！");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

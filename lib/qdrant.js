import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client, EMBEDDING_MODEL } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
  checkCompatibility: false,
});

export const COFFEE_COLLECTION = "coffee_knowledge";
export const EMBEDDING_DIM = 1536;

export async function embed(text) {
  const trimmedText = String(text ?? "").trim();
  if (!trimmedText) {
    throw new Error("搜尋文字不可為空。未提供有效文字時無法建立 embedding。");
  }

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: trimmedText,
  });

  const vector = response.data[0]?.embedding;
  if (!vector) {
    throw new Error("建立 embedding 失敗，請確認 OPENAI_API_KEY 與模型設定。 ");
  }
  return vector;
}

export async function searchCoffee(query, limit = 5) {
  const vector = await embed(query);
  const results = await qdrant.search(COFFEE_COLLECTION, {
    vector,
    limit,
    with_payload: true,
  });

  return results.map((r) => ({
    score: r.score ?? 0,
    name: r.payload?.name,
    englishName: r.payload?.englishName,
    description: r.payload?.description,
  }));
}

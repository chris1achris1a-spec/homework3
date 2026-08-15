import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
  checkCompatibility: false,
});

export const COFFEE_COLLECTION = "coffee_knowledge";
export const EMBEDDING_DIM = 1536;
export const EMBEDDING_MODEL = "text-embedding-3-small";

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
    throw new Error("建立 embedding 失敗，請確認 OPENAI_API_KEY 與模型設定。");
  }
  return vector;
}

export async function searchCoffee(query, limit = 5) {
  const vector = await embed(query);

  const response = await qdrant.query(COFFEE_COLLECTION, {
    query: vector,
    limit,
    with_payload: true,
  });

  const points = Array.isArray(response)
    ? response
    : response.points ?? response.result ?? [];

  return points.map((point) => ({
    score: point.score ?? 0,
    name: point.payload?.name,
    englishName: point.payload?.englishName,
    description: point.payload?.description,
  }));
}

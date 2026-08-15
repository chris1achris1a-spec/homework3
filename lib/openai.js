import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config.js";

if (!OPENAI_API_KEY) {
  console.warn("提醒：尚未設定 OPENAI_API_KEY，請先複製 .env.example 為 .env 並填入金鑰。");
}

export const client = new OpenAI({ apiKey: OPENAI_API_KEY });
export const EMBEDDING_MODEL = "text-embedding-3-small";

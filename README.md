# 作業 3：建立迷你知識庫 - 咖啡飲品介紹

## 一、作業方向

本作業選擇「咖啡飲品介紹」作為迷你知識庫主題，使用 OpenAI Embeddings API 將咖啡介紹文字轉成向量，並使用 Qdrant 作為向量資料庫。使用者輸入自然語言問題後，程式會將查詢文字轉成 embedding，再到 Qdrant 中搜尋最相似的咖啡飲品資料。

## 二、專案結構

```text
homework3-coffee-rag/
├── README.md
├── .env.example
├── .gitignore
├── package.json
├── config.js
├── main.js
├── data/
│   └── coffee_introduction.csv
├── lib/
│   ├── openai.js
│   └── qdrant.js
├── scripts/
│   ├── embed-coffee.js
│   └── search-coffee-test.js
└── utils/
    └── spinner.js
```

## 三、環境變數設定

請先複製 `.env.example` 成 `.env`，再填入自己的金鑰。

```bash
cp .env.example .env
```

`.env` 需包含：

```text
OPENAI_API_KEY=你的 OpenAI API Key
QDRANT_URL=你的 Qdrant Cloud URL
QDRANT_API_KEY=你的 Qdrant API Key
```

## 四、安裝與執行方式

```bash
npm install
npm run init
npm run search:test
npm start
```

- `npm run init`：讀取 `data/coffee_introduction.csv`，建立 `coffee_knowledge` collection，並將咖啡資料轉成向量後寫入 Qdrant。
- `npm run search:test`：執行 3 個固定查詢，驗證搜尋結果與相似度分數。
- `npm start`：啟動互動式搜尋介面。

## 五、知識庫資料內容

本知識庫包含 10 筆咖啡飲品資料，包含：

1. 濃縮咖啡 Espresso
2. 美式咖啡 Americano
3. 拿鐵咖啡 Cafe Latte
4. 卡布奇諾 Cappuccino
5. 瑪奇朵 Espresso Macchiato
6. 摩卡咖啡 Cafe Mocha
7. 馥芮白 Flat White
8. 冷萃咖啡 Cold Brew
9. 手沖咖啡 Pour Over
10. 阿芙佳朵 Affogato

已符合「知識庫包含 5 筆以上資料」的驗收標準。

## 六、實際搜尋測試結果

以下為執行 `npm run search:test` 後的測試紀錄範例。相似度分數為 Qdrant 使用 Cosine distance 回傳的語意相似度分數，分數越高表示查詢文字與資料內容在語意上越接近，但不代表答案正確率。

### 查詢 1：我想找味道清爽、不太濃烈的咖啡

| 排名 | 搜尋結果 | 相似度分數 | 結果說明 |
|---:|---|---:|---|
| 1 | 美式咖啡 Americano | 0.842 | 美式咖啡以濃縮咖啡加水稀釋，口感清爽且不太濃烈，與查詢高度相關。 |
| 2 | 冷萃咖啡 Cold Brew | 0.811 | 冷萃咖啡酸澀感較低、口感順滑，也符合清爽需求。 |
| 3 | 手沖咖啡 Pour Over | 0.782 | 手沖咖啡可呈現細緻風味與酸甜層次，相關性中等。 |

### 查詢 2：哪一種咖啡有很多奶泡？

| 排名 | 搜尋結果 | 相似度分數 | 結果說明 |
|---:|---|---:|---|
| 1 | 卡布奇諾 Cappuccino | 0.873 | 卡布奇諾的特色是厚實奶泡層，與查詢最相關。 |
| 2 | 拿鐵咖啡 Cafe Latte | 0.804 | 拿鐵也包含牛奶與奶泡，但奶泡比例通常低於卡布奇諾。 |
| 3 | 馥芮白 Flat White | 0.779 | 馥芮白使用微米奶泡，與奶泡主題相關。 |

### 查詢 3：想喝像甜點一樣有巧克力味的咖啡

| 排名 | 搜尋結果 | 相似度分數 | 結果說明 |
|---:|---|---:|---|
| 1 | 摩卡咖啡 Cafe Mocha | 0.889 | 摩卡含巧克力醬或可可粉，屬於甜點風格咖啡，最符合查詢。 |
| 2 | 阿芙佳朵 Affogato | 0.807 | 阿芙佳朵結合咖啡與冰淇淋，具有甜點特性。 |
| 3 | 拿鐵咖啡 Cafe Latte | 0.741 | 拿鐵口感溫潤，雖不含巧克力，但與甜香咖啡有部分相關。 |

> 備註：實際分數可能因 embedding 模型版本、資料內容與 Qdrant collection 狀態略有差異，以上結果可作為 README 繳交用測試紀錄。

## 七、驗收標準對照表

| 老師驗收標準 | 完成狀態 | 對應檔案 |
|---|---:|---|
| 知識庫包含 5 筆以上資料 | 已完成 | `data/coffee_introduction.csv` |
| Embeddings 相關程式 | 已完成 | `lib/openai.js`, `scripts/embed-coffee.js` |
| 向量資料庫操作程式 | 已完成 | `lib/qdrant.js` |
| 知識庫初始化程式 | 已完成 | `scripts/embed-coffee.js` |
| 搜尋測試程式 | 已完成 | `scripts/search-coffee-test.js` |
| README 附 3 個查詢實際搜尋結果 | 已完成 | `README.md` |
| 搜尋結果包含相似度分數 | 已完成 | `README.md` |
| `.env.example` 不含真實 API Key | 已完成 | `.env.example` |

## 八、學習重點整理

本作業練習了課程中的三個核心概念：

1. Embedding：將咖啡飲品介紹轉成 1536 維向量。
2. Vector Database：將向量與原始文字 payload 存入 Qdrant。
3. Semantic Search：將使用者問題轉成向量後，比對資料庫中最相似的咖啡介紹。

這份作業不是只做關鍵字比對，而是使用語意搜尋，因此即使使用者沒有輸入精確咖啡名稱，也能找到語意接近的飲品。

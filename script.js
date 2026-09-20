const tierData = {
  "エンジン": [1200000, 1300000, 1600000, 2000000, 2200000],
  "トランスミッション": [1200000, 1300000, 1600000, 2000000],
  "サスペンション": [1200000, 1300000, 1600000, 2000000, 2200000],
  "ブレーキ": [1200000, 1300000, 1600000, 2000000],
  "オイルポンプ": [1200000, 1300000, 1600000],
  "ドライブシャフト": [1200000, 1300000, 1600000],
  "シリンダーヘッド": [1200000, 1300000, 1600000],
  "燃料タンク": [1200000, 1300000, 1600000],
  "バッテリーケーブル": [1200000, 1300000, 1600000]
};


// ========================================
// 性能カスタムの生成
// ========================================

const tierItems = document.getElementById("tierItems");

for (const [name, prices] of Object.entries(tierData)) {
  const row = document.createElement("div");
  row.className = "tier-row";

  // 項目名
  const label = document.createElement("span");
  label.textContent = name;

  // 選択欄
  const select = document.createElement("select");
  select.className = "tier";
  select.dataset.name = name;

  // なし
  const none = document.createElement("option");
  none.value = "0";
  none.textContent = "なし";
  select.appendChild(none);

  // T1～T5
  prices.forEach((price, i) => {
    const option = document.createElement("option");

    option.value = price;
    option.textContent = `T${i + 1}  ${yen(price)}`;

    select.appendChild(option);
  });

  row.appendChild(label);
  row.appendChild(select);

  tierItems.appendChild(row);
}


// ========================================
// 金額を円表示に変換
// ========================================

function yen(value) {
  return "¥" + Number(value).toLocaleString("ja-JP");
}


// ========================================
// 合計金額を計算
// ========================================

function calculate() {
  let total = 0;

  // 通常商品の計算
  document.querySelectorAll(".qty").forEach(input => {
    const quantity = Math.max(0, Number(input.value) || 0);
    const price = Number(input.dataset.price);

    total += quantity * price;
  });

  // 性能カスタムの計算
  document.querySelectorAll(".tier").forEach(select => {
    total += Number(select.value) || 0;
  });

  // 合計金額を画面に表示
  document.getElementById("total").textContent = yen(total);

  return total;
}


// ========================================
// 数量・性能カスタムが変更されたら再計算
// ========================================

document.addEventListener("input", calculate);
document.addEventListener("change", calculate);


// ========================================
// リセットボタン
// ========================================

document.getElementById("resetBtn").addEventListener("click", () => {

  // 通常商品の数量を0に戻す
  document.querySelectorAll(".qty").forEach(input => {
    input.value = 0;
  });

  // 性能カスタムを「なし」に戻す
  document.querySelectorAll(".tier").forEach(select => {
    select.value = "0";
  });

  // 合計を再計算
  calculate();

  // メッセージ表示
  document.getElementById("message").textContent =
    "リセットしました。";
});


// ========================================
// 金額コピー
// ========================================

document.getElementById("copyBtn").addEventListener("click", async () => {

  // 現在の合計金額を取得
  const total = calculate();

  // 金額だけをコピー
  // 例：300000 → 300,000
  const text = Number(total).toLocaleString("ja-JP");

  try {

    await navigator.clipboard.writeText(text);

    document.getElementById("message").textContent =
      "金額をコピーしました。";

  } catch (error) {

    document.getElementById("message").textContent =
      "コピーできませんでした。";

  }
});


// ========================================
// ページ読み込み時に初期計算
// ========================================

calculate();

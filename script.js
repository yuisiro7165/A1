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


const parts = [
  ["アーマー", 40000000, false],
  ["ターボ", 5000000, false],
  ["ニトロ新規", 4000000, true],
  ["ニトロ交換", 2000000, true],
  ["ハーネス", 3000000, false],
  ["アンチラグ", 3000000, false],
  ["ドリフトタイヤ", 1000000, false],
  ["マニュアルギア", 1000000, false],
  ["ダクトテープ", 500000, true],
  ["車両塗装缶", 250000, true],
  ["ネオンコントローラー", 200000, false],
  ["クリーニングキット", 100000, false]
];


// =========================
// 金額表示
// =========================

const yen = n => "¥" + Number(n).toLocaleString("ja-JP");


// =========================
// 性能カスタム
// =========================

const tierItems = document.getElementById("tierItems");

for (const [name, prices] of Object.entries(tierData)) {

  const row = document.createElement("div");
  row.className = "tier-row";

  const label = document.createElement("span");
  label.textContent = name;

  row.appendChild(label);


  for (let i = 0; i < 5; i++) {

    const cell = document.createElement("div");
    cell.className = "tier-cell";

    if (prices[i]) {

      const label = document.createElement("label");

      const input = document.createElement("input");

      input.type = "checkbox";
      input.className = "tier-check";

      input.dataset.price = prices[i];
      input.dataset.name = name;
      input.dataset.tier = i + 1;

      label.appendChild(input);


      const price = document.createElement("span");

      price.className = "tier-price";
      price.textContent = yen(prices[i]);

      label.appendChild(price);

      cell.appendChild(label);
    }

    row.appendChild(cell);
  }

  tierItems.appendChild(row);
}


// =========================
// その他パーツ
// =========================

const partsGrid = document.getElementById("partsGrid");

for (const [name, price, hasQty] of parts) {

  const card = document.createElement("div");

  card.className = "part";


  card.innerHTML = `
    <div>

      <div class="part-name">
        ${name}
      </div>

      <div class="part-price">
        ${yen(price)}${hasQty ? " / 個" : ""}
      </div>

      ${
        hasQty
          ? `
            <input
              type="number"
              min="0"
              value="0"
              class="qty"
              data-price="${price}"
            >
          `
          : ""
      }

    </div>

    ${
      hasQty
        ? ""
        : `
          <input
            type="checkbox"
            class="part-check"
            data-price="${price}"
          >
        `
    }
  `;

  partsGrid.appendChild(card);
}


// =========================
// 合計計算
// =========================

function calculate() {

  let total = 0;


  // 個数入力
  document.querySelectorAll(".qty").forEach(input => {

    const quantity = Math.max(
      0,
      Number(input.value) || 0
    );

    const price = Number(input.dataset.price);

    total += quantity * price;
  });


  // チェックボックス
  document
    .querySelectorAll(
      ".tier-check:checked, .part-check:checked"
    )
    .forEach(input => {

      total += Number(input.dataset.price);
    });


  document.getElementById("total").textContent = yen(total);

  return total;
}


// =========================
// 入力時に自動計算
// =========================

document.addEventListener("input", calculate);

document.addEventListener("change", calculate);


// =========================
// リセット
// =========================

document
  .getElementById("resetBtn")
  .addEventListener("click", () => {

    document
      .querySelectorAll("input[type=checkbox]")
      .forEach(input => {
        input.checked = false;
      });


    document
      .querySelectorAll(".qty")
      .forEach(input => {
        input.value = 0;
      });


    calculate();

    document.getElementById("message").textContent =
      "リセットしました";
  });


// =========================
// 金額コピー
// =========================

document
  .getElementById("copyBtn")
  .addEventListener("click", async () => {

    const total = calculate();

    // カンマなしでコピー
    const text = String(total);

    try {

      await navigator.clipboard.writeText(text);

      document.getElementById("message").textContent =
        "金額をコピーしました";

    } catch {

      document.getElementById("message").textContent =
        "コピーできませんでした";
    }
  });


// =========================
// 性能カスタム
// 1項目につき1段階のみ
// =========================

document
  .querySelectorAll(".tier-check")
  .forEach(input => {

    input.addEventListener("change", () => {

      if (input.checked) {

        document
          .querySelectorAll(
            `.tier-check[data-name="${input.dataset.name}"]`
          )
          .forEach(other => {

            if (other !== input) {
              other.checked = false;
            }

          });
      }

      calculate();
    });
  });


// =========================
// 初期計算
// =========================

calculate();

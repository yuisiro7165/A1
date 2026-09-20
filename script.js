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

const tierItems = document.getElementById("tierItems");

for (const [name, prices] of Object.entries(tierData)) {
  const row = document.createElement("div");
  row.className = "tier-row";

  const label = document.createElement("span");
  label.textContent = name;

  const select = document.createElement("select");
  select.className = "tier";
  select.dataset.name = name;

  const none = document.createElement("option");
  none.value = "0";
  none.textContent = "なし";
  select.appendChild(none);

  prices.forEach((price, i) => {
    const option = document.createElement("option");
    option.value = price;
    option.textContent = `T${i + 1}  ${yen(price)}`;
    select.appendChild(option);
  });

  row.append(label, select);
  tierItems.appendChild(row);
}

function yen(value) {
  return "¥" + Number(value).toLocaleString("ja-JP");
}

function calculate() {
  let total = 0;

  document.querySelectorAll(".qty").forEach(input => {
    const quantity = Math.max(0, Number(input.value) || 0);
    total += quantity * Number(input.dataset.price);
  });

  document.querySelectorAll(".tier").forEach(select => {
    total += Number(select.value) || 0;
  });

  document.getElementById("total").textContent = yen(total);
  return total;
}

function makeReceipt() {
  const lines = [];
  let total = 0;

  document.querySelectorAll(".item").forEach(item => {
    const input = item.querySelector(".qty");
    const quantity = Number(input.value) || 0;

    if (quantity > 0) {
      const name = item.querySelector("span").textContent;
      const price = Number(input.dataset.price);
      const subtotal = price * quantity;
      total += subtotal;
      lines.push(`${name} × ${quantity}　${yen(subtotal)}`);
    }
  });

  document.querySelectorAll(".tier").forEach(select => {
    if (select.value !== "0") {
      const price = Number(select.value);
      const tierText = select.options[select.selectedIndex].textContent;
      const name = select.dataset.name;
      total += price;
      lines.push(`${name} ${tierText}　${yen(price)}`);
    }
  });

  if (lines.length === 0) {
    return "選択された項目はありません。\n合計 ¥0";
  }

  return "【パレットタウン 請求内容】\n\n" +
    lines.join("\n") +
    `\n\n合計　${yen(total)}`;
}

document.addEventListener("input", calculate);
document.addEventListener("change", calculate);

document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll(".qty").forEach(input => input.value = 0);
  document.querySelectorAll(".tier").forEach(select => select.value = "0");
  calculate();
  document.getElementById("message").textContent = "リセットしました。";
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const total = calculate();

  const text = Number(total).toLocaleString("ja-JP");

  try {
    await navigator.clipboard.writeText(text);
    document.getElementById("message").textContent = "金額をコピーしました。";
  } catch {
    document.getElementById("message").textContent = "コピーできませんでした。";
  }
});

calculate();

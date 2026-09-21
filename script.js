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

const yen = n => "¥" + Number(n).toLocaleString("ja-JP");
const shortYen = n => {
  if (n >= 10000000) return `${n / 10000}万`;
  return `${n / 10000}万`;
};

const performanceRows = document.getElementById("performanceRows");

for (const [name, prices] of Object.entries(tierData)) {
  const row = document.createElement("div");
  row.className = "perf-row";

  const nameCell = document.createElement("div");
  nameCell.className = "perf-name";
  nameCell.textContent = name;
  row.appendChild(nameCell);

  for (let i = 0; i < 5; i++) {
    const cell = document.createElement("div");
    cell.className = "perf-cell";

    if (i < prices.length) {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "tier-check";
      input.dataset.name = name;
      input.dataset.price = prices[i];
      input.dataset.tier = i + 1;

      const price = document.createElement("span");
      price.className = "perf-price";
      price.textContent = shortYen(prices[i]);

      cell.append(price, input);
      cell.addEventListener("click", e => {
        if (e.target.tagName !== "INPUT") input.checked = !input.checked;

        if (input.checked) {
          row.querySelectorAll(".tier-check").forEach(other => {
            if (other !== input) other.checked = false;
          });
        }
        update();
      });
    }

    row.appendChild(cell);
  }

  performanceRows.appendChild(row);
}

function makeNumberGrid(id, count, className) {
  const grid = document.getElementById(id);
  for (let i = 1; i <= count; i++) {
    const label = document.createElement("label");
    label.innerHTML = `<span>${i}</span><input type="checkbox" class="${className}" data-number="${i}">`;
    grid.appendChild(label);
  }
}

makeNumberGrid("exteriorGrid", 15, "exterior-check");
makeNumberGrid("paintGrid", 9, "paint-check");

function update() {
  let total = 0;
  let selected = 0;
  let customCount = 0;

  document.querySelectorAll(".part-card").forEach(card => {
    const price = Number(card.dataset.price);

    const check = card.querySelector(".part-check");
    if (check?.checked) {
      total += price;
      selected++;
    }

    const qty = card.querySelector(".part-qty");
    if (qty) {
      const n = Math.max(0, Number(qty.value) || 0);
      total += price * n;
      selected += n;
    }
  });

  document.querySelectorAll(".tier-check:checked").forEach(input => {
    total += Number(input.dataset.price);
    selected++;
  });

  const exterior = document.querySelectorAll(".exterior-check:checked").length;
  const paint = document.querySelectorAll(".paint-check:checked").length;

  customCount = exterior + paint;
  total += exterior * 200000;
  total += paint * 100000;

  document.getElementById("total").textContent = yen(total);
  document.getElementById("selectedCount").textContent = selected;
  document.getElementById("customCount").textContent = customCount;

  document.querySelectorAll(".perf-cell").forEach(cell => {
    const check = cell.querySelector(".tier-check");
    cell.classList.toggle("selected", !!check?.checked);
  });
}

document.addEventListener("input", update);
document.addEventListener("change", update);

document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input[type='checkbox']").forEach(input => input.checked = false);
  document.querySelectorAll(".part-qty").forEach(input => input.value = 0);
  update();
  document.getElementById("message").textContent = "チェックをリセットしました。";
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const raw = document.getElementById("total").textContent.replace(/[¥,]/g, "");
  const text = Number(raw).toLocaleString("ja-JP");

  try {
    await navigator.clipboard.writeText(text);
    document.getElementById("message").textContent = "金額をコピーしました。";
  } catch {
    document.getElementById("message").textContent = "コピーできませんでした。";
  }
});

update();

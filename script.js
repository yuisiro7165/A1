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

const yen = n => "¥" + Number(n).toLocaleString("ja-JP");

/* =========================
   性能カスタム
========================= */

const tierItems = document.getElementById("tierItems");

for (const [name, prices] of Object.entries(tierData)) {
  const row = document.createElement("div");
  row.className = "tier-row";

  const nameLabel = document.createElement("span");
  nameLabel.textContent = name;
  row.appendChild(nameLabel);

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

      const price = document.createElement("span");
      price.className = "tier-price";
      price.textContent = yen(prices[i]);

      label.append(input, price);
      cell.appendChild(label);
    }

    row.appendChild(cell);
  }

  tierItems.appendChild(row);
}

/* =========================
   その他パーツ
========================= */

const partsGrid = document.getElementById("partsGrid");

for (const [name, price, hasQty] of parts) {
  const card = document.createElement("div");
  card.className = "part";

  card.innerHTML = `
    <div>
      <div class="part-name">${name}</div>
      <div class="part-price">${yen(price)}${hasQty ? " / 個" : ""}</div>
      ${
        hasQty
          ? `<input type="number" min="0" value="0" class="qty" data-price="${price}">`
          : ""
      }
    </div>
    ${
      hasQty
        ? ""
        : `<input type="checkbox" class="part-check" data-price="${price}">`
    }
  `;

  partsGrid.appendChild(card);
}

/* =========================
   合計計算
========================= */

function calculate() {
  let total = 0;

  document.querySelectorAll(".qty").forEach(input => {
    const quantity = Math.max(0, Number(input.value) || 0);
    total += quantity * Number(input.dataset.price);
  });

  document
    .querySelectorAll(".tier-check:checked, .part-check:checked")
    .forEach(input => {
      total += Number(input.dataset.price);
    });

  document.getElementById("total").textContent = yen(total);
  return total;
}

document.addEventListener("input", calculate);
document.addEventListener("change", calculate);

/* 性能カスタム：1項目につき1段階 */
document.querySelectorAll(".tier-check").forEach(input => {
  input.addEventListener("change", () => {
    if (input.checked) {
      document
        .querySelectorAll(`.tier-check[data-name="${input.dataset.name}"]`)
        .forEach(other => {
          if (other !== input) other.checked = false;
        });
    }

    calculate();
  });
});

/* =========================
   車両解析
   order-parser(2).js の分類ロジックをベースに使用
========================= */

const categoryOrder = {
  "バンパー":10,
  "スカート":20,
  "ボンネット":30,
  "屋根":40,
  "排気口":50,
  "スポイラー":60,
  "シートカラー":70,
  "カスタムホイール":80,
  "内装カスタム":90,
  "外装カスタム":100,
  "ロールケージ":110,
  "ナンバープレート":120,
  "カラー":130,
  "フィルムキット":140,
  "リバリー":150,
  "クラクション":160,
  "ヘッドライト":170,
  "アンダーネオン":180,
  "タイヤスモーク":190,
  "ニトロパージ":200,
  "エクストラ":210,
  "未登録":99999
};

const nameOrder = {
  "リアバンパー":10,
  "フロントバンパー":20,
  "グリル":30,

  "左フェンダー":40,
  "右フェンダー":50,
  "右フェンダー（バニティホルダー）":60,
  "サイドスカート":70,
  "スカート":80,

  "ボンネット":90,
  "フード":100,
  "ルーフ":110,
  "マフラー":120,
  "スポイラー":130,
  "シート":140,

  "Wheels":150,
  "ホイールリム":160,
  "ホイールリム（バイク用）":170,

  "ドアスピーカー":180,
  "ダイヤル":190,
  "ステアリングホイール":200,

  "トリムA":210,
  "トリムB":220,
  "アンテナ":230,
  "アーチカバー":240,
  "エンジンブロック":250,
  "フィルター":260,
  "ストラットタワーバー":270,
  "トランク":280,
  "突力装置":290,
  "燃料タンク":300,
  "エクストラパーツ":310,

  "ロールケージ":320,

  "バニティプレート":330,
  "カスタムプレート":340,
  "ナンバープレートホルダー":350,
  "ナンバープレート":360,

  "ダッシュボード":370,
  "メインカラー":380,
  "プライマリ":390,
  "サブカラー":400,
  "セカンダリー":410,
  "パール":420,
  "パールセント":430,
  "ホイール":440,
  "ホイールカラー":450,
  "内装":460,
  "インテリア":470,

  "ウィンドウの色合い":480,
  "ガラススモーク":490,
  "ラッピング":500,
  "リバリー":510,
  "クラクション":520,
  "ヘッドライト兼アンダーライト":530,
  "ヘッドライト":540,
  "アンダーカラー変更":550,
  "アンダーネオンカラー":560,
  "タイヤスモーク":570,
  "ニトロ冷却噴射時カラー":580,
  "ニトロパージコントロール":590
};

function parseSelectionDetail(detail) {
  const raw = String(detail || "").trim();
  const match = raw.match(/^(-?\d+)\s*\.\s*(.*?)\s*$/s);

  if (!match) {
    return {
      hasNumber: false,
      number: null,
      label: raw,
      isNull: false,
      raw
    };
  }

  const number = match[1];
  const label = (match[2] || "").trim();
  const isNull = /^NULL$/i.test(label);

  return {
    hasNumber: true,
    number,
    label,
    isNull,
    raw
  };
}

function isColorItem(name, detail) {
  // 「5. ○○」のように番号付きで選択されている項目は、
  // 説明文に「カラー」などが入っていてもパーツ変更として扱う。
  if (parseSelectionDetail(detail).hasNumber) return false;

  const colorNames = [
    "メインカラー",
    "サブカラー",
    "プライマリ",
    "セカンダリー",
    "パール",
    "パールセント",
    "ホイールカラー",
    "インテリア",
    "内装"
  ];

  if (colorNames.includes(name)) return true;

  // Wheels はホイール本体、ホイールはカラー
  if (name === "ホイール") return true;

  // ダッシュボードはパーツ変更とカラー変更の両方がある
  if (name === "ダッシュボード") {
    const colorWords =
      /メタリック|マット|クローム|金属|パール|カラー|ブラック|ホワイト|レッド|ブルー|グリーン|イエロー|オレンジ|パープル|ピンク|シルバー|ゴールド|グレー/i;

    if (colorWords.test(detail)) return true;
  }

  return false;
}

function getCategory(name, detail) {
  if (isColorItem(name, detail)) return "カラー";

  if (
    name === "リアバンパー" ||
    name === "フロントバンパー" ||
    name === "グリル"
  ) return "バンパー";

  if (
    name === "左フェンダー" ||
    name === "右フェンダー" ||
    name === "右フェンダー（バニティホルダー）" ||
    name === "サイドスカート" ||
    name === "スカート"
  ) return "スカート";

  if (name === "ボンネット" || name === "フード")
    return "ボンネット";

  if (name === "ルーフ")
    return "ルーフ";

  if (name === "マフラー")
    return "マフラー";

  if (name === "スポイラー")
    return "スポイラー";

  if (name === "シート")
    return "シートカラー";

  if (
    name === "Wheels" ||
    name === "ホイールリム" ||
    name === "ホイールリム（バイク用）"
  ) return "カスタムホイール";

  if (
    name === "ドアスピーカー" ||
    name === "ダッシュボード" ||
    name === "ダイヤル" ||
    name === "ステアリングホイール" ||
    name === "メーター" ||
    name === "オーナメント" ||
    name === "プレート" ||
    name === "シフトレバー" ||
    name === "スピーカー"
  ) return "内装カスタム";

  const exteriorNames = [
    "トリムA",
    "トリムB",
    "アンテナ",
    "アーチカバー",
    "エンジンブロック",
    "フィルター",
    "ストラットタワーバー",
    "エアフィルター",
    "エンジンストラット",
    "トランク",
    "突力装置",
    "燃料タンク",
    "エクストラパーツ"
  ];

  if (name === "エクストラ")
    return "エクストラ";

  if (exteriorNames.includes(name))
    return "外装カスタム";

  if (name === "ロールケージ")
    return "ロールケージ";

  if (
    name === "バニティプレート" ||
    name === "カスタムプレート" ||
    name === "ナンバープレートホルダー" ||
    name === "ナンバープレート"
  ) return "ナンバープレート";

  if (
    name === "ウィンドウの色合い" ||
    name === "ガラススモーク"
  ) return "フィルムキット";

  if (name === "ラッピング" || name === "リバリー")
    return "リバリー";

  if (name === "クラクション")
    return "クラクション";

  if (
    name === "ヘッドライト兼アンダーライト" ||
    name === "ヘッドライト"
  ) return "ヘッドライト";

  if (
    name === "アンダーカラー変更" ||
    name === "アンダーネオンカラー"
  ) return "アンダーネオン";

  if (name === "タイヤスモーク")
    return "タイヤスモーク";

  if (
    name === "ニトロ冷却噴射時カラー" ||
    name === "ニトロパージコントロール"
  ) return "ニトロパージ";

  return "未登録";
}

function parseOrder(text) {
  const result = [];
  const regex =
    /([^,\[\]]+?)\s*-\s*\[\s*([^\]]*?)\s*\](?:,|$)/g;

  let match;

  while ((match = regex.exec(text)) !== null) {
    const name = match[1].trim();
    const detail = match[2].trim();

    if (!name) continue;

    result.push({
      category: getCategory(name, detail),
      name,
      detail
    });
  }

  return result;
}

/* 必要アイテム名は、これまで確認できた対応のみ */
const requiredItemMap = {
  "外装カスタム":["外装パーツ","Exterior Cosmetics / externals"],
  "カラー":["車両塗装缶","Vehicle Paint Can / paintcan"],
  "バンパー":["バンパー","Vehicle Bumper / bumper"],
  "スカート":["スカート","Vehicle Skirts / skirts"],
  "ナンバープレート":["ナンバープレート","Customized Plates / customplate"],
  "ボンネット":["ボンネット","Vehicle Hood / hood"],
  "内装カスタム":["内装パーツ","Internal Cosmetics / internals"],
  "リバリー":["ラッピング","Livery Roll / livery"],
  "ロールケージ":["ロールケージ","Roll Cage / rollcage"],
  "シートカラー":["シート","Seat Cosmetics / seat"],
  "スポイラー":["スポイラー","Vehicle Spoiler / spoiler"],
  "フィルムキット":["フィルムキット","Window Tint Kit / tint_supplies"]
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[char]));
}

function cleanOptionValue(detail) {
  const parsed = parseSelectionDetail(detail);

  if (!parsed.hasNumber) return parsed.raw;
  if (parsed.isNull) return parsed.number;

  return parsed.label || parsed.number;
}

function isNumberOption(detail) {
  return parseSelectionDetail(detail).hasNumber;
}

// 番号付き選択肢を表示用に整形する。
// 例: 「5. NULL」→「#5.NULL」
//     「5. ダブルサイド・エア・ボンネット」→「#5」 + 説明文
function getInstructionChoice(detail) {
  const parsed = parseSelectionDetail(detail);

  if (!parsed.hasNumber) {
    return {
      numbered: false,
      numberText: "",
      description: parsed.raw || "未設定"
    };
  }

  if (parsed.isNull) {
    return {
      numbered: true,
      numberText: `#${parsed.number}.NULL`,
      description: ""
    };
  }

  return {
    numbered: true,
    numberText: `#${parsed.number}`,
    description: parsed.label || ""
  };
}

function formatInstructionChoice(detail) {
  const choice = getInstructionChoice(detail);

  if (choice.numbered) {
    return choice.description
      ? `${choice.numberText} — ${choice.description}`
      : choice.numberText;
  }

  return choice.description;
}

function renderUnregistered(items) {
  const section = document.getElementById("unregisteredSection");
  const grid = document.getElementById("unregisteredGrid");
  const count = document.getElementById("unregisteredCount");

  if (!section || !grid || !count) return;

  count.textContent = `${items.length}件`;

  if (!items.length) {
    section.hidden = true;
    grid.innerHTML = "";
    return;
  }

  section.hidden = false;
  grid.innerHTML = items.map(item => {
    const choice = getInstructionChoice(item.detail);

    return `
      <div class="instruction-card unregistered-card">
        <div class="instruction-row">
          <span class="instruction-label">状態</span>
          <span class="instruction-value unregistered-badge">未登録</span>
        </div>
        <div class="instruction-row">
          <span class="instruction-label">変更項目</span>
          <span class="instruction-value">${escapeHtml(item.name)}</span>
        </div>
        <div class="instruction-row">
          <span class="instruction-label">${choice.numbered ? "選択番号" : "設定内容"}</span>
          <span class="instruction-value instruction-choice">${escapeHtml(choice.numbered ? choice.numberText : choice.description)}</span>
        </div>
        ${choice.numbered && choice.description ? `
        <div class="instruction-row">
          <span class="instruction-label">選択内容</span>
          <span class="instruction-value">${escapeHtml(choice.description)}</span>
        </div>` : ""}
      </div>
    `;
  }).join("");
}

function renderInstructions(items) {
  // 未登録項目は左右の一覧には混ぜず、一番下の「未登録」へ送る。
  const registeredItems = items.filter(item => item.category !== "未登録");
  const unregisteredItems = items.filter(item => item.category === "未登録");

  // 右側にはカラー系だけを表示する。
  // それ以外（バンパー、スカート、ホイール、リバリー、ロールケージ等）は左側へ。
  const isColorSide = item => item.category === "カラー";

  const partItems = registeredItems
    .filter(item => !isColorSide(item))
    .sort((a,b) => (nameOrder[a.name] ?? 9999) - (nameOrder[b.name] ?? 9999));

  const settingItems = registeredItems
    .filter(isColorSide)
    .sort((a,b) => (nameOrder[a.name] ?? 9999) - (nameOrder[b.name] ?? 9999));

  const partGrid = document.getElementById("partInstructionGrid");
  const settingGrid = document.getElementById("settingInstructionGrid");

  document.getElementById("partInstructionCount").textContent =
    `${partItems.length}件`;

  document.getElementById("settingInstructionCount").textContent =
    `${settingItems.length}件`;

  partGrid.innerHTML = partItems.length
    ? partItems.map(item => {
        const choice = getInstructionChoice(item.detail);

        return `
          <div class="instruction-card">
            <div class="instruction-row">
              <span class="instruction-label">パーツ</span>
              <span class="instruction-value">${escapeHtml(item.category)}</span>
            </div>
            <div class="instruction-row">
              <span class="instruction-label">変更項目</span>
              <span class="instruction-value">${escapeHtml(item.name)}</span>
            </div>
            <div class="instruction-row">
              <span class="instruction-label">${choice.numbered ? "選択番号" : "選択内容"}</span>
              <span class="instruction-value instruction-choice">${escapeHtml(choice.numbered ? choice.numberText : choice.description)}</span>
            </div>
            ${choice.numbered && choice.description ? `
            <div class="instruction-row">
              <span class="instruction-label">選択内容</span>
              <span class="instruction-value">${escapeHtml(choice.description)}</span>
            </div>` : ""}
          </div>
        `;
      }).join("")
    : '<div class="instruction-empty">パーツ項目はありません。</div>';

  settingGrid.innerHTML = settingItems.length
    ? settingItems.map(item => `
        <div class="instruction-card">
          <div class="instruction-row">
            <span class="instruction-label">カテゴリ</span>
            <span class="instruction-value">${escapeHtml(item.category)}</span>
          </div>
          <div class="instruction-row">
            <span class="instruction-label">変更項目</span>
            <span class="instruction-value">${escapeHtml(item.name)}</span>
          </div>
          <div class="instruction-row">
            <span class="instruction-label">設定内容</span>
            <span class="instruction-value instruction-choice">${escapeHtml(String(item.detail || "").trim() || "未設定")}</span>
          </div>
        </div>
      `).join("")
    : '<div class="instruction-empty">カラー項目はありません。</div>';

  renderUnregistered(unregisteredItems);
}

let analyzerCustomContribution = 0;
let analyzerPaintContribution = 0;

function analyzeVehicleOrder() {
  const orderInput = document.getElementById("orderInput");
  const customQty = document.getElementById("customQty");
  const paintQty = document.getElementById("paintQty");
  const status = document.getElementById("analyzerStatus");

  const items = parseOrder(orderInput.value);

  if (!items.length) {
    status.textContent = "解析できる項目がありません";
    return;
  }

  const manualCustom =
    Math.max(0, (Number(customQty.value) || 0) - analyzerCustomContribution);

  const manualPaint =
    Math.max(0, (Number(paintQty.value) || 0) - analyzerPaintContribution);

  analyzerPaintContribution =
    items.filter(item => item.category === "カラー").length;

  analyzerCustomContribution =
    items.length - analyzerPaintContribution;

  customQty.value =
    manualCustom + analyzerCustomContribution;

  paintQty.value =
    manualPaint + analyzerPaintContribution;

  const grouped = new Map();

  items
    .filter(item => item.category !== "未登録")
    .forEach(item => {
    const info =
      requiredItemMap[item.category] ||
      [item.category, item.category];

    const key = info[0];

    if (!grouped.has(key)) {
      grouped.set(key, {
        name:info[0],
        sub:info[1],
        count:0,
        category:item.category
      });
    }

    grouped.get(key).count++;
  });

  const groups = [...grouped.values()].sort((a,b) =>
    (categoryOrder[a.category] ?? 9999) -
    (categoryOrder[b.category] ?? 9999)
  );

  document.getElementById("needGrid").innerHTML =
    groups.map(item => `
      <div class="need-card">
        <div>
          <b>${escapeHtml(item.name)}</b>
          <small>${escapeHtml(item.sub)}</small>
        </div>
        <strong>×${item.count}</strong>
      </div>
    `).join("");

  document.getElementById("analysisItemCount").textContent =
    `${items.length}個`;

  document.getElementById("analysisTypeCount").textContent =
    `${groups.length}種類`;

  document.getElementById("analysisCustomCount").textContent =
    analyzerCustomContribution;

  document.getElementById("analysisPaintCount").textContent =
    analyzerPaintContribution;

  renderInstructions(items);

  const unregisteredCount = items.filter(item => item.category === "未登録").length;

  status.textContent = unregisteredCount
    ? `${items.length}件を解析（未登録 ${unregisteredCount}件）`
    : `${items.length}件を解析して料金に反映しました`;

  document.getElementById("analyzerResult")
    .classList.add("show");

  calculate();
}

function clearVehicleAnalysis() {
  const customQty = document.getElementById("customQty");
  const paintQty = document.getElementById("paintQty");

  customQty.value =
    Math.max(0, (Number(customQty.value) || 0) - analyzerCustomContribution);

  paintQty.value =
    Math.max(0, (Number(paintQty.value) || 0) - analyzerPaintContribution);

  analyzerCustomContribution = 0;
  analyzerPaintContribution = 0;

  document.getElementById("orderInput").value = "";
  document.getElementById("needGrid").innerHTML = "";
  document.getElementById("partInstructionGrid").innerHTML = "";
  document.getElementById("settingInstructionGrid").innerHTML = "";
  document.getElementById("partInstructionCount").textContent = "0件";
  document.getElementById("settingInstructionCount").textContent = "0件";
  const unregisteredSection = document.getElementById("unregisteredSection");
  if (unregisteredSection) unregisteredSection.hidden = true;
  const unregisteredGrid = document.getElementById("unregisteredGrid");
  if (unregisteredGrid) unregisteredGrid.innerHTML = "";
  const unregisteredCount = document.getElementById("unregisteredCount");
  if (unregisteredCount) unregisteredCount.textContent = "0件";
  document.getElementById("analysisItemCount").textContent = "0個";
  document.getElementById("analysisTypeCount").textContent = "0種類";
  document.getElementById("analysisCustomCount").textContent = "0";
  document.getElementById("analysisPaintCount").textContent = "0";
  document.getElementById("partInstructionGrid").innerHTML = "";
  document.getElementById("settingInstructionGrid").innerHTML = "";
  document.getElementById("partInstructionCount").textContent = "0件";
  document.getElementById("settingInstructionCount").textContent = "0件";
  document.getElementById("analyzerStatus").textContent = "入力待ち";

  document.getElementById("analyzerResult")
    .classList.remove("show");

  calculate();
}

document.getElementById("analyzeBtn")
  .addEventListener("click", analyzeVehicleOrder);

document.getElementById("clearAnalysisBtn")
  .addEventListener("click", clearVehicleAnalysis);

/* =========================
   共通ボタン
========================= */

document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input[type=checkbox]").forEach(input => {
    input.checked = false;
  });

  document.querySelectorAll(".qty").forEach(input => {
    input.value = 0;
  });

  analyzerCustomContribution = 0;
  analyzerPaintContribution = 0;

  document.getElementById("orderInput").value = "";
  document.getElementById("needGrid").innerHTML = "";
  document.getElementById("analysisItemCount").textContent = "0個";
  document.getElementById("analysisTypeCount").textContent = "0種類";
  document.getElementById("analysisCustomCount").textContent = "0";
  document.getElementById("analysisPaintCount").textContent = "0";
  document.getElementById("partInstructionGrid").innerHTML = "";
  document.getElementById("settingInstructionGrid").innerHTML = "";
  document.getElementById("partInstructionCount").textContent = "0件";
  document.getElementById("settingInstructionCount").textContent = "0件";
  const unregisteredSection = document.getElementById("unregisteredSection");
  if (unregisteredSection) unregisteredSection.hidden = true;
  const unregisteredGrid = document.getElementById("unregisteredGrid");
  if (unregisteredGrid) unregisteredGrid.innerHTML = "";
  const unregisteredCount = document.getElementById("unregisteredCount");
  if (unregisteredCount) unregisteredCount.textContent = "0件";
  document.getElementById("analyzerStatus").textContent = "入力待ち";
  document.getElementById("analyzerResult").classList.remove("show");

  calculate();
  document.getElementById("message").textContent =
    "リセットしました";
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const total = calculate();

  try {
    await navigator.clipboard.writeText(String(total));
    document.getElementById("message").textContent =
      "金額をコピーしました";
  } catch {
    document.getElementById("message").textContent =
      "コピーできませんでした";
  }
});

/* =========================
   ダークモード
========================= */

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("mechanic-theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "mechanic-theme",
    dark ? "dark" : "light"
  );

  themeBtn.textContent =
    dark ? "☀️" : "🌙";
});

calculate();

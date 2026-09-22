/*
  Vehicle Analyzer
  知り合いからもらった order-parser.js の分類ルールをベースに、
  カスタム項目 → 実際に必要なアイテムへ変換して集計します。
*/

const neededMap = {
  "外装カスタム": {
    name: "外装パーツ",
    en: "Exterior Cosmetics / externals",
    icon: "🛠️"
  },
  "カラー": {
    name: "車両塗装缶",
    en: "Vehicle Paint Can / paintcan",
    icon: "🎨"
  },
  "バンパー": {
    name: "バンパー",
    en: "Vehicle Bumper / bumper",
    icon: "🚗"
  },
  "スカート": {
    name: "スカート",
    en: "Vehicle Skirts / skirts",
    icon: "〰️"
  },
  "ナンバープレート": {
    name: "ナンバープレート",
    en: "Customized Plates / customplate",
    icon: "🔖"
  },
  "ボンネット": {
    name: "ボンネット",
    en: "Vehicle Hood / hood",
    icon: "🔧"
  },
  "内装カスタム": {
    name: "内装パーツ",
    en: "Internal Cosmetics / internals",
    icon: "⚙️"
  },
  "リバリー": {
    name: "ラッピング",
    en: "Livery Roll / livery",
    icon: "🎨"
  },
  "ロールケージ": {
    name: "ロールケージ",
    en: "Roll Cage / rollcage",
    icon: "🛡️"
  },
  "シートカラー": {
    name: "シート",
    en: "Seat Cosmetics / seat",
    icon: "💺"
  },
  "スポイラー": {
    name: "スポイラー",
    en: "Vehicle Spoiler / spoiler",
    icon: "🪽"
  },
  "フィルムキット": {
    name: "フィルムキット",
    en: "Window Tint Kit / tint_supplies",
    icon: "🪟"
  }
};

const categoryOrder = {
  "外装カスタム": 1,
  "カラー": 2,
  "バンパー": 3,
  "スカート": 4,
  "ナンバープレート": 5,
  "ボンネット": 6,
  "内装カスタム": 7,
  "リバリー": 8,
  "ロールケージ": 9,
  "シートカラー": 10,
  "スポイラー": 11,
  "フィルムキット": 12
};

const nameOrder = {
  "スポイラー":1,
  "リアバンパー":2,
  "エアフィルター":3,
  "左フェンダー":4,
  "フロントバンパー":5,
  "スカート":6,
  "プレート":7,
  "右フェンダー":8,
  "シート":9,
  "アンテナ":10,
  "ロールケージ":11,
  "ボンネット":12,
  "グリル":13,
  "トリムB":14,
  "トランク":15,
  "ラッピング":16,
  "メインカラー":17,
  "サブカラー":18,
  "パール":19,
  "内装":20,
  "ナンバープレート":21,
  "ウィンドウの色合い":22
};

function isColorItem(name, detail) {
  const names = [
    "メインカラー","サブカラー","プライマリ","セカンダリー",
    "パール","パールセント","ホイールカラー","内装","インテリア"
  ];
  if (names.includes(name)) return true;
  if (name === "ホイール") return true;
  return false;
}

function getCategory(name, detail) {
  if (isColorItem(name, detail)) return "カラー";

  if (["リアバンパー","フロントバンパー","グリル"].includes(name))
    return "バンパー";

  if (["左フェンダー","右フェンダー","右フェンダー（バニティホルダー）","サイドスカート","スカート"].includes(name))
    return "スカート";

  if (["ボンネット","フード"].includes(name))
    return "ボンネット";

  if (name === "ルーフ") return "ルーフ";
  if (name === "マフラー") return "マフラー";
  if (name === "スポイラー") return "スポイラー";
  if (name === "シート") return "シートカラー";

  if (["Wheels","ホイールリム","ホイールリム（バイク用）"].includes(name))
    return "カスタムホイール";

  if ([
    "ドアスピーカー","ダッシュボード","ダイヤル","ステアリングホイール",
    "メーター","オーナメント","プレート","シフトレバー","スピーカー"
  ].includes(name))
    return "内装カスタム";

  if ([
    "トリムA","トリムB","アンテナ","アーチカバー","エンジンブロック",
    "フィルター","ストラットタワーバー","エアフィルター","エンジンストラット",
    "トランク","突力装置","燃料タンク","エクストラパーツ"
  ].includes(name))
    return "外装カスタム";

  if (name === "ロールケージ") return "ロールケージ";

  if ([
    "バニティプレート","カスタムプレート",
    "ナンバープレートホルダー","ナンバープレート"
  ].includes(name))
    return "ナンバープレート";

  if (["ウィンドウの色合い","ガラススモーク"].includes(name))
    return "フィルムキット";

  if (["ラッピング","リバリー"].includes(name))
    return "リバリー";

  if (name === "クラクション") return "クラクション";
  if (["ヘッドライト兼アンダーライト","ヘッドライト"].includes(name))
    return "ヘッドライト";
  if (["アンダーカラー変更","アンダーネオンカラー"].includes(name))
    return "アンダーネオン";
  if (name === "タイヤスモーク") return "タイヤスモーク";
  if (["ニトロ冷却噴射時カラー","ニトロパージコントロール"].includes(name))
    return "ニトロパージ";

  return "その他";
}

function parseOrder(text) {
  const result = [];
  const regex = /([^,\[\]]+?)\s*-\s*\[\s*([^\]]*?)\s*\](?:,|$)/g;

  let match;

  while ((match = regex.exec(text)) !== null) {
    const name = match[1].trim();
    const detail = match[2].trim();

    if (name) {
      result.push({
        name,
        detail,
        category: getCategory(name, detail)
      });
    }
  }

  return result;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[char]));
}

function analyze() {
  const input = document.getElementById("orderInput").value.trim();
  const items = parseOrder(input);

  const grouped = new Map();

  items.forEach(item => {
    const info = neededMap[item.category] || {
      name: item.category,
      en: item.category,
      icon: "📦"
    };

    if (!grouped.has(info.name)) {
      grouped.set(info.name, {
        ...info,
        count: 0,
        category: item.category
      });
    }

    grouped.get(info.name).count++;
  });

  const summary = [...grouped.values()].sort((a, b) =>
    (categoryOrder[a.category] ?? 999) -
    (categoryOrder[b.category] ?? 999)
  );

  const itemCount = document.getElementById("itemCount");
  const typeCount = document.getElementById("typeCount");
  const summaryGrid = document.getElementById("summaryGrid");
  const detailGrid = document.getElementById("detailGrid");

  itemCount.textContent = `${items.length}個`;
  typeCount.textContent = `${summary.length}種類`;

  document.getElementById("parseStatus").textContent =
    items.length ? `${items.length}件を解析しました` : "解析できる項目がありません";

  if (!summary.length) {
    summaryGrid.className = "analyzer-summary empty";
    summaryGrid.innerHTML =
      '<div class="empty-state">解析できる項目がありません。</div>';
  } else {
    summaryGrid.className = "analyzer-summary";

    summaryGrid.innerHTML = summary.map(item => `
      <div class="need-card">
        <div class="need-icon">${item.icon}</div>
        <div>
          <div class="need-name">${escapeHtml(item.name)}</div>
          <div class="need-en">${escapeHtml(item.en)}</div>
        </div>
        <div class="need-count">×${item.count}</div>
      </div>
    `).join("");
  }

  const sortedItems = [...items].sort((a, b) =>
    (nameOrder[a.name] ?? 999) -
    (nameOrder[b.name] ?? 999)
  );

  if (!sortedItems.length) {
    detailGrid.innerHTML =
      '<div class="empty-state">まだ解析されていません。</div>';
    return;
  }

  detailGrid.innerHTML = sortedItems.map(item => {
    const info = neededMap[item.category] || {
      name: item.category,
      en: item.category
    };

    return `
      <article class="custom-card">
        <div class="custom-head">
          <div class="custom-name">${escapeHtml(item.name)}</div>
          <div class="custom-category">${escapeHtml(item.category)}</div>
        </div>

        <div class="custom-value">${escapeHtml(item.detail)}</div>

        <div class="required-box">
          <div class="required-label">必要アイテム</div>
          <div class="required-name">${escapeHtml(info.name)}</div>
          <div class="required-en">${escapeHtml(info.en)} ×1</div>
        </div>
      </article>
    `;
  }).join("");
}

const sample =
  "スポイラー - [12. NULL ],リアバンパー - [1. NULL ],エアフィルター - [1. NULL ],左フェンダー - [5. NULL ],フロントバンパー - [4. NULL ],スカート - [2. NULL ],プレート - [1. NULL ],右フェンダー - [3. NULL ],シート - [6. NULL ],アンテナ - [2. NULL ],ロールケージ - [8. NULL ],ボンネット - [9. NULL ],グリル - [5. NULL ],トリムB - [4. NULL ],トランク - [1. NULL ],ラッピング - [5. NULL ],メインカラー - [ チョコレートブラウン (メタリック) ],サブカラー - [ チョコレートブラウン (メタリック) ],パール - [ イエロー (メタリック) ],内装 - [ マットブラック (マット) ],ナンバープレート - [ パウンダーズ ],ウィンドウの色合い - [ ピュアブラック ]";

document.getElementById("analyzeBtn").addEventListener("click", analyze);

document.getElementById("sampleBtn").addEventListener("click", () => {
  document.getElementById("orderInput").value = sample;
  analyze();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("orderInput").value = "";
  document.getElementById("itemCount").textContent = "0個";
  document.getElementById("typeCount").textContent = "0種類";
  document.getElementById("parseStatus").textContent = "入力待ち";

  document.getElementById("summaryGrid").className =
    "analyzer-summary empty";
  document.getElementById("summaryGrid").innerHTML =
    '<div class="empty-state">オーダーシートを解析すると、必要アイテムがここに表示されます。</div>';

  document.getElementById("detailGrid").innerHTML =
    '<div class="empty-state">まだ解析されていません。</div>';
});

document.getElementById("orderInput").addEventListener("input", () => {
  if (document.getElementById("orderInput").value.trim()) analyze();
});

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("mechanic-theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  localStorage.setItem("mechanic-theme", dark ? "dark" : "light");
  themeBtn.textContent = dark ? "☀️" : "🌙";
});

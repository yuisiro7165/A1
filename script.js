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

const partsGrid = document.getElementById("partsGrid");

for (const [name, price, hasQty] of parts) {
  const card = document.createElement("div");
  card.className = "part";

  card.innerHTML = `
    <div>
      <div class="part-name">${name}</div>
      <div class="part-price">
        ${yen(price)}${hasQty ? " / 個" : ""}
      </div>
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

function calculate() {
  let total = 0;

  document.querySelectorAll(".qty").forEach(input => {
    const quantity = Math.max(0, Number(input.value) || 0);
    total += quantity * Number(input.dataset.price);
  });

  document.querySelectorAll(".tier-check:checked, .part-check:checked")
    .forEach(input => {
      total += Number(input.dataset.price);
    });

  document.getElementById("total").textContent = yen(total);
  return total;
}

document.addEventListener("input", calculate);
document.addEventListener("change", calculate);

document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input[type=checkbox]").forEach(input => input.checked = false);
  document.querySelectorAll(".qty").forEach(input => input.value = 0);
  calculate();
  document.getElementById("message").textContent = "リセットしました";
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const total = calculate();

  try {
    await navigator.clipboard.writeText(String(total));
    document.getElementById("message").textContent = "金額をコピーしました";
  } catch {
    document.getElementById("message").textContent = "コピーできませんでした";
  }
});

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

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
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
}


/* ===== 車両解析 ===== */
function vaColor(n,d){return ["メインカラー","サブカラー","プライマリ","セカンダリー","パール","パールセント","ホイールカラー","インテリア","内装"].includes(n)||n==="ホイール"}
function vaCat(n,d){
 if(vaColor(n,d))return"カラー";
 if(["リアバンパー","フロントバンパー","グリル"].includes(n))return"バンパー";
 if(["左フェンダー","右フェンダー","右フェンダー（バニティホルダー）","サイドスカート","スカート"].includes(n))return"スカート";
 if(["ボンネット","フード"].includes(n))return"ボンネット";
 if(n==="スポイラー")return"スポイラー"; if(n==="シート")return"シートカラー";
 if(["ドアスピーカー","ダッシュボード","ダイヤル","ステアリングホイール","メーター","オーナメント","プレート","シフトレバー","スピーカー"].includes(n))return"内装カスタム";
 if(["トリムA","トリムB","アンテナ","アーチカバー","エンジンブロック","フィルター","ストラットタワーバー","エアフィルター","エンジンストラット","トランク","突力装置","燃料タンク","エクストラパーツ"].includes(n))return"外装カスタム";
 if(n==="ロールケージ")return"ロールケージ";
 if(["バニティプレート","カスタムプレート","ナンバープレートホルダー","ナンバープレート"].includes(n))return"ナンバープレート";
 if(["ウィンドウの色合い","ガラススモーク"].includes(n))return"フィルムキット";
 if(["ラッピング","リバリー"].includes(n))return"リバリー";
 return"その他";
}
function vaParse(t){const a=[],r=/([^,\[\]]+?)\s*-\s*\[\s*([^\]]*?)\s*\](?:,|$)/g;let m;while((m=r.exec(t))!==null){let n=m[1].trim(),d=m[2].trim();if(n)a.push({name:n,detail:d,category:vaCat(n,d)})}return a}
const vaMap={
 "外装カスタム":["外装パーツ","Exterior Cosmetics / externals"],"カラー":["車両塗装缶","Vehicle Paint Can / paintcan"],
 "バンパー":["バンパー","Vehicle Bumper / bumper"],"スカート":["スカート","Vehicle Skirts / skirts"],
 "ナンバープレート":["ナンバープレート","Customized Plates / customplate"],"ボンネット":["ボンネット","Vehicle Hood / hood"],
 "内装カスタム":["内装パーツ","Internal Cosmetics / internals"],"リバリー":["ラッピング","Livery Roll / livery"],
 "ロールケージ":["ロールケージ","Roll Cage / rollcage"],"シートカラー":["シート","Seat Cosmetics / seat"],
 "スポイラー":["スポイラー","Vehicle Spoiler / spoiler"],"フィルムキット":["フィルムキット","Window Tint Kit / tint_supplies"]
};
let vaCustom=0,vaPaint=0;
function analyzeVehicleOrder(){
 const items=vaParse(document.getElementById("orderInput").value),cq=document.getElementById("customQty"),pq=document.getElementById("paintQty");
 if(!items.length){document.getElementById("analyzerStatus").textContent="解析できる項目がありません";return}
 const mc=Math.max(0,(+cq.value||0)-vaCustom),mp=Math.max(0,(+pq.value||0)-vaPaint);
 vaPaint=items.filter(x=>x.category==="カラー").length;vaCustom=items.length-vaPaint;
 cq.value=mc+vaCustom;pq.value=mp+vaPaint;
 const g=new Map();items.forEach(x=>{const i=vaMap[x.category]||[x.category,x.category],k=i[0];if(!g.has(k))g.set(k,{n:i[0],s:i[1],c:0});g.get(k).c++});
 const groups=[...g.values()];
 document.getElementById("needGrid").innerHTML=groups.map(x=>`<div class="need-card"><div><b>${x.n}</b><small>${x.s}</small></div><strong>×${x.c}</strong></div>`).join("");
 document.getElementById("analysisItemCount").textContent=items.length+"個";document.getElementById("analysisTypeCount").textContent=groups.length+"種類";
 document.getElementById("analysisCustomCount").textContent=vaCustom;document.getElementById("analysisPaintCount").textContent=vaPaint;
 document.getElementById("analyzerStatus").textContent=items.length+"件を解析して料金に反映しました";document.getElementById("analyzerResult").classList.add("show");calculate();
}
function clearVehicleAnalysis(){
 const cq=document.getElementById("customQty"),pq=document.getElementById("paintQty");
 cq.value=Math.max(0,(+cq.value||0)-vaCustom);pq.value=Math.max(0,(+pq.value||0)-vaPaint);vaCustom=vaPaint=0;
 document.getElementById("orderInput").value="";document.getElementById("needGrid").innerHTML="";document.getElementById("analyzerResult").classList.remove("show");
 document.getElementById("analyzerStatus").textContent="入力待ち";calculate();
}
document.getElementById("analyzeBtn")?.addEventListener("click",analyzeVehicleOrder);
document.getElementById("clearAnalysisBtn")?.addEventListener("click",clearVehicleAnalysis);

calculate();

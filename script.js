const tierData = {
  "エンジン":[1200000,1300000,1600000,2000000,2200000],
  "トランスミッション":[1200000,1300000,1600000,2000000],
  "サスペンション":[1200000,1300000,1600000,2000000,2200000],
  "ブレーキ":[1200000,1300000,1600000,2000000],
  "オイルポンプ":[1200000,1300000,1600000],
  "ドライブシャフト":[1200000,1300000,1600000],
  "シリンダーヘッド":[1200000,1300000,1600000],
  "燃料タンク":[1200000,1300000,1600000],
  "バッテリーケーブル":[1200000,1300000,1600000]
};

const parts = [
  ["アーマー",40000000,false],["ターボ",5000000,false],
  ["ニトロ新規",4000000,true],["ニトロ交換",2000000,true],
  ["ハーネス",3000000,false],["アンチラグ",3000000,false],
  ["ドリフトタイヤ",1000000,false],["マニュアルギア",1000000,false],
  ["ダクトテープ",500000,true],["車両塗装缶",250000,true],
  ["ネオンコントローラー",200000,false],["クリーニングキット",100000,false]
];

const yen = n => "¥" + Number(n).toLocaleString("ja-JP");
const tierItems = document.getElementById("tierItems");

for(const [name,prices] of Object.entries(tierData)){
  const row=document.createElement("div");
  row.className="tier-row";
  const label=document.createElement("span");
  label.textContent=name;
  row.appendChild(label);

  for(let i=0;i<5;i++){
    const cell=document.createElement("div");
    cell.className="tier-cell";
    if(prices[i]){
      const label=document.createElement("label");
      const input=document.createElement("input");
      input.type="checkbox";
      input.className="tier-check";
      input.dataset.price=prices[i];
      input.dataset.name=name;
      input.dataset.tier=i+1;
      label.appendChild(input);
      const p=document.createElement("span");
      p.className="tier-price";
      p.textContent=yen(prices[i]);
      label.appendChild(p);
      cell.appendChild(label);
    }
    row.appendChild(cell);
  }
  tierItems.appendChild(row);
}

function addCheckGrid(id,count,price,className){
  const grid=document.getElementById(id);
  for(let i=1;i<=count;i++){
    const item=document.createElement("label");
    item.className="check-item";
    item.innerHTML=`<span>${i}</span><input type="checkbox" class="${className}" data-price="${price}">`;
    grid.appendChild(item);
  }
}
addCheckGrid("exteriorGrid",15,200000,"exterior-check");
addCheckGrid("paintGrid",9,100000,"paint-check");

const partsGrid=document.getElementById("partsGrid");
for(const [name,price,hasQty] of parts){
  const card=document.createElement("div");
  card.className="part";
  card.innerHTML=`
    <div>
      <div class="part-name">${name}</div>
      <div class="part-price">${yen(price)}${hasQty?" / 個":""}</div>
      ${hasQty?`<input type="number" min="0" value="0" class="qty" data-price="${price}">`:""}
    </div>
    ${hasQty?"":"<input type=\"checkbox\" class=\"part-check\" data-price=\""+price+"\">"}
  `;
  partsGrid.appendChild(card);
}

function calculate(){
  let total=0;

  document.querySelectorAll(".qty").forEach(i=>{
    total += Math.max(0,Number(i.value)||0)*Number(i.dataset.price);
  });
  document.querySelectorAll(".tier-check:checked,.exterior-check:checked,.paint-check:checked,.part-check:checked").forEach(i=>{
    total += Number(i.dataset.price);
  });

  document.getElementById("total").textContent=yen(total);
  return total;
}

document.addEventListener("input",calculate);
document.addEventListener("change",calculate);

document.getElementById("resetBtn").addEventListener("click",()=>{
  document.querySelectorAll("input[type=checkbox]").forEach(i=>i.checked=false);
  document.querySelectorAll(".qty").forEach(i=>i.value=0);
  calculate();
  document.getElementById("message").textContent="リセットしました";
});

document.getElementById("copyBtn").addEventListener("click",async()=>{
  const text=Number(calculate()).toLocaleString("ja-JP");
  try{
    await navigator.clipboard.writeText(text);
    document.getElementById("message").textContent="金額をコピーしました";
  }catch{
    document.getElementById("message").textContent="コピーできませんでした";
  }
});

document.querySelectorAll(".tier-check").forEach(input=>{
  input.addEventListener("change",()=>{
    if(input.checked){
      document.querySelectorAll(`.tier-check[data-name="${input.dataset.name}"]`).forEach(other=>{
        if(other!==input) other.checked=false;
      });
    }
    calculate();
  });
});

calculate();

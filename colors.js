const PRESET_CATEGORIES = ["クラシック","メタリック","マット","金属","カメレオン"];
const GROUPS = ["ギャング","半グレ","その他"];
const SLOT_DEFS = [
  {key:"main", label:"メイン"},
  {key:"sub", label:"サブ"},
  {key:"pearl", label:"パール"},
  {key:"wheel", label:"ホイール"}
];
const PICKER_FINISHES = ["クラシック","マット","クローム","金属"];
const INPUT_TYPES = [...PRESET_CATEGORIES,"RGBピッカー","HEXピッカー"];
const STORAGE_KEY = "palette-town-color-schemes-v2";
const DB_URL = String(window.COLOR_SHARED_DB_URL || "").replace(/\/$/, "");
const PALETTE = Array.isArray(window.INITIAL_COLORS) ? window.INITIAL_COLORS : [];
let schemes = [];
let activeGroup = "すべて";
let syncTimer = null;
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `scheme-${Date.now()}-${Math.random().toString(36).slice(2)}`);
const clamp = n => Math.max(0, Math.min(255, Number(n) || 0));
function normalizeHex(value){let v=String(value||"").trim().toUpperCase();if(!v)return "";if(!v.startsWith("#"))v="#"+v;return /^#[0-9A-F]{6}$/.test(v)?v:""}
function hexToRgb(hex){const h=normalizeHex(hex);if(!h)return null;return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)}}
function rgbToHex(r,g,b){return `#${[r,g,b].map(v=>clamp(v).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}
function parseRgb(value){const m=String(value||"").match(/(?:rgb\s*\()?\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)?/i);return m?{r:clamp(m[1]),g:clamp(m[2]),b:clamp(m[3])}:null}
function setStatus(text,shared=false){$("syncStatus").textContent=text;$("syncStatus").classList.toggle("shared",shared)}
async function fetchRemote(){const r=await fetch(`${DB_URL}/colorSchemes.json`,{cache:"no-store"});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}
async function putRemote(data){const r=await fetch(`${DB_URL}/colorSchemes.json`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});if(!r.ok)throw new Error(`HTTP ${r.status}`)}
async function loadData(){
  if(DB_URL){
    try{
      setStatus("共有データを読み込み中…",true);
      const remote=await fetchRemote();
      schemes=Array.isArray(remote)?remote:[];
      setStatus("共有モード / 全員に反映",true);
      $("storageNote").textContent="共有データベースを使用中です。追加・削除は他の閲覧者にも反映されます。";
      startSync();return;
    }catch(e){console.error(e);setStatus("共有DBに接続できません / ローカルモード")}
  }
  try{const raw=localStorage.getItem(STORAGE_KEY);schemes=raw?JSON.parse(raw):[]}catch{schemes=[]}
  $("storageNote").textContent="現在はこの端末だけに保存されるローカルモードです。共有保存先を接続すると全員で同じ一覧を編集できます。";
  setStatus("ローカル保存モード");
}
async function saveData(){
  schemes.sort((a,b)=>GROUPS.indexOf(a.group)-GROUPS.indexOf(b.group)||String(a.name).localeCompare(String(b.name),"ja"));
  if(DB_URL){try{await putRemote(schemes);setStatus("保存済み / 全員に反映",true)}catch(e){console.error(e);setStatus("共有DBへの保存に失敗")}}
  else{localStorage.setItem(STORAGE_KEY,JSON.stringify(schemes));setStatus("この端末に保存済み")}
}
function startSync(){clearInterval(syncTimer);syncTimer=setInterval(async()=>{try{const remote=await fetchRemote();if(Array.isArray(remote)&&JSON.stringify(remote)!==JSON.stringify(schemes)){schemes=remote;render()}}catch(e){console.warn(e)}},7000)}
function presetOptions(category, selected=""){
  return PALETTE.filter(x=>x.category===category).map(x=>`<option value="${escapeHtml(x.id)}" ${x.id===selected?"selected":""}>${escapeHtml(x.number)}. ${escapeHtml(x.name)}</option>`).join("");
}
function defaultSpec(){return {enabled:false,type:"クラシック",presetId:"",finish:"クラシック",rgb:"rgb(255,255,255)",hex:"#FFFFFF"}}
function getSlotState(key){
  const root=document.querySelector(`[data-slot="${key}"]`);if(!root)return defaultSpec();
  const type=root.querySelector(".slot-type").value;
  const enabled=root.classList.contains("open") && root.querySelector(".slot-enabled").checked;
  const spec={enabled,type,presetId:"",finish:"",rgb:"",hex:""};
  if(PRESET_CATEGORIES.includes(type)) spec.presetId=root.querySelector(".preset-select")?.value||"";
  if(type==="RGBピッカー"){
    spec.finish=root.querySelector(".finish-select")?.value||"クラシック";
    const rgb=parseRgb(root.querySelector(".rgb-text")?.value||"")||{r:255,g:255,b:255};
    spec.rgb=`rgb(${rgb.r},${rgb.g},${rgb.b})`;spec.hex=rgbToHex(rgb.r,rgb.g,rgb.b);
  }
  if(type==="HEXピッカー"){
    spec.finish=root.querySelector(".finish-select")?.value||"クラシック";
    spec.hex=normalizeHex(root.querySelector(".hex-text")?.value)||"#FFFFFF";
    const rgb=hexToRgb(spec.hex);spec.rgb=rgb?`rgb(${rgb.r},${rgb.g},${rgb.b})`:"";
  }
  return spec;
}
function slotEditorHtml(def){
  return `<section class="slot-editor" data-slot="${def.key}">
    <button class="slot-toggle" type="button"><span>${def.label}</span><span class="slot-open-label">開く</span></button>
    <div class="slot-body">
      <label class="slot-use"><input class="slot-enabled" type="checkbox" checked> この項目を登録する</label>
      <label>指定方法
        <select class="slot-type">${INPUT_TYPES.map(x=>`<option value="${x}">${x}</option>`).join("")}</select>
      </label>
      <div class="slot-dynamic"></div>
      <div class="slot-preview"><span class="preview-swatch"></span><strong class="preview-text">未設定</strong></div>
    </div>
  </section>`;
}
function renderSlotDynamic(root){
  const type=root.querySelector(".slot-type").value;
  const dynamic=root.querySelector(".slot-dynamic");
  if(PRESET_CATEGORIES.includes(type)){
    dynamic.innerHTML=`<label>カラー<select class="preset-select">${presetOptions(type)}</select></label>`;
    const p=dynamic.querySelector(".preset-select");if(!p.value&&p.options.length)p.selectedIndex=0;
  }else if(type==="RGBピッカー"){
    dynamic.innerHTML=`<label>仕上げ選択<select class="finish-select">${PICKER_FINISHES.map(x=>`<option>${x}</option>`).join("")}</select></label>
      <label>RGB<div class="picker-row"><input class="native-picker rgb-color" type="color" value="#FFFFFF"><input class="rgb-text" value="rgb(255,255,255)" placeholder="rgb(255,255,255)"></div></label>`;
  }else{
    dynamic.innerHTML=`<label>仕上げ選択<select class="finish-select">${PICKER_FINISHES.map(x=>`<option>${x}</option>`).join("")}</select></label>
      <label>HEX<div class="picker-row"><input class="native-picker hex-color" type="color" value="#FFFFFF"><input class="hex-text" value="#FFFFFF" maxlength="7" placeholder="#FFFFFF"></div></label>`;
  }
  updateSlotPreview(root);
}
function updateSlotPreview(root){
  const type=root.querySelector(".slot-type").value;
  let text="未設定", color="";
  if(PRESET_CATEGORIES.includes(type)){
    const id=root.querySelector(".preset-select")?.value;const p=PALETTE.find(x=>x.id===id);
    if(p){text=`${type} / ${p.number}.${p.name}`;color=normalizeHex(p.hex)}
  }else if(type==="RGBピッカー"){
    const rgb=parseRgb(root.querySelector(".rgb-text")?.value||"");const finish=root.querySelector(".finish-select")?.value||"クラシック";
    if(rgb){color=rgbToHex(rgb.r,rgb.g,rgb.b);text=`${finish} / rgb(${rgb.r},${rgb.g},${rgb.b})`}
  }else{
    const h=normalizeHex(root.querySelector(".hex-text")?.value);const finish=root.querySelector(".finish-select")?.value||"クラシック";
    if(h){color=h;text=`${finish} / ${h}`}
  }
  root.querySelector(".preview-text").textContent=text;
  const sw=root.querySelector(".preview-swatch");sw.style.background=color||"";sw.classList.toggle("empty",!color);
}
function setupSlotEditors(){
  $("slotEditors").innerHTML=SLOT_DEFS.map(slotEditorHtml).join("");
  $("slotEditors").addEventListener("click",e=>{const btn=e.target.closest(".slot-toggle");if(!btn)return;const root=btn.closest(".slot-editor");root.classList.toggle("open");btn.querySelector(".slot-open-label").textContent=root.classList.contains("open")?"閉じる":"開く"});
  $("slotEditors").addEventListener("change",e=>{
    const root=e.target.closest(".slot-editor");if(!root)return;
    if(e.target.classList.contains("slot-type")) renderSlotDynamic(root);
    if(e.target.classList.contains("rgb-color")){const rgb=hexToRgb(e.target.value);root.querySelector(".rgb-text").value=`rgb(${rgb.r},${rgb.g},${rgb.b})`}
    if(e.target.classList.contains("hex-color")) root.querySelector(".hex-text").value=e.target.value.toUpperCase();
    updateSlotPreview(root);
  });
  $("slotEditors").addEventListener("input",e=>{
    const root=e.target.closest(".slot-editor");if(!root)return;
    if(e.target.classList.contains("rgb-text")){const rgb=parseRgb(e.target.value);if(rgb)root.querySelector(".rgb-color").value=rgbToHex(rgb.r,rgb.g,rgb.b)}
    if(e.target.classList.contains("hex-text")){const h=normalizeHex(e.target.value);if(h)root.querySelector(".hex-color").value=h}
    updateSlotPreview(root);
  });
  document.querySelectorAll(".slot-editor").forEach(root=>renderSlotDynamic(root));
}
function specDisplay(spec){
  if(!spec?.enabled)return null;
  if(PRESET_CATEGORIES.includes(spec.type)){
    const p=PALETTE.find(x=>x.id===spec.presetId);if(!p)return {text:`${spec.type} / 未登録`,color:""};
    return {text:`${spec.type} / ${p.number}.${p.name}`,color:normalizeHex(p.hex)};
  }
  if(spec.type==="RGBピッカー") return {text:`${spec.finish||"クラシック"} / ${spec.rgb||""}`,color:normalizeHex(spec.hex)};
  if(spec.type==="HEXピッカー") return {text:`${spec.finish||"クラシック"} / ${normalizeHex(spec.hex)||spec.hex||""}`,color:normalizeHex(spec.hex)};
  return {text:"未設定",color:""};
}
function cardHtml(item){
  const colors = SLOT_DEFS.map(def => ({ def, value: specDisplay(item.colors?.[def.key]) }));
  const bands = colors.map(({def,value}) => {
    const hex = normalizeHex(value?.color);
    return `<div class="swatch-cell${hex?"":" no-color"}" ${hex ? `style="--swatch:${hex}"` : ""} title="${escapeHtml(def.label+": "+(value?.text||"未設定"))}"><em>${escapeHtml(def.label)}</em></div>`;
  }).join("");
  const rows = colors.filter(({value})=>value).map(({def,value})=>`<div class="scheme-row"><b>${escapeHtml(def.label)}</b><span class="spec-label"><span>${escapeHtml(value.text)}</span><i class="tiny-swatch${value.color?"":" empty"}"${normalizeHex(value.color)?` style="background:${normalizeHex(value.color)}"`:""}></i></span></div>`).join("");
  return `<article class="scheme-card" data-id="${escapeHtml(item.id)}">
      <div class="swatch-band" aria-label="カラーサンプル">${bands}</div>
      <div class="scheme-inner"><div class="scheme-head"><div><h4>${escapeHtml(item.name)}</h4>${item.tag?`<small>${escapeHtml(item.tag)}</small>`:""}</div><span class="group-tag">${escapeHtml(item.group)}</span></div>
      <div class="scheme-rows">${rows||'<div class="no-slots">カラー指定なし</div>'}</div>
      ${item.note?`<div class="scheme-note">${escapeHtml(item.note)}</div>`:""}
      <div class="scheme-actions"><button type="button" class="delete-btn" data-delete="${escapeHtml(item.id)}">削除する</button></div></div>
    </article>`;
}
function filtered(){const q=$("searchInput").value.trim().toLowerCase();return schemes.filter(x=>(activeGroup==="すべて"||x.group===activeGroup)&&(!q||`${x.group} ${x.name} ${x.tag||""} ${x.note||""}`.toLowerCase().includes(q)))}
function setupGroups(){const groups=["すべて",...GROUPS];$("categoryTabs").innerHTML=groups.map(g=>`<button type="button" class="tab${g===activeGroup?" active":""}" data-group="${g}">${g}</button>`).join("")}
function render(){
  setupGroups();const list=filtered();
  $("statsTotal").textContent=schemes.length;
  $("statsGang").textContent=schemes.filter(x=>x.group==="ギャング").length;
  $("statsStreet").textContent=schemes.filter(x=>x.group==="半グレ").length;
  $("statsOther").textContent=schemes.filter(x=>x.group==="その他").length;$("viewTitle").textContent=activeGroup==="すべて"?"登録カラー":activeGroup;$("totalCount").textContent=`${list.length}件`;
  const groups=(activeGroup==="すべて"?GROUPS:[activeGroup]).map(g=>[g,list.filter(x=>x.group===g)]).filter(([,arr])=>arr.length);
  $("schemeSections").innerHTML=groups.length?groups.map(([g,arr],i)=>`<section class="category-section"><div class="category-heading"><div><div class="eyebrow">CATEGORY ${String(i+1).padStart(2,"0")}</div><h3>${escapeHtml(g)}</h3></div><span>${arr.length}件</span></div><div class="scheme-grid">${arr.map(cardHtml).join("")}</div></section>`).join(""):`<div class="empty-state"><div class="empty-symbol"><i style="background:#5267fb"></i><i style="background:#98a9fa"></i><i style="background:#b4c3ea"></i></div><strong>${$("searchInput").value.trim() || activeGroup !== "すべて" ? "該当するカラーがありません" : "まだカラーが登録されていません"}</strong><p>${$("searchInput").value.trim() || activeGroup !== "すべて" ? "検索ワードや区分を変更してみてください。" : "右側の「カラーを新規登録」から追加できます。"}</p></div>`;
}
function clearForm(){const group=$("groupInput").value;$("addForm").reset();$("groupInput").value=group;document.querySelectorAll(".slot-editor").forEach(root=>{root.classList.remove("open");root.querySelector(".slot-open-label").textContent="開く";root.querySelector(".slot-enabled").checked=true;root.querySelector(".slot-type").value="クラシック";renderSlotDynamic(root)})}
async function addScheme(e){
  e.preventDefault();const name=$("nameInput").value.trim();if(!name)return;
  const colors={};SLOT_DEFS.forEach(def=>{const spec=getSlotState(def.key);if(spec.enabled)colors[def.key]=spec});
  schemes.push({id:newId(),group:$("groupInput").value,name,tag:$("tagInput").value.trim(),note:$("noteInput").value.trim(),colors,createdAt:new Date().toISOString()});
  await saveData();clearForm();render();
}
async function removeScheme(id){const item=schemes.find(x=>x.id===id);if(!item)return;if(!confirm(`「${item.name}」を削除しますか？`))return;schemes=schemes.filter(x=>x.id!==id);await saveData();render()}
function exportJson(){const blob=new Blob([JSON.stringify(schemes,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`palette-color-registry-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)}
async function importJson(file){const data=JSON.parse(await file.text());if(!Array.isArray(data))throw new Error("配列形式のJSONではありません");schemes=data;await saveData();render()}
function renderPalette(){const cat=$("paletteCategory").value;const q=$("paletteSearch").value.trim().toLowerCase();const list=PALETTE.filter(x=>(cat==="すべて"||x.category===cat)&&(!q||`${x.number} ${x.name}`.toLowerCase().includes(q)));$("paletteGrid").innerHTML=list.map(x=>`<div class="palette-item"><div class="palette-swatch" style="--swatch:${normalizeHex(x.hex)||"#e9edf4"}"></div><b>${escapeHtml(x.number)}. ${escapeHtml(x.name)}</b><small>${escapeHtml(x.category)}</small></div>`).join("")}
function setupPaletteDialog(){
  $("paletteCategory").innerHTML=["すべて",...PRESET_CATEGORIES].map(x=>`<option>${x}</option>`).join("");
  $("paletteBtn").addEventListener("click",()=>{$("paletteDialog").showModal();renderPalette()});
  $("closePaletteBtn").addEventListener("click",()=>$("paletteDialog").close());
  $("paletteCategory").addEventListener("change",renderPalette);$("paletteSearch").addEventListener("input",renderPalette);
}
function setupEvents(){
  $("searchInput").addEventListener("input",render);
  $("categoryTabs").addEventListener("click",e=>{const b=e.target.closest(".tab");if(!b)return;activeGroup=b.dataset.group;render()});
  $("addForm").addEventListener("submit",addScheme);$("clearFormBtn").addEventListener("click",clearForm);
  $("schemeSections").addEventListener("click",e=>{const b=e.target.closest("[data-delete]");if(b)removeScheme(b.dataset.delete)});
  $("exportBtn").addEventListener("click",exportJson);$("importInput").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{await importJson(file)}catch(err){alert(`読み込みに失敗しました: ${err.message}`)}e.target.value=""});
  $("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("palette-color-theme",document.body.classList.contains("light")?"light":"dark");$("themeBtn").textContent=document.body.classList.contains("light")?"🌙":"☀️"});
}
(async function init(){
  if(localStorage.getItem("palette-color-theme")==="dark")document.body.classList.remove("light");$("themeBtn").textContent=document.body.classList.contains("light")?"🌙":"☀️";
  setupGroups();setupSlotEditors();setupPaletteDialog();setupEvents();await loadData();render();
})();

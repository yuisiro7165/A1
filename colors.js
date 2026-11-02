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
const DB_URL = String(window.COLOR_SHARED_DB_URL || "").trim().replace(/\/$/, "");
const FIREBASE_KEY = String(window.COLOR_FIREBASE_API_KEY || "").trim();
const CLOUD_ENABLED = Boolean(DB_URL && FIREBASE_KEY);
const SYNC_INTERVAL_MS = 5000;
const AUTH_KEY = "palette-town-anonymous-auth-v1";
let authState = null;
let cloudReady = false;
let mutationInProgress = false;
let syncInProgress = false;
let editId = null;
let syncTimer = null;
let showArchived = false;
let authFailure = "";
let authRetryAfter = 0;
let authRetryPromise = null;
const PALETTE = Array.isArray(window.INITIAL_COLORS) ? window.INITIAL_COLORS : [];

// Preset swatches are illustrative only: the shipped 258 preset rows have no RGB/HEX values.
// All values are presentation-only; they are never submitted to Firebase or stored in schemes.
const PRESET_CLASSIC_PREVIEW = ["#101012", "#1D1E21", "#33363A", "#26292D", "#393B3E", "#4A4C50", "#A6A8AC", "#9CA5AD", "#666A70", "#5E626D", "#757776", "#323642", "#52545B", "#D82228", "#B70E14", "#E02824", "#B91A1A", "#B91C13", "#8E121D", "#5F1120", "#D64A1A", "#541724", "#691622", "#B61833", "#E93294", "#E661A6", "#F48993", "#E4772B", "#E86C12", "#F49D24", "#C5A04C", "#996C35", "#E6C82C", "#FFE325", "#D0C93B", "#0B3529", "#174D33", "#557669", "#4C5735", "#43A844", "#275E61", "#88D125", "#172649", "#23344E", "#203967", "#305A85", "#235CAA", "#2F668F", "#4B87A7", "#A4C7D8", "#65A8D0", "#285986", "#1555A8", "#196EE8", "#7FC8E2", "#342019", "#50311E", "#66492D", "#77462E", "#98744B", "#80684C", "#AB8464", "#996344", "#5A4C28", "#8F6B4B", "#B4A57C", "#C7B99A", "#D8D0B3", "#472448", "#603B89", "#291738", "#8A45B4", "#EEE8DA", "#F8F8F2", "#D6DEE5"];
const PRESET_MATTE_PREVIEW = ["#141517", "#5D6065", "#A2A5AA", "#E1E2DF", "#245386", "#142B53", "#0D1E39", "#2B213F", "#51365A", "#B52127", "#6C151F", "#CD6D20", "#D6B42D", "#95C21F", "#36783E", "#1D3B2A", "#566748", "#665E37", "#51422F", "#BA9E74"];
const PRESET_METAL_PREVIEW = ["#79848A", "#383C41", "#BBC5C9", "#E0B84E", "#B99043", "#D8E0E7"];
const PRESET_HUE_PREVIEW = {"ダークグリーン": "#113A31", "ダークティール": "#14545A", "ダークブルー": "#142C6B", "ダークパープル": "#3E206A", "ライトグリーン": "#A1E7AA", "ライトブルー": "#A9D9F4", "ライトパープル": "#CCA7F8", "ライトピンク": "#F7B9D8", "オフホワイト": "#E8E6DF", "ホットピンク": "#F92C96", "バーガンディ": "#68112E", "グラファイト": "#4F5661", "ブラック": "#101217", "ホワイト": "#F0F4F9", "レッド": "#D32846", "ワイン": "#781A35", "パープル": "#842AD4", "ピンク": "#EE74B7", "マゼンタ": "#E124B5", "シアン": "#14D1E5", "ターコイズ": "#21C5B9", "ティール": "#087A86", "ブルー": "#2274CF", "グリーン": "#36A95E", "ライム": "#9BE12E", "イエロー": "#E8C629", "オレンジ": "#F28724", "カッパー": "#B56F3E", "ブロンズ": "#9E6B3C", "シャンパン": "#DAC6A0", "ゴールド": "#DDBA4B", "ブラウン": "#73503A", "クリーム": "#EEE3B7"};
const PRESET_SPECIAL_PREVIEW = {"ブラック・オイルスピル": ["#0C1220", "#13587A", "#5D2B7F", "#12222D"], "ブラック・レインボー": ["#10121A", "#5A1C72", "#164C6E", "#6A4D23"], "ブラック・ホログラフィック": ["#15151D", "#537EE8", "#BC72BB", "#82CCC5"], "ホワイト・ホログラフィック": ["#ECEEF1", "#A6E4E2", "#D8A6E9", "#FFF6DF"], "ホワイトプリズマティック": ["#FCFCFB", "#C6D5F6", "#F2BCE9"], "グラファイトプリズマティック": ["#505460", "#8B77C8", "#6285A7"], "モノクローム": ["#0B0B11", "#6E7077", "#F4F4F4"], "ナイト/デイ": ["#11234A", "#D6A54E", "#E6D6B3"], "フルレインボー": ["#EF555D", "#F2BA48", "#6FD18A", "#4B8CE2", "#C16BEA"], "レッド/レインボー フリップ": ["#C53248", "#F0B951", "#40B5B5", "#9B48CB"], "ブルー/レインボー フリップ": ["#1544AF", "#59B9D0", "#A95CDA", "#F2D365"], "サンセット": ["#DA3B5A", "#F29743", "#E7C675"], "シンセウェーブ": ["#A832B9", "#2159C8", "#EF487D"], "バイスシティ": ["#E86BAA", "#4CD0CE", "#7032BA"], "フォーシーズンズ": ["#5BBD75", "#E8D566", "#E28442", "#7099D6"], "バブルガム": ["#E994CA", "#B678E8", "#66D1EA"], "ザ・セブン": ["#EF3650", "#F7AD42", "#D8E45E", "#58B9D5", "#9851E8"], "クリスマスだよ": ["#D52936", "#2D9C54", "#E4C569"], "気温": ["#5CA3E2", "#DFE5E8", "#E87E57"], "ハオ・スペシャルワークス": ["#644ED7", "#46C7B8", "#DBB964"], "エレクトロ": ["#1F60E9", "#15D6DB", "#EA44BB"], "モニカ": ["#E4AFC7", "#8966CC", "#6DADD9"], "フブキ": ["#D7EAF3", "#91BBDB", "#C5B3E8"], "メリネット9 スローバック": ["#E5AF7C", "#C76476", "#7961B7"], "スプランク・エクストリーム": ["#F3D858", "#4FB86C", "#F6A637"], "フェーリエル 2": ["#4DB2CC", "#B06FDB", "#D2BF75"], "仮面ライダー": ["#D93848", "#1D323D", "#D7C16F"], "クローム・アバレーション": ["#F3F5FA", "#6AB5C1", "#9C80CC"], "オイルスリックパール": ["#112A4B", "#28758B", "#8743B0"]};
const CSS_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;
function previewColorForPreset(p){
  if(!p)return {color:"", background:"", approximate:false};
  const exact=normalizeHex(p.hex);
  if(exact)return {color:exact,background:exact,approximate:false};
  const n=Number(p.number)-1;
  if(p.category==="クラシック"||p.category==="メタリック"){
    const c=PRESET_CLASSIC_PREVIEW[n]||"#858995";
    return {color:c,background:c,approximate:true};
  }
  if(p.category==="マット"||p.category==="金属"){
    const c=(p.category==="マット"?PRESET_MATTE_PREVIEW:PRESET_METAL_PREVIEW)[n]||"#9297A0";
    return {color:c,background:c,approximate:true};
  }
  if(p.category==="カメレオン"){
    const name=String(p.name||"");
    let parts=PRESET_SPECIAL_PREVIEW[name];
    if(!parts){
      // Longer names first, so dark blue is not confused with blue.
      const keys=Object.keys(PRESET_HUE_PREVIEW).sort((a,b)=>b.length-a.length);
      const sections=name.split("/");
      parts=sections.map(part=>{
        const key=keys.find(k=>part.includes(k));
        return key?PRESET_HUE_PREVIEW[key]:null;
      }).filter(Boolean);
      if(parts.length<2){
        const first=keys.find(k=>name.includes(k));
        const base=first?PRESET_HUE_PREVIEW[first]:"#6975B5";
        parts=[base,"#D4B5E2","#65B7B8"];
      }
    }
    const valid=parts.filter(x=>CSS_COLOR_RE.test(x));
    const background=`linear-gradient(110deg,${valid.join(",")})`;
    return {color:valid[0]||"#6975B5",background,approximate:true};
  }
  return {color:"#88929A",background:"#88929A",approximate:true};
}
function copyTextFromRGB(value){
  const match=String(value||"").match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if(!match||match.slice(1).some(v=>Number(v)>255))return "";
  return `rgb(${Number(match[1])}, ${Number(match[2])}, ${Number(match[3])})`;
}
async function copyRgbValue(rgb){
  const value=copyTextFromRGB(rgb);if(!value)return;
  try{
    if(navigator.clipboard && window.isSecureContext)await navigator.clipboard.writeText(value);
    else{
      const input=document.createElement("textarea");input.value=value;input.readOnly=true;input.style.cssText="position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(input);input.select();const success=document.execCommand("copy");input.remove();
      if(!success)throw new Error("copy unavailable");
    }
    showRgbToast(`${value} をコピーしました`);
  }catch{showRgbToast("コピーできませんでした。ブラウザの権限を確認してください");}
}
function showRgbToast(message){
  let toast=document.getElementById("rgbCopyToast");
  if(!toast){toast=document.createElement("div");toast.id="rgbCopyToast";toast.className="rgb-copy-toast";toast.setAttribute("role","status");document.body.appendChild(toast);}
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(showRgbToast.timeout);showRgbToast.timeout=setTimeout(()=>toast.classList.remove("show"),2300);
}

let schemes = [];
let activeGroup = "すべて";
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `scheme-${Date.now()}-${Math.random().toString(36).slice(2)}`);
const clamp = n => Math.max(0, Math.min(255, Number(n) || 0));
function normalizeHex(value){let v=String(value||"").trim().toUpperCase();if(!v)return "";if(!v.startsWith("#"))v="#"+v;return /^#[0-9A-F]{6}$/.test(v)?v:""}
function hexToRgb(hex){const h=normalizeHex(hex);if(!h)return null;return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)}}
function rgbToHex(r,g,b){return `#${[r,g,b].map(v=>clamp(v).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}
function parseRgb(value){const m=String(value||"").match(/(?:rgb\s*\()?\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)?/i);return m?{r:clamp(m[1]),g:clamp(m[2]),b:clamp(m[3])}:null}
function setStatus(text,shared=false){$("syncStatus").textContent=text;$("syncStatus").classList.toggle("shared",shared)}
function localRecords(){try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(d)?d:[]}catch{return []}}
function storeLocal(){localStorage.setItem(STORAGE_KEY,JSON.stringify(schemes));setStatus("この端末に保存済み");updateSyncControls()}
function safeRecords(data){
  const values=Array.isArray(data)?data:(data&&typeof data==="object"?Object.values(data):[]);
  return values.filter(x=>x&&typeof x==="object"&&typeof x.id==="string"&&typeof x.name==="string"&&GROUPS.includes(x.group))
    .sort((a,b)=>GROUPS.indexOf(a.group)-GROUPS.indexOf(b.group)||a.name.localeCompare(b.name,"ja"));
}
function isMine(item){return !CLOUD_ENABLED || Boolean(authState?.localId && item?.ownerUid===authState.localId)}
function updateSyncControls(){
  $("syncModeTitle").textContent=CLOUD_ENABLED?"みんなのカラー・自動同期":"この端末だけに保存";
  $("syncModeDescription").textContent=CLOUD_ENABLED
    ? "登録や閲覧にログインは不要です。カラーは全員と共有され、登録者だけが自分のカラーを編集・削除できます。"
    : "現在は端末内のみに保存されています。共有するには管理者がFirebaseを一度だけ設定してください。";
  $("cloudRefreshBtn").hidden=!CLOUD_ENABLED;
  $("migrateBtn").hidden=!CLOUD_ENABLED||!cloudReady||!authState||!localRecords().length;
  const saveButton=$("addForm").querySelector('button[type="submit"]');
  saveButton.disabled=CLOUD_ENABLED&&(!cloudReady||!authState||mutationInProgress);
  const help=$("registrationHelp");
  const retry=$("formRetryBtn");
  if(help&&retry){
    const waiting=CLOUD_ENABLED&&(!cloudReady||!authState);
    help.hidden=!waiting;
    retry.hidden=!waiting;
    if(waiting){
      help.textContent=authFailure
        ? `共有認証に失敗しています：${authFailure}`
        : cloudReady ? "共有一覧に接続済み。登録用の匿名認証を待っています。" : "共有データに接続しています。接続できない場合は再試行してください。";
    }
  }

  $("showArchivedBtn").hidden=!schemes.some(x=>x.archived&&isMine(x));
  $("showArchivedBtn").textContent=showArchived?"登録一覧へ戻る":"自分の削除済みを表示";
}
function persistAuth(){try{if(authState)localStorage.setItem(AUTH_KEY,JSON.stringify(authState));else localStorage.removeItem(AUTH_KEY)}catch{}}
function restoreAuth(){try{const a=JSON.parse(localStorage.getItem(AUTH_KEY)||"null");if(a?.refreshToken&&a?.localId)authState=a}catch{}}
async function firebaseSignInAnonymously(){
  const res=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(FIREBASE_KEY)}`,{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({returnSecureToken:true})
  });
  if(!res.ok){
    const errorBody=await res.json().catch(()=>({}));
    const code=String(errorBody?.error?.message||`HTTP_${res.status}`).slice(0,160);
    const guidance={
      OPERATION_NOT_ALLOWED:"Firebase Authentication の『匿名』を有効にして保存してください。",
      ADMIN_ONLY_OPERATION:"Firebase Authentication の『匿名』を有効にしてください。",
      API_KEY_INVALID:"Firebase Web API Key を確認してください。",
      INVALID_API_KEY:"Firebase Web API Key を確認してください。",
      API_KEY_SERVICE_BLOCKED:"APIキーのAPI制限でIdentity Toolkit APIが許可されているか確認してください。",
      API_KEY_HTTP_REFERRER_BLOCKED:"APIキーの参照元制限にGitHub Pagesのドメインが含まれているか確認してください。",
      PROJECT_NOT_FOUND:"FirebaseのプロジェクトIDを確認してください。",
      USER_DISABLED:"匿名認証ユーザーが無効です。Firebase Authentication を確認してください。",
      TOO_MANY_ATTEMPTS_TRY_LATER:"アクセス回数制限中です。しばらく待ってください。"
    };
    throw new Error(`匿名認証: ${code}。${guidance[code]||"Firebase Authentication とAPIキーの設定を確認してください。"}`);
  }
  const data=await res.json();
  authState={idToken:data.idToken,refreshToken:data.refreshToken,localId:data.localId,expiresAt:Date.now()+(Number(data.expiresIn)||3600)*1000};
  persistAuth();
}
async function firebaseToken(force=false){
  if(!authState)throw new Error("自動認証が完了していません。");
  if(!force&&authState.idToken&&authState.expiresAt>Date.now()+60000)return authState.idToken;
  const res=await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(FIREBASE_KEY)}`,{
    method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({grant_type:"refresh_token",refresh_token:authState.refreshToken})
  });
  if(!res.ok){
    const errorBody=await res.json().catch(()=>({}));
    const code=String(errorBody?.error?.message||`HTTP_${res.status}`).slice(0,100);
    const e=new Error(`認証情報の更新に失敗 (${code})`);
    e.authErrorCode=code;
    throw e;
  }
  const d=await res.json();authState.idToken=d.id_token;authState.refreshToken=d.refresh_token||authState.refreshToken;
  authState.expiresAt=Date.now()+(Number(d.expires_in)||3600)*1000;persistAuth();return authState.idToken;
}
// 匿名認証に失敗しても、再読み込みなしで再試行できるようにする。
async function ensureAnonymousAuth(force=false){
  if(!CLOUD_ENABLED)return false;
  if(authRetryPromise)return authRetryPromise;
  if(!force && Date.now()<authRetryAfter)return Boolean(authState?.idToken);
  authRetryPromise=(async()=>{
    try{
      if(authState){
        try{await firebaseToken();}
        catch(error){
          // 明確に無効になった匿名アカウントだけを破棄する。
          // 一時的な通信障害ではIDを消さず、編集権限を保護する。
          if(["INVALID_REFRESH_TOKEN","USER_NOT_FOUND","TOKEN_EXPIRED","USER_DISABLED"].includes(error.authErrorCode)){
            authState=null;persistAuth();
          }else throw error;
        }
      }
      if(!authState)await firebaseSignInAnonymously();
      authFailure="";authRetryAfter=0;
      setStatus("共有中・約5秒ごとに同期",true);
      return true;
    }catch(error){
      authFailure=error instanceof Error?error.message:String(error);
      authRetryAfter=Date.now()+15000;
      setStatus("匿名認証エラー・登録停止中");
      $("storageNote").textContent=`匿名認証に失敗しました：${authFailure} 下の『接続・同期を再試行』を押してください。`;
      console.error("Palette Town authentication:",error);
      return false;
    }finally{authRetryPromise=null;updateSyncControls()}
  })();
  return authRetryPromise;
}
async function firebaseRequest(method,path,payload,{etag=false,ifMatch=null}={}){
  for(let attempt=0;attempt<2;attempt++){
    const token=method==="GET"?null:await firebaseToken(attempt===1);
    const url=`${DB_URL}/${path}.json${token?`?auth=${encodeURIComponent(token)}`:""}`;
    const headers={...(payload===undefined?{}:{"Content-Type":"application/json"}),...(etag?{"X-Firebase-ETag":"true"}:{}),...(ifMatch?{"If-Match":ifMatch}:{})};
    const resp=await fetch(url,{method,cache:"no-store",headers,...(payload===undefined?{}:{body:JSON.stringify(payload)})});
    if(resp.status===401&&method!=="GET"&&attempt===0)continue;
    if(!resp.ok){
      if(resp.status===412)throw new Error("別の画面から先に編集されました。画面を更新してから再編集してください。");
      const responseBody=await resp.json().catch(()=>null);
      const serverMessage=String(responseBody?.error || responseBody?.message || "").slice(0,180);
      if(resp.status===401||resp.status===403)throw new Error(`Firebaseに書き込みを拒否されました (HTTP ${resp.status}${serverMessage?`, ${serverMessage}`:""})。Realtime Databaseの公開済みルールと匿名認証を確認してください。`);
      throw new Error(`共有DBとの通信エラー (HTTP ${resp.status}${serverMessage?`, ${serverMessage}`:""})`);
    }
    const result=await resp.json();return etag?{data:result,etag:resp.headers.get("etag")}:result;
  }
  throw new Error("認証の更新に失敗しました。");
}
async function refreshCloud(showStatus=false){
  if(!CLOUD_ENABLED||syncInProgress||mutationInProgress)return;
  syncInProgress=true;
  try{
    if(showStatus)setStatus("共有カラーを読み込み中…",true);
    const next=safeRecords(await firebaseRequest("GET","colorSchemes"));
    if(!cloudReady||JSON.stringify(next)!==JSON.stringify(schemes)){schemes=next;render()}
    cloudReady=true;
    if(authState){
      setStatus("共有中・約5秒ごとに同期",true);
      $("storageNote").textContent="全員のカラーを共有表示中。自分で登録したカラーは、この端末から編集・削除できます。";
    }else if(authFailure){
      setStatus("匿名認証エラー・登録停止中");
      $("storageNote").textContent=`カラー一覧は閲覧できますが、登録には匿名認証が必要です：${authFailure} 『接続・同期を再試行』を押してください。`;
    }else{
      setStatus("共有一覧を表示中・書込準備中",true);
      $("storageNote").textContent="匿名認証を準備中です。";
    }
  }catch(err){cloudReady=false;setStatus("同期エラー / 登録停止中");$("storageNote").textContent=err.message;console.error(err)}
  finally{syncInProgress=false;updateSyncControls()}
}
async function loadData(){
  if(!CLOUD_ENABLED){
    schemes=safeRecords(localRecords());$("storageNote").textContent="ローカル保存中。同期するには管理者のFirebase設定が必要です。";
    setStatus(DB_URL||FIREBASE_KEY?"同期設定が未完成":"この端末だけに保存");updateSyncControls();return;
  }
  restoreAuth();setStatus("共有データに接続中…");
  await ensureAnonymousAuth(true);
  await refreshCloud(true);
  updateSyncControls();render();
  clearInterval(syncTimer);
  syncTimer=setInterval(async()=>{
    if(document.visibilityState==="hidden")return;
    if(!authState)await ensureAnonymousAuth();
    await refreshCloud();
  },SYNC_INTERVAL_MS);
}
async function runCloudMutation(callback){
  if(!cloudReady||!authState){alert("共有DBへの接続または自動認証が完了していません。少し待って再試行してください。");return false}
  const failure=$("saveFailure"); if(failure){failure.hidden=true;failure.textContent="";}
  mutationInProgress=true;setStatus("共有カラーを保存中…",true);updateSyncControls();
  let ok=false;
  try{await callback();ok=true;setStatus("共有データに保存しました",true)}
  catch(err){
    console.error("Palette Town DB save:",err);
    setStatus("保存エラー");
    const failure=$("saveFailure");
    if(failure){failure.hidden=false;failure.textContent=`共有に保存できませんでした：${err.message}`;failure.scrollIntoView({behavior:"smooth",block:"nearest"})}
    else alert(`共有への保存に失敗しました：${err.message}`);
  }
  finally{mutationInProgress=false;await refreshCloud();updateSyncControls()}
  return ok;
}
function sanitizeImport(record){
  if(!record||typeof record.name!=="string"||!GROUPS.includes(record.group))return null;
  const name=record.name.trim().slice(0,80);if(!name)return null;
  const colors={};for(const d of SLOT_DEFS){
    const x=record.colors?.[d.key];if(!x?.enabled||!INPUT_TYPES.includes(x.type))continue;
    colors[d.key]={enabled:true,type:x.type,presetId:String(x.presetId||"").slice(0,100),finish:PICKER_FINISHES.includes(x.finish)?x.finish:"",rgb:String(x.rgb||"").slice(0,40),hex:normalizeHex(x.hex)||""};
  }
  return {group:record.group,name,tag:String(record.tag||"").slice(0,60),note:String(record.note||"").slice(0,500),colors};
}
function makeOwnedRecord(base){return {...base,id:newId(),ownerUid:authState.localId,archived:false,createdAt:{".sv":"timestamp"},updatedAt:{".sv":"timestamp"}}}
async function migrateLocalRecords(){
  const entries=localRecords().map(sanitizeImport).filter(Boolean);
  if(!entries.length)return;
  if(!confirm(`この端末内の ${entries.length} 件を、あなたが編集できる共有カラーとして追加しますか？`))return;
  const ok=await runCloudMutation(async()=>{for(const item of entries.slice(0,50)){const r=makeOwnedRecord(item);await firebaseRequest("PUT",`colorSchemes/${r.id}`,r,{ifMatch:"null_etag"})}});
  if(ok){localStorage.removeItem(STORAGE_KEY);alert("共有へ移しました。")}
}
function presetOptions(category, selected=""){
  return PALETTE.filter(x=>x.category===category).map(x=>`<option value="${escapeHtml(x.id)}" ${x.id===selected?"selected":""}>${escapeHtml(x.number)}. ${escapeHtml(x.name)}</option>`).join("");
}
function defaultSpec(){return {enabled:false,type:"クラシック",presetId:"",finish:"クラシック",rgb:"rgb(255, 255, 255)",hex:"#FFFFFF"}}
function getSlotState(key){
  const root=document.querySelector(`[data-slot="${key}"]`);if(!root)return defaultSpec();
  const type=root.querySelector(".slot-type").value;
  // 展開状態は見た目のみ。閉じても選択した色を保存する。
  const enabled=root.querySelector(".slot-enabled").checked;
  const spec={enabled,type,presetId:"",finish:"",rgb:"",hex:""};
  if(PRESET_CATEGORIES.includes(type)) spec.presetId=root.querySelector(".preset-select")?.value||"";
  if(type==="RGBピッカー"){
    spec.finish=root.querySelector(".finish-select")?.value||"クラシック";
    const rgb=parseRgb(root.querySelector(".rgb-text")?.value||"")||{r:255,g:255,b:255};
    spec.rgb=`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;spec.hex=rgbToHex(rgb.r,rgb.g,rgb.b);
  }
  if(type==="HEXピッカー"){
    spec.finish=root.querySelector(".finish-select")?.value||"クラシック";
    spec.hex=normalizeHex(root.querySelector(".hex-text")?.value)||"#FFFFFF";
    const rgb=hexToRgb(spec.hex);spec.rgb=rgb?`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`:"";
  }
  return spec;
}
function slotEditorHtml(def){
  return `<section class="slot-editor" data-slot="${def.key}">
    <button class="slot-toggle" type="button"><span>${def.label}</span><span class="slot-open-label">開く</span></button>
    <div class="slot-body">
      <label class="slot-use"><input class="slot-enabled" type="checkbox"> この項目を登録する</label>
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
      <label>RGB<div class="picker-row"><input class="native-picker rgb-color" type="color" value="#FFFFFF"><input class="rgb-text" value="rgb(255, 255, 255)" placeholder="rgb(255, 255, 255)"></div></label><button type="button" class="rgb-editor-copy" title="現在のRGB値をコピー">⧉ RGBをコピー</button>`;
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
    if(p){text=`${type} / ${p.number}.${p.name}`;color=previewColorForPreset(p).background}
  }else if(type==="RGBピッカー"){
    const rgb=parseRgb(root.querySelector(".rgb-text")?.value||"");const finish=root.querySelector(".finish-select")?.value||"クラシック";
    if(rgb){color=rgbToHex(rgb.r,rgb.g,rgb.b);text=`${finish} / rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
  }else{
    const h=normalizeHex(root.querySelector(".hex-text")?.value);const finish=root.querySelector(".finish-select")?.value||"クラシック";
    if(h){color=h;text=`${finish} / ${h}`}
  }
  root.querySelector(".preview-text").textContent=text;
  const sw=root.querySelector(".preview-swatch");sw.style.background=color||"";sw.classList.toggle("empty",!color);
}
function setupSlotEditors(){
  $("slotEditors").innerHTML=SLOT_DEFS.map(slotEditorHtml).join("");
  $("slotEditors").addEventListener("click",e=>{
    const copy=e.target.closest(".rgb-editor-copy");
    if(copy){const value=copy.closest(".slot-editor")?.querySelector(".rgb-text")?.value;copyRgbValue(value);return;}
    const btn=e.target.closest(".slot-toggle");if(!btn)return;
    const root=btn.closest(".slot-editor");
    const opening=!root.classList.contains("open");
    root.classList.toggle("open",opening);
    // Opening a slot activates it. Closing a slot does not remove its color.
    if(opening)root.querySelector(".slot-enabled").checked=true;
    refreshSlotToggle(root);
    refreshCombinedSlotPreviews();
  });
  $("slotEditors").addEventListener("change",e=>{
    const root=e.target.closest(".slot-editor");if(!root)return;
    if(e.target.classList.contains("slot-type")) renderSlotDynamic(root);
    if(e.target.classList.contains("rgb-color")){const rgb=hexToRgb(e.target.value);root.querySelector(".rgb-text").value=`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
    if(e.target.classList.contains("hex-color")) root.querySelector(".hex-text").value=e.target.value.toUpperCase();
    updateSlotPreview(root);
    refreshSlotToggle(root);
    refreshCombinedSlotPreviews();
  });
  $("slotEditors").addEventListener("input",e=>{
    const root=e.target.closest(".slot-editor");if(!root)return;
    if(e.target.classList.contains("rgb-text")){const rgb=parseRgb(e.target.value);if(rgb)root.querySelector(".rgb-color").value=rgbToHex(rgb.r,rgb.g,rgb.b)}
    if(e.target.classList.contains("hex-text")){const h=normalizeHex(e.target.value);if(h)root.querySelector(".hex-color").value=h}
    updateSlotPreview(root);
    refreshCombinedSlotPreviews();
  });
  document.querySelectorAll(".slot-editor").forEach(root=>{renderSlotDynamic(root);refreshSlotToggle(root)});
  refreshCombinedSlotPreviews();
}
function specDisplay(spec){
  if(!spec?.enabled)return null;
  if(PRESET_CATEGORIES.includes(spec.type)){
    const p=PALETTE.find(x=>x.id===spec.presetId);
    if(!p)return {text:`${spec.type} / 未登録`,color:"",background:"",copyRgb:""};
    return {text:`${spec.type} / ${p.number}.${p.name}`, ...previewColorForPreset(p),copyRgb:""};
  }
  if(spec.type==="RGBピッカー"){
    const rgb=copyTextFromRGB(spec.rgb)||(hexToRgb(spec.hex)?(()=>{const c=hexToRgb(spec.hex);return `rgb(${c.r}, ${c.g}, ${c.b})`})():"");
    const color=normalizeHex(spec.hex)||(rgb?(()=>{const r=parseRgb(rgb);return rgbToHex(r.r,r.g,r.b)})():"");
    return {text:`${spec.finish||"クラシック"} / ${rgb||spec.rgb||""}`,color,background:color,copyRgb:rgb};
  }
  if(spec.type==="HEXピッカー"){
    const color=normalizeHex(spec.hex);
    return {text:`${spec.finish||"クラシック"} / ${color||spec.hex||""}`,color,background:color,copyRgb:""};
  }
  return {text:"未設定",color:"",background:"",copyRgb:""};
}
// Pearl is a separate saved slot. The overlay is a visual approximation only.
function pearlPreviewBackground(base,pearl){
  if(!base||!pearl?.color)return base||"";
  const rgb=hexToRgb(pearl.color);
  if(!rgb)return base;
  const {r,g,b}=rgb;
  return `linear-gradient(115deg,transparent 0%,rgba(${r},${g},${b},.10) 24%,rgba(${r},${g},${b},.53) 60%,rgba(255,255,255,.18) 79%,transparent 100%),${base}`;
}
function refreshCombinedSlotPreviews(){
  const pearl=specDisplay(getSlotState("pearl"));
  for(const key of ["main","sub"]){
    const root=document.querySelector(`[data-slot="${key}"]`);
    if(!root)continue;
    const base=specDisplay(getSlotState(key));
    const preview=root.querySelector(".preview-swatch");
    if(!preview)continue;
    const composite=base&&pearl?pearlPreviewBackground(base.background,pearl):base?.background||"";
    preview.style.background=composite;
    preview.classList.toggle("empty",!composite);
    preview.title=base&&pearl?"パールの重なりを参考表示（ゲーム内での色とは異なる場合があります）":"";
  }
}
function refreshSlotToggle(root){
  const opened=root.classList.contains("open");
  const active=root.querySelector(".slot-enabled").checked;
  root.querySelector(".slot-open-label").textContent=opened?"閉じる":active?"設定済み ✓ · 開く":"開く";
  root.classList.toggle("slot-configured",active);
}
function cardHtml(item){
  const colors=SLOT_DEFS.map(def=>({def,value:specDisplay(item.colors?.[def.key])}));
  const pearl=colors.find(x=>x.def.key==="pearl")?.value;
  const bands=colors.map(({def,value})=>{
    const hasOverlay=(def.key==="main"||def.key==="sub")&&Boolean(value&&pearl);
    const background=hasOverlay?pearlPreviewBackground(value.background,pearl):value?.background||"";
    const approximate=value?.approximate;
    const label=def.label+": "+(value?.text||"未設定")+(approximate?"（参考色）":"")+(hasOverlay?" / パール効果の参考表示":"");
    return `<div class="swatch-cell${background?"":" no-color"}${hasOverlay?" with-pearl":""}" ${background?`style="--swatch:${background}"`:""} title="${escapeHtml(label)}"><em>${escapeHtml(def.label)}</em></div>`;
  }).join("");
  const rows=colors.filter(({value})=>value).map(({def,value})=>{
    const rgb=value.copyRgb;
    const text=escapeHtml(value.text);
    const label=rgb?`<button type="button" class="rgb-copy-value" data-copy-rgb="${escapeHtml(rgb)}" title="${escapeHtml(rgb)} をクリックでコピー" aria-label="${escapeHtml(rgb)} をコピー">${text}<span class="rgb-copy-icon" aria-hidden="true">⧉</span></button>`:`<span>${text}</span>`;
    const background=(def.key==="main"||def.key==="sub")&&pearl
      ? pearlPreviewBackground(value.background,pearl)
      :value.background||"";
    return `<div class="scheme-row"><b>${escapeHtml(def.label)}</b><span class="spec-label">${label}<i class="tiny-swatch${background?"":" empty"}"${background?` style="background:${background}"`:""}></i></span></div>`;
  }).join("");
  return `<article class="scheme-card" data-id="${escapeHtml(item.id)}">
      <div class="swatch-band" aria-label="カラーサンプル">${bands}</div>
      <div class="scheme-inner"><div class="scheme-head"><div><h4>${escapeHtml(item.name)}</h4>${item.tag?`<small>${escapeHtml(item.tag)}</small>`:""}</div><span class="group-tag">${escapeHtml(item.group)}</span></div>
      <div class="scheme-rows">${rows||'<div class="no-slots">カラー指定なし</div>'}</div>
      ${item.note?`<div class="scheme-note">${escapeHtml(item.note)}</div>`:""}
      <div class="scheme-actions">${isMine(item)
        ? `<button type="button" class="edit-btn" data-edit="${escapeHtml(item.id)}">編集する</button><button type="button" class="delete-btn" data-delete="${escapeHtml(item.id)}">${item.archived?"復元する":"削除する"}</button>`
        : `<span class="readonly-label">${CLOUD_ENABLED?"ほかの人が登録・閲覧のみ":""}</span>`}</div></div>
    </article>`;
}
function filtered(){const q=$("searchInput").value.trim().toLowerCase();return schemes.filter(x=>(Boolean(x.archived)===showArchived&&(!showArchived||isMine(x)))&&(activeGroup==="すべて"||x.group===activeGroup)&&(!q||`${x.group} ${x.name} ${x.tag||""} ${x.note||""}`.toLowerCase().includes(q)))}
function setupGroups(){const groups=["すべて",...GROUPS];$("categoryTabs").innerHTML=groups.map(g=>`<button type="button" class="tab${g===activeGroup?" active":""}" data-group="${g}">${g}</button>`).join("")}
function render(){
  setupGroups();const list=filtered();
  $("statsTotal").textContent=schemes.filter(x=>!x.archived).length;
  $("statsGang").textContent=schemes.filter(x=>!x.archived&&x.group==="ギャング").length;
  $("statsStreet").textContent=schemes.filter(x=>!x.archived&&x.group==="半グレ").length;
  $("statsOther").textContent=schemes.filter(x=>!x.archived&&x.group==="その他").length;$("viewTitle").textContent=showArchived?"自分の削除済み":activeGroup==="すべて"?"登録カラー":activeGroup;$("totalCount").textContent=`${list.length}件`;
  const groups=(activeGroup==="すべて"?GROUPS:[activeGroup]).map(g=>[g,list.filter(x=>x.group===g)]).filter(([,arr])=>arr.length);
  $("schemeSections").innerHTML=groups.length?groups.map(([g,arr],i)=>`<section class="category-section"><div class="category-heading"><div><div class="eyebrow">CATEGORY ${String(i+1).padStart(2,"0")}</div><h3>${escapeHtml(g)}</h3></div><span>${arr.length}件</span></div><div class="scheme-grid">${arr.map(cardHtml).join("")}</div></section>`).join(""):`<div class="empty-state"><div class="empty-symbol"><i style="background:#5267fb"></i><i style="background:#98a9fa"></i><i style="background:#b4c3ea"></i></div><strong>${$("searchInput").value.trim() || activeGroup !== "すべて" ? "該当するカラーがありません" : "まだカラーが登録されていません"}</strong><p>${$("searchInput").value.trim() || activeGroup !== "すべて" ? "検索ワードや区分を変更してみてください。" : "右側の「カラーを新規登録」から追加できます。"}</p></div>`;
}
function clearForm(){
  editId=null;const group=$("groupInput").value;$("addForm").reset();$("groupInput").value=group;
  $("editorHeading").textContent="カラーを新規登録";
  $("saveColorBtn").textContent="＋ カラーを登録";
  $("clearFormBtn").textContent="入力をクリア";
  document.querySelectorAll(".slot-editor").forEach(root=>{
    root.classList.remove("open");
    root.querySelector(".slot-enabled").checked=false;root.querySelector(".slot-type").value="クラシック";
    renderSlotDynamic(root);refreshSlotToggle(root);
  });
  refreshCombinedSlotPreviews();
}
function editScheme(id){
  const item=schemes.find(x=>x.id===id);if(!item||!isMine(item)||item.archived)return;
  editId=item.id;$("editorHeading").textContent="カラーを編集";$("saveColorBtn").textContent="変更を保存";$("clearFormBtn").textContent="編集をキャンセル";
  $("groupInput").value=item.group;$("nameInput").value=item.name;$("tagInput").value=item.tag||"";$("noteInput").value=item.note||"";
  document.querySelectorAll(".slot-editor").forEach(root=>{
    const x=item.colors?.[root.dataset.slot];const enabled=Boolean(x?.enabled);
    root.classList.toggle("open",enabled);root.querySelector(".slot-open-label").textContent=enabled?"閉じる":"開く";
    root.querySelector(".slot-enabled").checked=enabled;root.querySelector(".slot-type").value=INPUT_TYPES.includes(x?.type)?x.type:"クラシック";
    renderSlotDynamic(root);
    if(PRESET_CATEGORIES.includes(x?.type))root.querySelector(".preset-select").value=x.presetId||"";
    else if(x?.type==="RGBピッカー"){
      root.querySelector(".finish-select").value=x.finish||"クラシック";
      root.querySelector(".rgb-text").value=copyTextFromRGB(x.rgb)||x.rgb||"rgb(255, 255, 255)";
      root.querySelector(".rgb-color").value=normalizeHex(x.hex)||"#FFFFFF";
    }else if(x?.type==="HEXピッカー"){
      root.querySelector(".finish-select").value=x.finish||"クラシック";
      root.querySelector(".hex-text").value=normalizeHex(x.hex)||"#FFFFFF";
      root.querySelector(".hex-color").value=normalizeHex(x.hex)||"#FFFFFF";
    }
    updateSlotPreview(root);
    refreshSlotToggle(root);
  });
  refreshCombinedSlotPreviews();
  document.querySelector(".editor-panel").scrollIntoView({behavior:"smooth",block:"start"});
}
async function updateCloudRecord(id,change){
  const path=`colorSchemes/${id}`;
  const {data:current,etag}=await firebaseRequest("GET",path,undefined,{etag:true});
  if(!current||!etag||current.ownerUid!==authState?.localId)throw new Error("このカラーを編集する権限がありません。");
  const next={...current,...change,updatedAt:{".sv":"timestamp"}};
  await firebaseRequest("PUT",path,next,{ifMatch:etag});
}
async function addScheme(e){
  e.preventDefault();const name=$("nameInput").value.trim();if(!name)return;
  if(name.length>80){alert("カラー名は80文字以内で入力してください");return}
  const colors={};SLOT_DEFS.forEach(def=>{const spec=getSlotState(def.key);if(spec.enabled)colors[def.key]=spec});
  const base={group:$("groupInput").value,name,tag:$("tagInput").value.trim().slice(0,60),note:$("noteInput").value.trim().slice(0,500),colors};
  if(CLOUD_ENABLED){
    const currentId=editId;
    const ok=await runCloudMutation(()=>currentId
      ? updateCloudRecord(currentId,base)
      : (async()=>{const item=makeOwnedRecord(base);await firebaseRequest("PUT",`colorSchemes/${item.id}`,item,{ifMatch:"null_etag"})})());
    if(!ok)return;
  }else if(editId){
    const i=schemes.findIndex(x=>x.id===editId);if(i<0)return;
    schemes[i]={...schemes[i],...base};storeLocal();
  }else{schemes.push({...base,id:newId(),createdAt:new Date().toISOString()});storeLocal()}
  clearForm();render();updateSyncControls();
}
async function removeScheme(id){
  const item=schemes.find(x=>x.id===id);if(!item||!isMine(item))return;
  const willArchive=!item.archived;
  if(!confirm(`「${item.name}」を${willArchive?"削除済みに移動":"復元"}しますか？`))return;
  if(CLOUD_ENABLED){if(!(await runCloudMutation(()=>updateCloudRecord(item.id,{archived:willArchive}))))return}
  else{item.archived=willArchive;storeLocal()}
  if(editId===id)clearForm();render();updateSyncControls();
}
function renderPalette(){
  const cat=$("paletteCategory").value, q=$("paletteSearch").value.trim().toLowerCase();
  const list=PALETTE.filter(x=>(cat==="すべて"||x.category===cat)&&(!q||`${x.number} ${x.name}`.toLowerCase().includes(q)));
  $("paletteGrid").innerHTML=list.map(x=>{
    const pv=previewColorForPreset(x);
    return `<div class="palette-item"><div class="palette-swatch" style="--swatch:${pv.background||"#e9edf4"}" title="${pv.approximate?"参考色":"登録色"}"></div><b>${escapeHtml(x.number)}. ${escapeHtml(x.name)}</b><small>${escapeHtml(x.category)}${pv.approximate?" · 参考色":""}</small></div>`;
  }).join("");
}
function setupPaletteDialog(){
  $("paletteCategory").innerHTML=["すべて",...PRESET_CATEGORIES].map(x=>`<option>${x}</option>`).join("");
  $("paletteBtn").addEventListener("click",()=>{$("paletteDialog").showModal();renderPalette()});
  $("closePaletteBtn").addEventListener("click",()=>$("paletteDialog").close());
  $("paletteCategory").addEventListener("change",renderPalette);$("paletteSearch").addEventListener("input",renderPalette);
}
function setupEvents(){
  $("formRetryBtn").addEventListener("click",async()=>{
    $("formRetryBtn").disabled=true;
    $("registrationHelp").textContent="再接続しています…";
    try{await ensureAnonymousAuth(true);await refreshCloud(true)}
    finally{$("formRetryBtn").disabled=false;updateSyncControls()}
  });
  $("cloudRefreshBtn").addEventListener("click",async()=>{
    await ensureAnonymousAuth(true);
    await refreshCloud(true);
  });
  $("migrateBtn").addEventListener("click",migrateLocalRecords);
  $("showArchivedBtn").addEventListener("click",()=>{showArchived=!showArchived;render();updateSyncControls()});
  document.addEventListener("visibilitychange",async()=>{
    if(document.visibilityState!=="visible")return;
    if(!authState)await ensureAnonymousAuth(true);
    await refreshCloud();
  });
  $("searchInput").addEventListener("input",render);
  $("categoryTabs").addEventListener("click",e=>{const b=e.target.closest(".tab");if(!b)return;activeGroup=b.dataset.group;render()});
  $("addForm").addEventListener("submit",addScheme);$("clearFormBtn").addEventListener("click",clearForm);
  $("schemeSections").addEventListener("click",e=>{
    const rgb=e.target.closest("[data-copy-rgb]");
    if(rgb){copyRgbValue(rgb.dataset.copyRgb);return;}
    const edit=e.target.closest("[data-edit]");if(edit){editScheme(edit.dataset.edit);return}
    const del=e.target.closest("[data-delete]");if(del)removeScheme(del.dataset.delete);
  });
  $("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("palette-color-theme",document.body.classList.contains("light")?"light":"dark");$("themeBtn").textContent=document.body.classList.contains("light")?"🌙":"☀️"});
}
(async function init(){
  if(localStorage.getItem("palette-color-theme")==="dark")document.body.classList.remove("light");$("themeBtn").textContent=document.body.classList.contains("light")?"🌙":"☀️";
  setupGroups();setupSlotEditors();setupPaletteDialog();setupEvents();await loadData();render();
})();

/*
 * PALETTE TOWN / Garage Guide
 * User-provided qualitative table (2026-10-19), 33 wheels.
 * The scores below are transparent recommendation heuristics, NOT measured in-game specs.
 */
const wheels = [
  ['エクストラバガンゾ','SUV','neutral','高いグリップ・重量性能高・段差に強い','安定','安定','重量があり、舗装路や段差のある道でも安定志向。'],
  ['デュークス','オフロード','underStrong','空転抑制高・グリップ高','安定しない','安定しない','空転対策の候補だが、オフロード・雨では不安定。'],
  ['ドラッグＳＰＬ','オフロード','underWeak','低速安定性低・グリップ高','安定しない','安定しない','低速での安定性が低い。'],
  ['デューン・バッシャー','オフロード','underWeak','グリップ良・高性能','高い水準で安定','安定しない','未舗装路には強いが雨の日は注意。'],
  ['警察仕様スティーリー','オフロード','neutral','グリップ良・SUVには適さない','安定','安定','重くなる傾向。軽くて滑る車の相談で検討。'],
  ['軽量スティーリー','オフロード','neutral','グリップ普通・段差適応◎・高速時のグリップ×','安定','安定しない','段差向け。高速・雨での滑りに注意。'],
  ['リッジクライマー','オフロード','overWeak','良く曲がり小回りが利く・立て直しやすい','安定','安定','曲がりやすく、小回りと立て直しを重視。'],
  ['全地形モンスター','オフロード','neutral','全体的に高めの水準','安定','安定','舗装路以外も含めてバランス型。'],
  ['クラッカ・カスタム','ストリート','underStrong','グリップ良・着地耐性×','安定','安定','着地の多いコースには注意。'],
  ['V8キラー','ストリート','underStrong','滑らない・高性能','安定','安定','滑りにくさを重視したい人の候補。'],
  ['フジワラカスタム','ストリート','neutral','平均的に高水準','安定','安定','大きな癖を避けたい場合の候補。'],
  ['エアロスター','ストリート','overStrong','グリップ高・よく曲がる・立て直しやすい','安定','安定','曲がりやすさが強い。滑りやすく感じる場合も。'],
  ['ディープブレーク','ストリート','underStrong','グリップ高・段差適正高・ハンドルが固くなる','安定','安定','グリップは高いがハンドルは重め。'],
  ['コスモMk3','ストリート','overWeak','グリップ良・跳ねると少し滑る','安定','安定','段差などで跳ねると滑る場合がある。'],
  ['マーシー','スポーツ','overWeak','グリップ良・高性能・曲がりやすい','少し滑るが安定','滑るがコントロールしやすい','雨では滑るものの、コントロールしやすいとされる。'],
  ['SLレーサー','スポーツ','underWeak','全体的に高性能・滑ると立て直せない','安定','スピードを落とせば安定','滑り出した後の立て直しに注意。'],
  ['ラヴフェルド','スポーツ','underWeak','全て高性能・段差で滑る','安定','後輪が大きく滑る','「ラブベルト」と呼ばれることもある。曲がりやすいという使用メモあり。'],
  ['湾岸マスター','スポーツ','underWeak','グリップ高・高性能・アクセルオフで滑る','安定','安定','アクセルオフ時の滑りに注意。'],
  ['ドリフトマイスター','チューナー','over','グリップ良・曲がりやすい','グリップ低下','グリップ低下・スライド量増加','曲がり・スライド性能重視。雨には不向き。'],
  ['スライドウェイズ','チューナー','slide','グリップ良・高速時に滑る・高性能','安定','高速時に滑る・立て直し難','雨の高速走行には注意。'],
  ['スタンドEG','チューナー','neutral','少し滑る・全体的には高性能','安定・凸凹で滑る','高速時に少し滑る','悪路の凹凸や雨の高速時に注意。'],
  ['バトルVIII','チューナー','neutral','グリップ良・コントロールしやすい','安定','安定','コントロールしやすさを優先。'],
  ['ラリーマスター','チューナー','under','グリップ良・アンダー強い','安定','安定','アンダーステアが強め。'],
  ['ストーブ・トップ','トラック','neutral','癖がなく扱いやすい高性能','安定','走れるレベル','癖の少ない万能寄りの選択。'],
  ['ヒドウン・シックス','トラック','neutral','化け物・グリップが凄まじい','安定','安定する','グリップを強く重視。'],
  ['マーシーチューリップ','ハイエンド','neutral','グリップ・ステア・バンプ耐性が高水準・安定','安定しない','安定しない','舗装路向け。悪路・雨には不向き。'],
  ['オベイRS','ハイエンド','neutral','曲がり良・着地耐性◎・立て直しやすい','安定しない','安定しない','曲がりと着地に強いが雨に弱い。'],
  ['カーボンソーラー','ハイエンド','neutral','踏み込み時グリップ良・アクセルオフで曲がり良','安定しない','安定する・跳ねると滑る','アクセル操作と着地による変化に注意。'],
  ['チーターカーボンR','ハイエンド','neutral','着地耐性×・グリップ高・ハンドル固い','若干内側に滑りやすい','安定する・跳ねると滑る','滑りやすくなるが初速が早いという使用メモあり。'],
  ['カーボンSLレーサー','ハイエンド','neutral','グリップ高・ほとんど滑らない','安定する','安定する','舗装路の安定性や雨への対応で候補。'],
  ['ブラックトップ','マッスル','under','空転抑制高・グリップ良・安定性高・高性能','安定しない','安定しない','空転対策には向くが雨・悪路では不安定。'],
  ['リボルバー','マッスル','neutral','低速安定性低・グリップ高','安定しない','安定しない','低速と雨に注意。'],
  ['エル・ヘフェ','マッスル','under','グリップ高・低速安定','安定','安定しない','低速の安定感重視。雨では不安定。']
].map(([name,category,steer,on,off,rain,note],i)=>({id:i+1,name,category,steer,on,off,rain,note}));

const STEER_LABELS={underStrong:'アンダー強',underWeak:'アンダー弱',under:'アンダー',neutral:'ニュートラル',overWeak:'オーバー弱',overStrong:'オーバー強',over:'オーバー',slide:'スライド'};
const CATEGORIES=['オフロード','ストリート','スポーツ','チューナー','トラック','ハイエンド','SUV','マッスル'];
const $=id=>document.getElementById(id);
const state={filter:'all'};

function wetSafety(w){
  const s=w.rain;
  if(s.includes('安定しない')||s.includes('グリップ低下')||s.includes('後輪が大きく滑る')||s.includes('立て直し難')) return -2;
  if(s.includes('滑るがコントロール')||s.includes('スピードを落とせば')||s.includes('少し滑る')||s.includes('跳ねると滑る')||s.includes('走れるレベル')) return 0;
  if(s.includes('安定')&&!s.includes('安定しない')) return 2;
  if(s.includes('滑る')) return -1;
  return 0;
}
function offSafety(w){const s=w.off;if(s.includes('安定しない')||s.includes('グリップ低下'))return -2;if(s.includes('少し滑る')||s.includes('若干')||s.includes('凸凹')||s.includes('グリップ低下'))return 0;if(s.includes('安定'))return 2;return 0;}
function hasGrip(w){return /グリップ良|グリップ高|グリップが凄まじい|滑らない|ほとんど滑らない|空転抑制高|滑りづらい/.test(w.on);}
function turnsWell(w){return /よく曲がる|良く曲が|曲がり良|曲がりやすい|小回り|曲がり良/.test(w.on);}
function fastRisk(w){return /高速時のグリップ×|高速時に滑る|滑ると立て直せない|低速安定性低|着地耐性×/.test(w.on+w.rain);}
function isSkiddy(w){return /滑る|グリップ低下|低速安定性低/.test(w.on);}
function getInput(){const form=$('diagnosticForm');return {issue:form.elements.issue.value,surface:form.elements.surface.value,weather:form.elements.weather.value,goal:form.elements.goal.value,drive:form.elements.drive.value};}
function scoreWheel(w,opt){
  let score=50;
  const reasons=[],risks=[];
  const adjust=(amount,reason)=>{score+=amount;if(amount>6&&reason)reasons.push(reason);};
  const steer=w.steer;
  if(opt.issue==='under'){
    if(w.on.includes('ハンドル固い')||w.on.includes('ハンドルが固くなる'))adjust(-14);
    if(steer==='overWeak'||steer==='over')adjust(19,'オーバー寄りで曲がりにくさを補う候補');
    else if(steer==='overStrong')adjust(13,'曲がりやすさを強める方向');
    else if(steer==='underStrong')adjust(-23);else if(steer==='under'||steer==='underWeak')adjust(-12);else adjust(5);
  }else if(opt.issue==='over'){
    if(steer==='underWeak'||steer==='under')adjust(17,'アンダー寄りで回り込みを抑える候補');
    else if(steer==='underStrong')adjust(9,'曲がりすぎを抑える方向');
    else if(steer==='overStrong'||steer==='over'||steer==='slide')adjust(-22);else if(steer==='overWeak')adjust(-14);else adjust(7);
  }else if(opt.issue==='slip'){
    if(hasGrip(w))adjust(18,'グリップ・空転抑制の記載あり');
    if(isSkiddy(w))adjust(-16);
    if(steer==='slide'||steer==='overStrong')adjust(-12);
  }else{
    if(steer==='neutral')adjust(12,'大きなステア傾向がない');
    if(steer==='underStrong'||steer==='overStrong'||steer==='slide')adjust(-8);
  }
  if(opt.surface==='offroad'){
    if(w.category==='オフロード')adjust(19,'悪路用途のカテゴリ');
    if(offSafety(w)===2)adjust(12,'オフロードで安定との評価');
    if(offSafety(w)===-2)adjust(-29);
    if(offSafety(w)===0)adjust(-5);
  }else if(opt.surface==='mountain'){
    if(turnsWell(w))adjust(15,'コーナーでの曲がりやすさを評価');
    if(hasGrip(w))adjust(9,'舗装路のグリップを評価');
    if(steer==='underStrong')adjust(-5);
    if(w.category==='ストリート'||w.category==='スポーツ')adjust(5);
  }else if(opt.surface==='highway'){
    if(hasGrip(w))adjust(12,'安定したグリップの記載あり');
    if(steer==='neutral'||steer==='underWeak')adjust(8,'極端すぎないステア特性');
    if(fastRisk(w))adjust(-24);
    if(steer==='overStrong'||steer==='slide')adjust(-14);
  }else{
    if(['ストリート','スポーツ','ハイエンド','SUV','マッスル'].includes(w.category))adjust(7);
    if(steer==='neutral')adjust(5);
  }
  const wet=wetSafety(w);
  if(opt.weather==='wet'){
    if(wet===2)adjust(23,'雨天で安定との評価');
    else if(wet===0)adjust(-3);
    else if(wet===-1)adjust(-16);
    else adjust(-42);
    if(steer==='overStrong'||steer==='slide')adjust(-9);
    if(wet<=0)risks.push('雨天評価: '+w.rain);
  }
  if(opt.goal==='stable'){
    if(hasGrip(w))adjust(15,'滑りにくさにつながるグリップ特性');
    if(steer==='neutral')adjust(8);
    if(isSkiddy(w))adjust(-11);
  }else if(opt.goal==='turn'){
    if(turnsWell(w))adjust(19,'旋回性能を重視');
    if(['overWeak','over','overStrong'].includes(steer))adjust(8);
    if(steer==='underStrong')adjust(-15);
  }else if(opt.goal==='balanced'){
    if(steer==='neutral')adjust(13,'扱いやすいニュートラル傾向');
    if(hasGrip(w))adjust(5);
    if(steer==='underStrong'||steer==='overStrong')adjust(-8);
  }else{
    if(/高性能|高水準|全体的に高め|初速が早い/.test(w.on+w.note))adjust(16,'走行性能に関する評価が高い');
    if(fastRisk(w))adjust(-9);
  }
  if(opt.drive==='fr'){
    if(hasGrip(w))adjust(6,'後輪駆動で気になる空転を考慮');
    if(steer==='overStrong'||steer==='slide')adjust(-7);
  }else if(opt.drive==='ff'){
    if(turnsWell(w))adjust(5,'コーナリング志向');
  }
  if(w.on.includes('滑ると立て直せない'))risks.push('滑った後の立て直しが難しい');
  if(opt.surface==='offroad'&&offSafety(w)<=0)risks.push('悪路では安定しない場合がある');
  if(opt.surface==='highway'&&fastRisk(w))risks.push('高速域や着地時の挙動に注意');
  if(opt.issue==='under'&&['overStrong','over'].includes(steer))risks.push('極端なオーバー寄りはスピンに注意');
  if(opt.issue==='over'&&steer==='underStrong')risks.push('曲がりにくさが増す可能性');
  if(!reasons.length)reasons.push('ご指定の走行条件とのバランスを考慮');
  return {wheel:w,score:Math.max(0,Math.min(100,score)),reasons:[...new Set(reasons)].slice(0,3),risks:[...new Set(risks)].slice(0,2)};
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderResults(){
  const opt=getInput();
  const candidates=wheels.map(w=>scoreWheel(w,opt)).sort((a,b)=>b.score-a.score||a.wheel.id-b.wheel.id).slice(0,3);
  const problems={under:'曲がりにくさの改善',over:'スピンしやすさの改善',slip:'滑りにくさ',none:'使い方との相性'};
  const surfaces={city:'舗装路',highway:'高速道路',mountain:'山道',offroad:'未舗装路'};
  $('resultSummary').textContent=`${problems[opt.issue]} × ${surfaces[opt.surface]}${opt.weather==='wet'?' × 雨天':''} を重視した候補です。`;
  $('resultCards').innerHTML=candidates.map((item,i)=>{
    const w=item.wheel;
    return `<article class="result-card ${i===0?'best':''}"><div class="result-top"><span class="result-rank">0${i+1}</span><div class="result-heading"><h4>${esc(w.name)}</h4><p>${esc(w.category)} / ${esc(STEER_LABELS[w.steer])}</p></div><span class="result-tag">${i===0?'第一候補':'候補'}</span></div><div class="result-reasons">${item.reasons.map(s=>`<p>✓ ${esc(s)}</p>`).join('')}${item.risks.map(s=>`<p class="risk-text">△ ${esc(s)}</p>`).join('')}<p>雨: ${esc(w.rain)} ／ 悪路: ${esc(w.off)}</p></div></article>`;
  }).join('');
  const notes={fr:'後輪駆動：発進時の空転と、アクセルを踏みながらの旋回に注意。安定志向ならグリップ重視。',ff:'前輪駆動：コーナリングを活かしながら、前輪側が外へ逃げる挙動に注意。',awd:'四輪駆動：駆動力は分散されますが、グリップの限界や車重の影響は残ります。',ev:'EV：加速特性と車種ごとの変速機仕様を確認。通常の多段変速カスタムが不要な車種があります。',unknown:'駆動方式が分かると、より相談内容に合った候補を選べます。'};
  $('driveAdvice').innerHTML=`<b>メカニック向けメモ</b>：${esc(notes[opt.drive])}`;
}
function renderCatalog(){
  const search=$('wheelSearch').value.trim().toLocaleLowerCase('ja');
  const subset=wheels.filter(w=>{
    const group=state.filter==='all'||w.category===state.filter||(state.filter==='その他'&&['SUV','トラック','マッスル'].includes(w.category));
    const match=[w.name,w.category,w.on,w.off,w.rain,w.note,STEER_LABELS[w.steer]].join(' ').toLocaleLowerCase('ja').includes(search);
    return group&&match;
  });
  $('visibleCount').textContent=`${subset.length} / ${wheels.length}種類`;
  $('catalogGrid').innerHTML=subset.map(w=>{
    const wet=wetSafety(w),off=offSafety(w);
    const pill=(label, val, raw)=>`<span class="${val===2?'good':val===-2?'caution':''}" title="${esc(raw)}">${label}: ${val===2?'安定':val===-2?'注意':'条件付き'}</span>`;
    return `<article class="catalog-card"><div class="catalog-head"><div><h3>${esc(w.name)}</h3><span>${esc(w.category)}</span></div><div class="cat-symbol">◎</div></div><div class="catalog-pills"><span>${esc(STEER_LABELS[w.steer])}</span>${pill('雨',wet,w.rain)}${pill('悪路',off,w.off)}</div><p class="catalog-note">${esc(w.on)}</p><details class="catalog-expand"><summary>詳しい特徴・注意点を見る</summary><div><b>オフロード:</b> ${esc(w.off)}<br><b>雨天:</b> ${esc(w.rain)}<br><b>メモ:</b> ${esc(w.note)}</div></details></article>`;
  }).join('');
  $('catalogNone').hidden=subset.length!==0;
}
$('diagnosticForm').addEventListener('change',renderResults);
$('diagnosticForm').addEventListener('reset',()=>requestAnimationFrame(renderResults));
$('wheelSearch').addEventListener('input',renderCatalog);
$('wheelFilters').addEventListener('click',e=>{
  const button=e.target.closest('button[data-filter]');if(!button)return;
  state.filter=button.dataset.filter;
  $('wheelFilters').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===button));
  renderCatalog();
});
try { if(localStorage.getItem('mechanic-theme')==='dark')document.body.classList.add('dark'); } catch (e) { /* local preview without storage */ }
function updateThemeButton(){$('themeBtn').textContent=document.body.classList.contains('dark')?'☀':'☾';}
$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');try{localStorage.setItem('mechanic-theme',document.body.classList.contains('dark')?'dark':'light');}catch(e){}updateThemeButton();});
updateThemeButton();renderResults();renderCatalog();

/* Embedded live wheel filter for guide.html. Wheel data comes from guide.js. */
(()=>{
'use strict';
const STEER_LABELS={underStrong:'アンダー強',underWeak:'アンダー弱',under:'アンダー',neutral:'ニュートラル',overWeak:'オーバー弱',overStrong:'オーバー強',over:'オーバー',slide:'スライド'};
const CATEGORIES=['オフロード','ストリート','スポーツ','チューナー','トラック','ハイエンド','SUV','マッスル'];
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

"use strict";
// Conditions are strict AND filters; no hard-coded recommendation ranks.
const chosen={issue:null,road:null,flags:new Set(),category:"",query:""};
const recent=[];
const byId=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const OPT_LABELS={
 under:'曲がりにくい',over:'曲がりすぎる',slip:'滑りやすい',
 city:'街・舗装路',highway:'高速道路',mountain:'山道・峠',offroad:'未舗装路',
 rain:'雨の日も安定',grip:'グリップ重視',turn:'曲がりやすさ',balanced:'癖の少なさ',bumps:'段差・着地への強さ'
};
function goodBumps(w){
 // Explicitly reject poor landing/bumps performance even when '着地' appears.
 const s=w.on+w.note;
 return /段差に強い|段差適応◎|段差適正高|バンプ耐性が高水準|着地耐性◎/.test(s) && !/着地耐性×|段差で滑る|跳ねると滑る/.test(s);
}
function comfortable(w){return /(癖がなく|平均的に高水準|全体的に高め|全体的に高性能|全て高性能|全体的には高性能|コントロールしやすい|安定性高)/.test(w.on) || w.steer==='neutral';}
function matches(w){
 const steer=w.steer;
 if(chosen.issue==='under' && !(['overWeak','over','overStrong'].includes(steer)||turnsWell(w)))return false;
 if(chosen.issue==='over' && !(['under','underWeak','underStrong'].includes(steer)))return false;
 if(chosen.issue==='slip' && !(hasGrip(w) && !/滑ると立て直せない|低速安定性低/.test(w.on)))return false;
 if(chosen.road==='city' && !(hasGrip(w)||comfortable(w)))return false;
 if(chosen.road==='highway' && (fastRisk(w)||['overStrong','slide'].includes(steer)||!(hasGrip(w)||comfortable(w))))return false;
 if(chosen.road==='mountain' && !(turnsWell(w)||['overWeak','over','overStrong'].includes(steer)))return false;
 if(chosen.road==='offroad' && offSafety(w)!==2)return false;
 if(chosen.flags.has('rain') && wetSafety(w)!==2)return false;
 if(chosen.flags.has('grip') && !hasGrip(w))return false;
 if(chosen.flags.has('turn') && !(turnsWell(w)||['overWeak','over','overStrong'].includes(steer)))return false;
 if(chosen.flags.has('balanced') && !comfortable(w))return false;
 if(chosen.flags.has('bumps') && !goodBumps(w))return false;
 if(chosen.category && chosen.category!==w.category)return false;
 if(chosen.query && ![w.name,w.on,w.off,w.rain,w.note,w.category,STEER_LABELS[w.steer]].join(' ').toLocaleLowerCase('ja').includes(chosen.query))return false;
 return true;
}
function listConditions(){
 const conditions=[];
 for(const group of ['issue','road'])if(chosen[group])conditions.push({group,value:chosen[group],name:OPT_LABELS[chosen[group]]});
 for(const val of ['rain','grip','turn','balanced','bumps'])if(chosen.flags.has(val))conditions.push({group:'flags',value:val,name:OPT_LABELS[val]});
 if(chosen.category)conditions.push({group:'category',value:chosen.category,name:'カテゴリ: '+chosen.category});
 if(chosen.query)conditions.push({group:'query',value:chosen.query,name:'検索: '+chosen.query});
 return conditions;
}
function removeCondition(group,value){
 if(group==='flags')chosen.flags.delete(value);
 else if(group==='query'){chosen.query='';byId('filterWheelSearch').value='';}
 else if(group==='category'){chosen.category='';byId('categoryFilter').value='';}
 else chosen[group]=null;
 for(let i=recent.length-1;i>=0;i--)if(recent[i].group===group && recent[i].value===value)recent.splice(i,1);
 update();
}
function resetAll(){chosen.issue=null;chosen.road=null;chosen.flags.clear();chosen.category='';chosen.query='';recent.length=0;byId('categoryFilter').value='';byId('filterWheelSearch').value='';update();}
function renderWheel(w){
 const rain=wetSafety(w),off=offSafety(w);
 const pill=(name,value)=>`<span class="tag ${value===2?'positive':value===-2?'caution':'neutral'}">${name}: ${value===2?'安定':value===-2?'注意':'条件付き'}</span>`;
 return `<article class="wheel-card"><div class="wheel-top"><div><span class="category">${escapeHTML(w.category)}</span><h3>${escapeHTML(w.name)}</h3></div><span class="wheel-id">No.${String(w.id).padStart(2,'0')}</span></div><div class="tags"><span class="tag">${escapeHTML(STEER_LABELS[w.steer])}</span>${pill('雨天',rain)}${pill('悪路',off)}</div><p class="feature">${escapeHTML(w.on)}</p><details><summary>特徴・注意点を確認</summary><div class="wheel-detail"><p><b>オフロード：</b>${escapeHTML(w.off)}</p><p><b>雨天：</b>${escapeHTML(w.rain)}</p><p><b>メモ：</b>${escapeHTML(w.note)}</p></div></details></article>`;
}
function update(){
 const conditions=listConditions();
 document.querySelectorAll('.choices').forEach(group=>{
  const type=group.dataset.group;
  group.querySelectorAll('button').forEach(btn=>{
   const selected=type==='flags'?chosen.flags.has(btn.dataset.value):chosen[type]===btn.dataset.value;
   btn.classList.toggle('selected',selected);
   btn.setAttribute('aria-pressed',String(selected));
  });
 });
 byId('activeFilters').innerHTML=conditions.length?conditions.map(c=>`<button type="button" class="active-chip" data-group="${c.group}" data-value="${escapeHTML(c.value)}" aria-label="${escapeHTML(c.name)}を解除">${escapeHTML(c.name)} <span aria-hidden="true">×</span></button>`).join(''):'<span class="empty-filter">まだ条件はありません。左から条件を選んでください。</span>';
 const found=wheels.filter(matches);
 byId('remainingCount').textContent=String(found.length);
 byId('resultStatus').textContent=`${found.length} / ${wheels.length}種類が一致`;
 byId('resultsGrid').innerHTML=found.map(renderWheel).join('');
 byId('noResults').hidden=found.length!==0;
 byId('undoLast').disabled=conditions.length===0;
 byId('clearAll').disabled=conditions.length===0;
}
document.querySelectorAll('.choices').forEach(group=>group.addEventListener('click',event=>{
 const button=event.target.closest('button[data-value]');if(!button)return;
 const type=group.dataset.group,val=button.dataset.value;
 if(type==='flags'){
  if(chosen.flags.has(val))removeCondition(type,val);
  else {chosen.flags.add(val);recent.push({group:type,value:val});update();}
 }else if(chosen[type]===val)removeCondition(type,val);
 else {
  if(chosen[type])for(let i=recent.length-1;i>=0;i--)if(recent[i].group===type)recent.splice(i,1);
  chosen[type]=val;recent.push({group:type,value:val});update();
 }
}));
byId('categoryFilter').addEventListener('change',event=>{
 const val=event.target.value;
 for(let i=recent.length-1;i>=0;i--)if(recent[i].group==='category')recent.splice(i,1);
 chosen.category=val;if(val)recent.push({group:'category',value:val});update();
});
byId('filterWheelSearch').addEventListener('input',event=>{
 const val=event.target.value.trim().toLocaleLowerCase('ja');
 for(let i=recent.length-1;i>=0;i--)if(recent[i].group==='query')recent.splice(i,1);
 chosen.query=val;if(val)recent.push({group:'query',value:val});update();
});
byId('activeFilters').addEventListener('click',event=>{
 const btn=event.target.closest('button[data-group]');if(btn)removeCondition(btn.dataset.group,btn.dataset.value);
});
byId('clearAll').addEventListener('click',resetAll);
byId('emptyClear').addEventListener('click',resetAll);
byId('undoLast').addEventListener('click',()=>{
 const current=listConditions();
 // Remove the most recently added condition that is still active.
 const last=[...recent].reverse().find(x=>current.some(c=>c.group===x.group && c.value===x.value)) || current.at(-1);
 if(last)removeCondition(last.group,last.value);
});

update();
})();

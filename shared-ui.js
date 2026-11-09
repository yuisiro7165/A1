/* Shared appearance memory: preserves existing per-page theme handlers while keeping pages in sync. */
(function(){
  const MAIN='palette-town-theme';
  const MECHANIC='mechanic-theme';
  const COLOR='palette-color-theme';
  try{
    const shared=localStorage.getItem(MAIN);
    const initial=(shared==='dark'||shared==='light')?shared:(localStorage.getItem(MECHANIC)||localStorage.getItem(COLOR)||'light');
    if(initial==='dark'||initial==='light'){
      localStorage.setItem(MECHANIC,initial);
      localStorage.setItem(COLOR,initial);
    }
  }catch(err){/* Browser may disable storage; individual page scripts own fallback. */}
  document.addEventListener('click',function(event){
    if(!event.target.closest('#themeBtn'))return;
    // Runs after the page's own button listener: no competing theme toggle.
    try{
      const page=document.body?.dataset.ptPage;
      const isDark=page==='color'?!document.body.classList.contains('light'):document.body.classList.contains('dark');
      const value=isDark?'dark':'light';
      localStorage.setItem(MAIN,value);
      localStorage.setItem(MECHANIC,value);
      localStorage.setItem(COLOR,value);
      document.getElementById('themeBtn')?.setAttribute('aria-label',isDark?'ライトモードに切り替え':'ダークモードに切り替え');
    }catch(err){}
  });
})();


/* Mechanic Desk: performance parts are displayed in the same order as Parts Guide.
   Move the existing rows, preserving checked states, event listeners, and pricing.
   This runs on DOMContentLoaded, after script.js has built #tierItems. */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tierItems');
  if (!container) return;
  const order = [
    'オイルポンプ',
    'ドライブシャフト',
    'シリンダーヘッド',
    'バッテリーケーブル',
    '燃料タンク'
  ];
  const rows = Array.from(container.children).filter(node => node.classList.contains('tier-row'));
  const byName = new Map(rows.map(row => [row.firstElementChild?.textContent.trim(), row]));
  if (!order.every(name => byName.has(name))) return;
  for (const name of order) container.appendChild(byName.get(name));
});

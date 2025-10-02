
// Core UI script used across pages
(function(){
  // Menu toggle - supports multiple menu button IDs on different pages
  function setupMenu(btnId, menuId, closeId){
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    const close = document.getElementById(closeId);
    if(!btn || !menu) return;
    btn.addEventListener('click', ()=>{ menu.classList.toggle('open'); menu.setAttribute('aria-hidden', menu.classList.contains('open') ? 'false' : 'true'); });
    if(close) close.addEventListener('click', ()=>{ menu.classList.remove('open'); menu.setAttribute('aria-hidden','true') });
    // close on ESC
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') { menu.classList.remove('open'); menu.setAttribute('aria-hidden','true') }});
  }

  // initialize menu buttons for different pages (IDs used in HTML files)
  document.addEventListener('DOMContentLoaded', ()=>{
    setupMenu('menuBtn','sideMenu','closeMenu');
    setupMenu('menuBtn2','sideMenu2','closeMenu2');
    setupMenu('menuBtn3','sideMenu3','closeMenu3');
    setupMenu('menuBtn4','sideMenu4','closeMenu4');
    setupMenu('menuBtn5','sideMenu5','closeMenu5');

    // platform adaptiveness: detect touch devices and desktop
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if(isTouch) document.body.classList.add('is-touch'); else document.body.classList.add('is-desktop');

    // restore request draft if present
    const saved = localStorage.getItem('requestDraft');
    if(saved && document.getElementById('saveDraftBtn')){
      const data = JSON.parse(saved);
      const form = document.getElementById('reqForm');
      if(form){ form.name.value = data.name || ''; form.telegram.value = data.telegram || ''; form.type.value = data.type || 'app'; form.message.value = data.message || ''; }
      const status = document.getElementById('reqStatus'); if(status) status.textContent='Loaded saved draft.';
    }

    // save draft button
    const saveBtn = document.getElementById('saveDraftBtn');
    if(saveBtn){ saveBtn.addEventListener('click', ()=>{
      const form = document.getElementById('reqForm'); if(!form) return;
      const d = {name: form.name.value, telegram: form.telegram.value, type: form.type.value, message: form.message.value};
      localStorage.setItem('requestDraft', JSON.stringify(d));
      const status = document.getElementById('reqStatus'); if(status) status.textContent='Draft saved locally.';
      setTimeout(()=>{ if(status) status.textContent=''; },2500);
    })}
  });

  // helper to open external links safely
  window.openExternal = function(url){ window.open(url,'_blank','noopener'); }

  // copy to clipboard helper
  window.copyText = function(text){ navigator.clipboard && navigator.clipboard.writeText(text).then(()=>{ alert('Copied to clipboard') }).catch(()=>{ prompt('Copy this:',text) }); }

  // info panel (used by home page 'more info' links)
  window.openInfo = function(key){
    const panel = document.getElementById('infoPanel');
    const content = document.getElementById('infoContent');
    if(!panel || !content) return;
    const data = {
      tubi: '<h3>Tubi — What to expect</h3><p>Large library of free movies and shows. Ads are present but selection is strong. Available on mobile, smart-TVs and web.</p><p><strong>Tip:</strong> Use the official app store links for updates and safety.</p>',
      pluto: '<h3>Pluto TV — What to expect</h3><p>Live channels + on-demand library. Best for themed channels like news and classic TV.</p>',
      crackle: '<h3>Crackle — What to expect</h3><p>Classic movies, occasional originals. Interface is simple and lightweight.</p>',
      plex: '<h3>Plex — What to expect</h3><p>Offers free ad-supported movies and the option to stream your personal library. Great device support.</p>',
      filmrise: '<h3>FilmRise — What to expect</h3><p>Strong niche catalogs (crime, documentaries, cult classics). Good for deep-dive binge sessions.</p>'
    };
    content.innerHTML = data[key] || '<p>No info available.</p>';
    panel.style.display='block'; panel.setAttribute('aria-hidden','false');
  }
  window.closeInfo = function(){ const panel = document.getElementById('infoPanel'); if(panel){ panel.style.display='none'; panel.setAttribute('aria-hidden','true'); } }

})();



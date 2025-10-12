// Shared script for menu, helpers and request draft handling
(function(){
  function initMenu(){
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    if(menuBtn && sideMenu){
      menuBtn.addEventListener('click', ()=>{
        sideMenu.classList.toggle('open');
        sideMenu.setAttribute('aria-hidden', sideMenu.classList.contains('open') ? 'false' : 'true');
      });
    }
    if(closeMenu && sideMenu){
      closeMenu.addEventListener('click', ()=>{ sideMenu.classList.remove('open'); sideMenu.setAttribute('aria-hidden','true'); });
    }
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && sideMenu) sideMenu.classList.remove('open'); });
  }

  function platformDetect(){
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if(isTouch) document.body.classList.add('is-touch'); else document.body.classList.add('is-desktop');
  }

  function restoreDraft(){
    try{
      const saved = localStorage.getItem('requestDraft');
      if(!saved) return;
      const data = JSON.parse(saved);
      const form = document.getElementById('reqForm');
      if(!form) return;
      form.name.value = data.name || '';
      form.telegram.value = data.telegram || '';
      form.type.value = data.type || 'app';
      form.message.value = data.message || '';
      const status = document.getElementById('reqStatus'); if(status) status.textContent='Loaded saved draft.';
    }catch(e){/*ignore*/}
  }

  function saveDraftButton(){
    const btn = document.getElementById('saveDraftBtn');
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const form = document.getElementById('reqForm'); if(!form) return;
      const d = {name: form.name.value, telegram: form.telegram.value, type: form.type.value, message: form.message.value};
      localStorage.setItem('requestDraft', JSON.stringify(d));
      const status = document.getElementById('reqStatus'); if(status){ status.textContent='Draft saved locally.'; setTimeout(()=>status.textContent='',2200); }
    });
  }

  // Helpers exposed globally
  window.openExternal = function(url){ window.open(url,'_blank','noopener'); }
  window.copyText = function(text){ if(navigator.clipboard) navigator.clipboard.writeText(text).then(()=>{ alert('Copied to clipboard') }).catch(()=>{ prompt('Copy this:',text) }); }

  // Info panel for article pages
  window.openInfo = function(key){
    const panel = document.getElementById('infoPanel');
    const content = document.getElementById('infoContent');
    if(!panel || !content) return;
    const data = {
      tubi: '<h3>Tubi — Quick Tips</h3><p>Use categories and the search bar. Some titles rotate in and out. The app is updated via store updates.</p>',
      pluto: '<h3>Pluto TV — Quick Tips</h3><p>Explore channels by category. Use the on-demand section for movie browsing.</p>',
      crackle: '<h3>Crackle — Quick Tips</h3><p>Best for older films. Sign in to sync watchlist across devices.</p>',
      plex: '<h3>Plex — Quick Tips</h3><p>Use Plex Pass for premium features. To stream your own files, follow the official Plex server setup guide.</p>',
      filmrise: '<h3>FilmRise — Quick Tips</h3><p>Great for documentaries. Browse by collection for themed marathons.</p>'
    };
    content.innerHTML = data[key] || '<p>No additional info.</p>';
    panel.style.display='block'; panel.setAttribute('aria-hidden','false');
  }
  window.closeInfo = function(){ const panel = document.getElementById('infoPanel'); if(panel){ panel.style.display='none'; panel.setAttribute('aria-hidden','true'); } }

  // Countdown helper for ad-free download pages with redirection
  window.startCountdown = function(btnId, seconds){
    const btn = document.getElementById(btnId);
    const circle = document.getElementById(btnId + '-circle');
    if(!btn || !circle) return;

    // Links assigned by button ID
    const links = {
      'btn-tubi': 'https://www.mediafire.com/file/778df5e8sa7qnyd/Tubi_v8.8.0_%2528add-free%2529.apk/file',
      'btn-pluto': 'https://www.mediafire.com/file/6yn28iv25xlwnkx/Pluto_TV_v5.37.1_%2528Adfree%2529.apk/file',
      'btn-crackle': 'https://www.mediafire.com/file/segmv4ofrqy7j44/Crackle_7.1.2_AddFree.apk/file',
      'btn-plex': 'https://www.mediafire.com/file/domvco2qy94x5ik/Plex-ad-free-v10.16.0.758.apk/file',
      'btn-filmrise': 'https://www.mediafire.com/file/sgpfwjv0gj1e4u7/FilmRise_v9.4_%2528AdFree%2529.apk/file'
    };

    let remaining = seconds;
    btn.disabled = true;
    btn.classList.add('disabled');
    circle.textContent = remaining;

    const interval = setInterval(()=>{
      remaining -= 1;
      circle.textContent = remaining;
      if(remaining <= 0){
        clearInterval(interval);
        btn.disabled = false;
        btn.classList.remove('disabled');
        btn.classList.add('ready');
        btn.style.background = '#10b981';
        btn.textContent = 'Download Now';
        btn.onclick = ()=> window.open(links[btnId], '_blank');
      }
    }, 1000);
  }

  // bootstrap
  document.addEventListener('DOMContentLoaded', ()=>{ initMenu(); platformDetect(); restoreDraft(); saveDraftButton(); });
})();

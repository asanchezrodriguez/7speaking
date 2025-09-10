// Inyecta el topbar compartido y maneja burger + marcado del link activo
(async function(){
  const mount = document.getElementById('topbarMount');
  if(!mount) return;

  // Intenta rutas relativas y absolutas (según dónde estés sirviendo la web)
  const candidates = [
    'partials/topbar.html',
    '/partials/topbar.html',
    './partials/topbar.html'
  ];

  let html = null;
  for (const p of candidates) {
    try {
      const r = await fetch(p, { cache:'no-store' });
      if (r.ok) { html = await r.text(); break; }
    } catch(e){}
  }

  if (!html) {
    // Si aún falla, mostramos un fallback para que se vea "algo"
    mount.innerHTML = '<div style="padding:10px;background:#0f1214;color:#e8eef2">7Speaking</div>';
    console.warn('[topbar] No se pudo cargar partials/topbar.html');
    return;
  }

  mount.innerHTML = html;

  // Lógica UI
  const burger = mount.querySelector('.tb-burger');
  const nav    = mount.querySelector('#tb-nav');

  burger?.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true':'false');
    document.body.classList.toggle('nav-open', open);
  });

  nav?.addEventListener('click', e=>{
    if(e.target.matches('a')){
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
      document.body.classList.remove('nav-open');
    }
  });

  // Marcar enlace activo por URL (rayita activa)
  const path = location.pathname.replace(/\/+$/,'').toLowerCase();
  mount.querySelectorAll('.tb-link').forEach(a=>{
    const href = (a.getAttribute('href') || '').toLowerCase();
    if(!href) return;
    const target = href === '/' ? '/index.html' : href;
    if (path.endsWith(target) || (target==='/index.html' && (path===''||path==='/'))) {
      a.setAttribute('aria-current','page');
    }
  });
})();

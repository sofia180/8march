(function() {
  const { initFirebase, isDemoMode, loadDemo, seedDemoIfEmpty, toast } = window.wishdrop;
  let db = null;
  let userId = null;

  function getId() {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  }

  function cover(link, preview) {
    if (preview) return preview;
    try {
      return `https://image.thum.io/get/width/800/${encodeURIComponent(link)}`;
    } catch (_) {
      return 'https://placehold.co/640x360?text=Gift';
    }
  }

  function renderGallery(gifts) {
    const grid = document.getElementById('galleryGrid');
    const empty = document.getElementById('galleryEmpty');
    grid.innerHTML = '';
    if (!gifts.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    gifts.forEach(g => {
      const card = document.createElement('div');
      card.className = 'card gift-card';
      card.innerHTML = `
        <a href="${g.link}" target="_blank" rel="noopener" style="display:block;">
          <div class="gift-cover"><img src="${cover(g.link, g.preview)}" alt="gift" loading="lazy"></div>
        </a>
      `;
      grid.appendChild(card);
    });
  }

  function listenFirebase() {
    const userRef = db.collection('users').doc(userId);
    userRef.collection('gifts').orderBy('addedAt', 'desc').onSnapshot((snap) => {
      const gifts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderGallery(gifts);
    });
  }

  function loadDemo() {
    seedDemoIfEmpty();
    const data = window.wishdrop.loadDemo();
    const user = data.users[userId];
    if (!user) { toast('Вишлист не найден'); return; }
    renderGallery(user.gifts || []);
  }

  function setupGallery() {
    userId = getId();
    db = initFirebase().db;
    const back = document.getElementById('backToCard');
    if (back) back.href = `card.html?id=${userId || ''}`;
    if (!userId) { toast('Нет id в ссылке'); return; }
    if (isDemoMode()) loadDemo(); else listenFirebase();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'gallery') setupGallery();
  });
})();

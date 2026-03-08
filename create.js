(function() {
  const { initFirebase, isDemoMode, loadDemo, saveDemo, seedDemoIfEmpty, toast, t } = window.wishdrop;
  let db = null;
  let gifts = [];
  const TG_BOT_NAME = 'glamgift_bot'; // Telegram bot username
  const PHOTO_PLACEHOLDER = 'https://placehold.co/200x200?text=Wish';
  const MAX_NAME = 80;
  const MAX_ABOUT = 280;

  function previewFromLink(url) {
    try {
      const encoded = encodeURIComponent(url);
      return `https://image.thum.io/get/width/800/${encoded}`;
    } catch (_) {
      return null;
    }
  }

  function isValidUrl(url) {
    try {
      const u = new URL(url);
      return u.protocol === 'https:' || u.protocol === 'http:';
    } catch (_) {
      return false;
    }
  }

  function renderGifts() {
    const container = document.getElementById('giftList');
    if (!container) return;
    container.innerHTML = '';
    if (!gifts.length) {
      container.innerHTML = `<p class="small">${t('create.giftEmpty')}</p>`;
      return;
    }
    gifts.forEach((g) => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="gift-item">
          <div style="flex:1;">
            <div class="title">${g.link}</div>
            <div class="small">${t('status.needed')}</div>
          </div>
          <button class="btn ghost" data-remove="${g.id}">✕</button>
        </div>`;
      container.appendChild(div);
    });
    container.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        gifts = gifts.filter(g => g.id !== btn.dataset.remove);
        renderGifts();
      });
    });
  }

  function applyProfileFromQuery() {
    const params = new URLSearchParams(location.search);
    const tgRaw = params.get('tg');
    if (tgRaw) {
      try {
        const tg = JSON.parse(decodeURIComponent(tgRaw));
        const nameField = document.getElementById('name');
        const photoField = document.getElementById('photo');
        if (nameField && !nameField.value) {
          const composed = tg.username ? `@${tg.username}` : [tg.first_name, tg.last_name].filter(Boolean).join(' ');
          nameField.value = composed || '';
        }
        if (photoField && tg.photo_url && !photoField.value) photoField.value = tg.photo_url;
        toast('Telegram connected');
      } catch (_) {
        // ignore parsing errors
      }
    }
  }

  function injectTelegramWidget() {
    if (!TG_BOT_NAME || TG_BOT_NAME === 'YOUR_TG_BOT_USERNAME') return;
    const placeholder = document.getElementById('tgWidget');
    if (!placeholder) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', TG_BOT_NAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', `${location.origin}/api/telegram`);
    script.setAttribute('data-request-access', 'write');
    placeholder.appendChild(script);
  }

  async function saveProfile() {
    const name = document.getElementById('name').value.trim();
    const photo = document.getElementById('photo').value.trim();
    const about = document.getElementById('about').value.trim();
    if (!name) { toast(t('toast.enterName')); return; }
    if (name.length > MAX_NAME || about.length > MAX_ABOUT) { toast(t('toast.fieldTooLong')); return; }
    if (!gifts.length) { toast(t('toast.addGift')); return; }

    const id = crypto.randomUUID();
    const baseData = {
      name,
      photo: photo || PHOTO_PLACEHOLDER,
      about,
      searchName: name.toLowerCase(),
      sentCount: 0,
      createdAt: Date.now()
    };

    if (isDemoMode()) {
      seedDemoIfEmpty();
      const data = loadDemo();
      data.users[id] = { ...baseData, id, gifts: [...gifts] };
      saveDemo(data);
      toast(t('toast.demoSaved'));
      setTimeout(() => location.href = `card.html?id=${id}`, 400);
      return;
    }

    if (!db) db = initFirebase().db;
    const userRef = db.collection('users').doc();
    const batch = db.batch();
    batch.set(userRef, baseData);
    gifts.forEach(g => {
      const giftRef = userRef.collection('gifts').doc(g.id);
      batch.set(giftRef, {
        link: g.link,
        status: 'needed',
        donor: '',
        addedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    try {
      await batch.commit();
      toast(t('toast.profileCreated'));
      setTimeout(() => location.href = `card.html?id=${userRef.id}`, 400);
    } catch (e) {
      console.error(e);
      toast(t('toast.saveError'));
    }
  }

  function setupCreatePage() {
    db = initFirebase().db;
    const demoBadge = document.getElementById('demoBadge');
    if (isDemoMode()) { demoBadge && (demoBadge.style.display = 'inline-flex'); }

    document.getElementById('connectInsta').addEventListener('click', () => toast(t('toast.instaConnected')));
    document.getElementById('connectTg').addEventListener('click', () => {
      if (TG_BOT_NAME === 'YOUR_TG_BOT_USERNAME') {
        toast('Добавьте username бота в create.js');
        return;
      }
      // Telegram widget auto-opens if embedded; fallback to auth-url
      window.open(`https://telegram.me/${TG_BOT_NAME}`, '_blank');
    });

    document.getElementById('addGift').addEventListener('click', (e) => {
      e.preventDefault();
      const url = document.getElementById('giftUrl').value.trim();
      if (!url) return toast(t('toast.enterUrl'));
      if (!isValidUrl(url) || !url.startsWith('https://')) return toast(t('toast.invalidUrl'));
      gifts.push({ id: crypto.randomUUID(), link: url, status: 'needed', preview: previewFromLink(url) });
      document.getElementById('giftUrl').value = '';
      renderGifts();
    });

    document.getElementById('saveProfile').addEventListener('click', (e) => {
      e.preventDefault();
      saveProfile();
    });

    document.getElementById('resetForm').addEventListener('click', () => {
      document.getElementById('createForm').reset();
      gifts = [];
      renderGifts();
    });

    injectTelegramWidget();
    applyProfileFromQuery();
    renderGifts();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'create') setupCreatePage();
  });
})();

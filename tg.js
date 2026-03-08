(function() {
  const { initFirebase, isDemoMode, loadDemo, saveDemo, seedDemoIfEmpty, toast, t } = window.wishdrop;
  const tg = window.Telegram && window.Telegram.WebApp;
  let db = null;
  let gifts = [];
  let tgUser = null;
  const MAX_NAME = 80;
  const MAX_ABOUT = 280;
  const MAX_FILE = 3 * 1024 * 1024;
  let fileToUpload = null;

  function applyTgTheme() {
    if (!tg) return;
    tg.ready();
    tg.expand();
    const theme = tg.themeParams || {};
    document.body.style.setProperty('--bg', '#0d1b2a');
    if (theme.bg_color) document.body.style.backgroundColor = theme.bg_color;
  }

  async function verifyInitData() {
    if (!tg) return null;
    // Если initData пусто, попробуем использовать initDataUnsafe (может работать в десктопе).
    if (!tg.initData && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      return { user: tg.initDataUnsafe.user, verified: false };
    }
    if (!tg.initData) return null;
    try {
      const res = await fetch('/api/tg-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: tg.initData })
      });
      const data = await res.json();
      if (data.ok) return { user: data.user, verified: true };
    } catch (e) {
      console.warn('tg verify failed', e);
      // fallback: использовать initDataUnsafe без верификации
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        return { user: tg.initDataUnsafe.user, verified: false };
      }
    }
    return null;
  }

  function isValidUrl(url) {
    try {
      const u = new URL(url);
      return u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  function handleFileInput(file) {
    if (!file) return;
    if (file.size > MAX_FILE) {
      toast('Файл больше 3 МБ');
      fileToUpload = null;
      document.getElementById('photoFile').value = '';
      return;
    }
    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
      toast('Только изображения или PDF');
      fileToUpload = null;
      document.getElementById('photoFile').value = '';
      return;
    }
    fileToUpload = file;
  }

  async function uploadFile(userId) {
    if (!fileToUpload) return { photoUrl: null, photoPdf: null };
    const isPdf = fileToUpload.type === 'application/pdf';
    const ext = isPdf ? 'pdf' : (fileToUpload.name.split('.').pop() || 'jpg');
    const path = `avatars/${userId}.${ext}`;
    const storage = firebase.storage();
    const ref = storage.ref().child(path);
    await ref.put(fileToUpload);
    const url = await ref.getDownloadURL();
    return { photoUrl: isPdf ? 'https://placehold.co/200x200?text=Photo' : url, photoPdf: isPdf ? url : null };
  }

  function renderGifts() {
    const container = document.getElementById('giftList');
    if (!container) return;
    container.innerHTML = '';
    if (!gifts.length) {
      container.innerHTML = '<p class="small">Добавьте хотя бы одну ссылку на подарок.</p>';
      return;
    }
    gifts.forEach((g) => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="gift-item">
          <div style="flex:1;">
            <div class="title">${g.link}</div>
            <div class="small">ещё нужно</div>
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

  async function saveProfile() {
    const name = document.getElementById('name').value.trim();
    const photo = document.getElementById('photo').value.trim();
    const about = document.getElementById('about').value.trim();
    if (!name) { toast('Введите имя'); return; }
    if (name.length > MAX_NAME || about.length > MAX_ABOUT) { toast('Слишком длинное поле'); return; }
    if (!gifts.length) { toast('Добавьте хотя бы один подарок'); return; }

    const id = crypto.randomUUID();
    const baseData = {
      name,
      photo,
      about,
      searchName: name.toLowerCase(),
      sentCount: 0,
      createdAt: Date.now(),
      tgId: tgUser?.id || null,
      tgUsername: tgUser?.username || null,
      tgName: [tgUser?.first_name, tgUser?.last_name].filter(Boolean).join(' ')
    };

    if (isDemoMode()) {
      seedDemoIfEmpty();
      const data = loadDemo();
      data.users[id] = { ...baseData, id, gifts: [...gifts] };
      saveDemo(data);
      toast('Сохранено (демо)');
      setTimeout(() => location.href = `card.html?id=${id}`, 300);
      return;
    }

    if (!db) db = initFirebase().db;
    const userRef = db.collection('users').doc();
    if (fileToUpload) {
      try {
        const uploaded = await uploadFile(userRef.id);
        baseData.photo = uploaded.photoUrl || baseData.photo;
        baseData.photoPdf = uploaded.photoPdf || null;
      } catch (e) {
        console.error(e);
        toast('Не удалось загрузить файл');
      }
    }
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
      toast('Профиль создан!');
      setTimeout(() => location.href = `card.html?id=${userRef.id}`, 300);
    } catch (e) {
      console.error(e);
      // fallback в демо, чтобы не терять ввод
      seedDemoIfEmpty();
      const data = loadDemo();
      data.users[userRef.id] = { ...baseData, id: userRef.id, gifts: [...gifts] };
      saveDemo(data);
      toast('Firebase недоступен, сохранено в демо-режиме');
      setTimeout(() => location.href = `card.html?id=${userRef.id}`, 300);
    }
  }

  async function setupTgPage() {
    applyTgTheme();
    db = initFirebase().db;
    const statusEl = document.getElementById('tgStatus');

    const verifyRes = await verifyInitData();
    tgUser = verifyRes && verifyRes.user;
    if (tgUser) {
      statusEl.textContent = verifyRes.verified
        ? `Подключено: @${tgUser.username || tgUser.id}`
        : `Подключено (без верификации): @${tgUser.username || tgUser.id}`;
      const nameField = document.getElementById('name');
      const photoField = document.getElementById('photo');
      if (nameField && !nameField.value) nameField.value = tgUser.username ? `@${tgUser.username}` : tgUser.first_name || '';
      if (photoField && tgUser.photo_url && !photoField.value) photoField.value = tgUser.photo_url;
    } else {
      statusEl.textContent = 'Не удалось подтвердить Telegram, можно заполнить вручную.';
    }

    document.getElementById('tgClose').addEventListener('click', () => tg && tg.close());
    document.getElementById('addGift').addEventListener('click', (e) => {
      e.preventDefault();
      const url = document.getElementById('giftUrl').value.trim();
      if (!url) return toast('Вставьте ссылку');
      if (!isValidUrl(url)) return toast('Введите корректную https ссылку');
      gifts.push({ id: crypto.randomUUID(), link: url, status: 'needed' });
      document.getElementById('giftUrl').value = '';
      renderGifts();
    });
    document.getElementById('saveProfile').addEventListener('click', (e) => { e.preventDefault(); saveProfile(); });
    document.getElementById('resetForm').addEventListener('click', () => { document.getElementById('giftUrl').value=''; document.getElementById('about').value=''; document.getElementById('photo').value=''; renderGifts(); });
    document.getElementById('shareTg').addEventListener('click', () => {
      if (tg && tg.shareMessage) {
        tg.shareMessage('Смотри мой вишлист в WishDrop 👉 https://8march.extender.cards');
      } else {
        toast('Поделиться можно через кнопку внутри Telegram');
      }
    });
    const photoFileInput = document.getElementById('photoFile');
    if (photoFileInput) {
      photoFileInput.addEventListener('change', (e) => handleFileInput(e.target.files[0]));
    }
    renderGifts();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'tg') setupTgPage();
  });
})();

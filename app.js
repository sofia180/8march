// Shared utilities + index page logic
(function() {
  const translations = {
    ru: {
      "nav.about": "О продукте",
      "nav.create": "Создать вишлист",
      "nav.home": "На главную",
      "nav.preview": "Предпросмотр",
      "nav.all": "Все вишлисты",
      "nav.share": "Поделиться",
      "share.copy": "Копировать",
      "hero.title": "Подарочные вишлисты, которые доходят вовремя",
      "hero.subtitle": "Создайте свою страницу, добавьте подарки и делитесь ссылкой. Друзья и подписчики увидят, что ещё нужно, могут зарезервировать и отправить подарок — а топ-лист обновится мгновенно.",
      "cta.create": "Создать вишлист",
      "cta.find": "Найти друзей",
      "search.title": "Глобальный поиск",
      "search.badge": "Живые данные через Firebase",
      "search.placeholder": "Введите имя...",
      "search.empty": "Ничего не найдено. Попробуйте другое имя.",
      "search.noAbout": "Без описания",
      "search.sent": "отправлено",
      "search.open": "Открыть",
      "search.copy": "Скопировать ссылку",
      "top.title": "Топ получателей",
      "top.sub": "Обновляется в реальном времени",
      "top.gifts": "подарков",
      "top.fallback": "Любит сюрпризы",
      "footer.text": "WishDrop · Вирусный MVP к 8 марта · Сделано с заботой",
      "count.days": "Дней",
      "count.hours": "Часов",
      "count.minutes": "Минут",
      "count.seconds": "Секунд",
      "toast.linkCopied": "Ссылка скопирована",
      "badge.demo": "Демо-режим (localStorage)",
      "create.title": "Создайте свою страницу",
      "create.subtitle": "Данные хранятся глобально через Firebase. Заполните поля, добавьте подарки, подключите соцсети.",
      "create.name": "Имя",
      "create.name.ph": "Например, Анна",
      "create.photo": "Фото (URL)",
      "create.photo.ph": "https://...jpg",
      "create.about": "Описание",
      "create.about.ph": "Расскажите, что любите и чем увлекаетесь",
      "create.connectInsta": "Подключить Instagram",
      "create.connectTg": "Подключить Telegram",
      "create.gifts": "Подарки",
      "create.gift.ph": "Вставьте ссылку на подарок",
      "create.giftAdd": "Добавить",
      "create.giftEmpty": "Добавьте хотя бы одну ссылку на подарок.",
      "create.save": "Сохранить и получить ссылку",
      "create.reset": "Очистить",
      "toast.enterName": "Введите имя",
      "toast.addGift": "Добавьте хотя бы один подарок",
      "toast.demoSaved": "Сохранено в демо-режиме",
      "toast.profileCreated": "Профиль создан!",
      "toast.saveError": "Ошибка сохранения, проверьте ключи Firebase",
      "toast.enterUrl": "Вставьте ссылку",
      "toast.instaConnected": "Instagram подключён (симуляция)",
      "toast.tgConnected": "Telegram подключён (симуляция)",
      "toast.firebaseBlocked": "Firebase недоступен, показаны демо-данные",
      "toast.invalidUrl": "Введите корректную ссылку (https)",
      "toast.fieldTooLong": "Слишком длинное значение поля",
      "card.status.loading": "Загрузка...",
      "card.status.active": "Вишлист активен",
      "card.profile.noAbout": "Описание пользователя появится здесь.",
      "card.profile.addAbout": "Добавьте описание, чтобы друзьям было легче подобрать подарок",
      "card.gifts.title": "Подарки",
      "card.gifts.counterSuffix": "позиций",
      "card.gifts.empty": "Подарков пока нет. Добавьте их на странице создания.",
      "card.gift.reserve": "Зарезервировать",
      "card.gift.send": "Отправить",
      "card.prompt.name": "Введите ваше имя или оставьте пустым для анонимности",
      "card.toast.updated": "Обновлено",
      "card.toast.statusUpdated": "Статус обновлён",
      "card.toast.notFound": "Такого вишлиста нет",
      "card.toast.noId": "Нет id в ссылке",
      "status.needed": "ещё нужно",
      "status.reserved": "зарезервировано",
      "status.sent": "отправлено"
    },
    en: {
      "nav.about": "About",
      "nav.create": "Create wishlist",
      "nav.home": "Home",
      "nav.preview": "Preview",
      "nav.all": "All wishlists",
      "nav.share": "Share",
      "share.copy": "Copy",
      "hero.title": "Gift wishlists that arrive on time",
      "hero.subtitle": "Create your page, add gifts and share the link. Friends can see what’s still needed, reserve or send gifts, and the leaderboard updates instantly.",
      "cta.create": "Create wishlist",
      "cta.find": "Find friends",
      "search.title": "Global search",
      "search.badge": "Live data via Firebase",
      "search.placeholder": "Type a name...",
      "search.empty": "Nothing found. Try another name.",
      "search.noAbout": "No description",
      "search.sent": "sent",
      "search.open": "Open",
      "search.copy": "Copy link",
      "top.title": "Top receivers",
      "top.sub": "Updates in real time",
      "top.gifts": "gifts",
      "top.fallback": "Loves surprises",
      "footer.text": "WishDrop · Viral MVP for March 8 · Made with care",
      "count.days": "Days",
      "count.hours": "Hours",
      "count.minutes": "Minutes",
      "count.seconds": "Seconds",
      "toast.linkCopied": "Link copied",
      "badge.demo": "Demo mode (localStorage)",
      "create.title": "Create your page",
      "create.subtitle": "Data is stored globally via Firebase. Fill fields, add gifts, connect socials.",
      "create.name": "Name",
      "create.name.ph": "e.g., Anna",
      "create.photo": "Photo (URL)",
      "create.photo.ph": "https://...jpg",
      "create.about": "Description",
      "create.about.ph": "Tell friends what you like",
      "create.connectInsta": "Connect Instagram",
      "create.connectTg": "Connect Telegram",
      "create.gifts": "Gifts",
      "create.gift.ph": "Paste a gift link",
      "create.giftAdd": "Add",
      "create.giftEmpty": "Add at least one gift link.",
      "create.save": "Save and get link",
      "create.reset": "Reset",
      "toast.enterName": "Enter a name",
      "toast.addGift": "Add at least one gift",
      "toast.demoSaved": "Saved in demo mode",
      "toast.profileCreated": "Profile created!",
      "toast.saveError": "Save error, check Firebase keys",
      "toast.enterUrl": "Paste a link",
      "toast.instaConnected": "Instagram connected (simulation)",
      "toast.tgConnected": "Telegram connected (simulation)",
      "toast.firebaseBlocked": "Firebase unavailable, showing demo data",
      "toast.invalidUrl": "Enter a valid https link",
      "toast.fieldTooLong": "Field value is too long",
      "card.status.loading": "Loading...",
      "card.status.active": "Wishlist is active",
      "card.profile.noAbout": "User description will appear here.",
      "card.profile.addAbout": "Add a description so friends pick better gifts",
      "card.gifts.title": "Gifts",
      "card.gifts.counterSuffix": "items",
      "card.gifts.empty": "No gifts yet. Add them on the create page.",
      "card.gift.reserve": "Reserve",
      "card.gift.send": "Send",
      "card.prompt.name": "Enter your name or leave blank to stay anonymous",
      "card.toast.updated": "Updated",
      "card.toast.statusUpdated": "Status updated",
      "card.toast.notFound": "Wishlist not found",
      "card.toast.noId": "No id in the link",
      "status.needed": "needed",
      "status.reserved": "reserved",
      "status.sent": "sent"
    }
  };

  const firebaseConfig = {
    apiKey: "AIzaSyA7ajBsIQjC3pCiNUKSNBMgl3JAowol350",
    authDomain: "march-5e429.firebaseapp.com",
    projectId: "march-5e429",
    storageBucket: "march-5e429.firebasestorage.app",
    messagingSenderId: "1095079918228",
    appId: "1:1095079918228:web:a5b931de8ca910ad39d281",
    measurementId: "G-GFTR4HDMP5"
  };

  const DEMO_KEY = 'wishdrop-demo';
  let demoDataCache = null;
  let topListCache = [];
  let searchCache = [];
  let firebaseBlocked = false;

  function getLang() {
    return localStorage.getItem('wishdrop-lang') || 'ru';
  }

  function setLang(lang) {
    localStorage.setItem('wishdrop-lang', lang);
    document.documentElement.lang = lang;
  }

  function t(key) {
    const lang = getLang();
    return (translations[lang] && translations[lang][key]) || translations.ru[key] || translations.en[key] || key;
  }

  function applyTranslations() {
    const lang = getLang();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const text = t(key);
      if (text !== undefined) el.textContent = text;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const text = t(key);
      if (text !== undefined) el.placeholder = text;
    });
    const switcher = document.getElementById('langSwitch');
    if (switcher) {
      switcher.value = lang;
    }
  }

  function isDemoMode() {
    const missing = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_');
    if (missing) window.demoMode = true;
    return missing;
  }

  function initFirebase() {
    if (isDemoMode()) return { db: null };
    if (window._wishdropDb) return { db: window._wishdropDb };
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    window._wishdropApp = app;
    window._wishdropDb = db;
    return { db };
  }

  function loadDemo() {
    if (demoDataCache) return demoDataCache;
    const raw = localStorage.getItem(DEMO_KEY);
    demoDataCache = raw ? JSON.parse(raw) : { users: {} };
    return demoDataCache;
  }

  function saveDemo(data) {
    demoDataCache = data;
    localStorage.setItem(DEMO_KEY, JSON.stringify(data));
  }

  function seedDemoIfEmpty() {
    const data = loadDemo();
    if (Object.keys(data.users).length) return;
    const sampleUsers = [
      { name: 'Анна', about: 'Люблю цветы, свечи и книги. Работаю в дизайне.', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' },
      { name: 'Мария', about: 'Путешествия, пледы и ароматный кофе', photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80' },
      { name: 'Ева', about: 'Учусь на врача, мечтаю о рюкзаке и новых кроссовках', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' }
    ];
    sampleUsers.forEach((u, idx) => {
      const id = crypto.randomUUID();
      data.users[id] = {
        id,
        name: u.name,
        about: u.about,
        photo: u.photo,
        sentCount: idx === 0 ? 2 : idx === 1 ? 1 : 0,
        createdAt: Date.now(),
        gifts: [
          { id: crypto.randomUUID(), link: 'https://example.com/gift-' + idx, status: 'needed', donor: '' },
          { id: crypto.randomUUID(), link: 'https://example.com/book-' + idx, status: idx === 0 ? 'sent' : 'needed', donor: 'Друг' }
        ],
        searchName: u.name.toLowerCase()
      };
    });
    saveDemo(data);
  }

  function seedFallbackDemoIfEmpty() {
    const data = loadDemo();
    if (Object.keys(data.users).length) return;
    const sampleUsers = [
      { name: 'Мария Орлова', about: 'Маркетинг и путешествия, мечтаю о новом чемодане и kindle.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', sentCount: 7 },
      { name: 'Антон Савельев', about: 'Готовка, кофе, беговые кроссы — люблю практичные подарки.', photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80', sentCount: 5 },
      { name: 'Sofia Summers', about: 'Product designer, plants lover, cozy candles collector.', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80', sentCount: 9 },
      { name: 'Leo Martins', about: 'Runner & gamer, saving for headphones and smartwatch.', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80', sentCount: 6 },
      { name: 'Алина Радужная', about: 'Иллюстратор, обожаю скетчбуки и маркеры.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80', sentCount: 8 },
      { name: 'Mila Patel', about: 'Yoga, travel, minimal jewelry.', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80', sentCount: 4 },
      { name: 'Ilya Petroff', about: 'Front-end dev, мечтаю о механике и новом мониторе.', photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80', sentCount: 3 },
      { name: 'Natalie Cruz', about: 'Runner, skincare geek, loves gift cards.', photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80', sentCount: 10 }
    ];
    sampleUsers.forEach((u) => {
      const id = crypto.randomUUID();
      data.users[id] = {
        id,
        name: u.name,
        about: u.about,
        photo: u.photo,
        sentCount: u.sentCount,
        createdAt: Date.now(),
        gifts: [
          { id: crypto.randomUUID(), link: 'https://example.com/gift', status: 'needed', donor: '', preview: 'https://placehold.co/640x360?text=Gift' },
          { id: crypto.randomUUID(), link: 'https://example.com/gift2', status: 'sent', donor: 'Friend', preview: 'https://placehold.co/640x360?text=Gift' }
        ],
        searchName: u.name.toLowerCase()
      };
    });
    saveDemo(data);
  }

  function toast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
  }

  function formatCountdown(target) {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  function renderCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const now = new Date();
    let year = now.getFullYear();
    const passed = (now.getMonth() > 2) || (now.getMonth() === 2 && now.getDate() > 8);
    if (passed) year += 1;
    const target = new Date(`${year}-03-08T23:59:59`);
    const update = () => {
      const { days, hours, minutes, seconds } = formatCountdown(target);
      const labels = [t('count.days'), t('count.hours'), t('count.minutes'), t('count.seconds')];
      el.innerHTML = labels.map((label, i) => {
        const val = [days, hours, minutes, seconds][i];
        return `<div class="count-block"><div class="value">${String(val).padStart(2, '0')}</div><div class="label">${label}</div></div>`;
      }).join('');
    };
    update();
    setInterval(update, 1000);
  }

  function renderTopList(items) {
    topListCache = items || [];
    const list = document.getElementById('topList');
    if (!list) return;
    list.innerHTML = '';
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="flex wrap" style="align-items:center; gap:10px;">
        <span class="badge dark">#${idx + 1}</span>
        <img class="avatar" src="${item.photo || 'https://placekitten.com/120/120'}" alt="avatar" />
        <div>
          <div style="font-weight:700;">${item.name}</div>
          <div class="small">${item.about || t('top.fallback')}</div>
        </div>
      </div>
      <div class="badge">${item.sentCount || 0} ${t('top.gifts')}</div>`;
      list.appendChild(li);
    });
  }

  function renderSearch(results) {
    searchCache = results || [];
    const container = document.getElementById('searchResults');
    const empty = document.getElementById('searchEmpty');
    if (!container) return;
    container.innerHTML = '';
    if (!results.length) {
      empty && (empty.style.display = 'block');
      return;
    }
    empty && (empty.style.display = 'none');
    results.forEach(user => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <div class="flex wrap" style="align-items:center; gap:12px;">
          <img class="avatar" src="${user.photo || 'https://placehold.co/80x80'}" alt="avatar" />
          <div>
            <h3>${user.name}</h3>
            <p>${user.about || t('search.noAbout')}</p>
            <div class="badge dark">${user.sentCount || 0} ${t('search.sent')}</div>
          </div>
        </div>
        <div class="flex wrap" style="margin-top:10px;">
          <a class="btn secondary" href="card.html?id=${user.id}">${t('search.open')}</a>
          <button class="btn ghost" data-copy="${location.origin}${location.pathname.replace('index.html','')}card.html?id=${user.id}">${t('search.copy')}</button>
        </div>`;
      container.appendChild(div);
    });
    container.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy).then(() => toast(t('toast.linkCopied')));
      });
    });
  }

  function searchRealtime(db, term) {
    if (!term) { renderSearch([]); return; }
    const q = term.toLowerCase();
    db.collection('users')
      .where('searchName', '>=', q)
      .where('searchName', '<=', q + '\uf8ff')
      .limit(12)
      .get()
      .then((snap) => {
        const res = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderSearch(res);
      })
      .catch((err) => {
        console.warn('Search fallback to demo', err);
        firebaseBlocked = true;
        toast(t('toast.firebaseBlocked'));
        searchDemo(term);
      });
  }

  function searchDemo(term) {
    seedFallbackDemoIfEmpty();
    if (!term) { renderSearch([]); return; }
    const data = loadDemo();
    const res = Object.values(data.users).filter(u => u.name.toLowerCase().includes(term.toLowerCase()));
    renderSearch(res);
  }

  function listenTopListRealtime(db) {
    db.collection('users').orderBy('sentCount', 'desc').limit(10).onSnapshot(
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderTopList(list);
      },
      (err) => {
        console.warn('Top list fallback to demo', err);
        firebaseBlocked = true;
        toast(t('toast.firebaseBlocked'));
        renderTopListDemo();
      }
    );
  }

  function renderTopListDemo() {
    seedFallbackDemoIfEmpty();
    const data = loadDemo();
    const list = Object.values(data.users).sort((a,b) => (b.sentCount||0) - (a.sentCount||0)).slice(0, 10);
    renderTopList(list);
  }

  function setupIndexPage() {
    renderCountdown();
    if (isDemoMode()) seedDemoIfEmpty();
    const db = initFirebase().db;
    const topListFunc = db ? () => listenTopListRealtime(db) : renderTopListDemo;
    topListFunc();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let timer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timer);
        const value = e.target.value.trim();
        timer = setTimeout(() => {
          if (db && !firebaseBlocked) searchRealtime(db, value); else searchDemo(value);
        }, 200);
      });
    }
  }

  // expose helpers for other scripts
  window.wishdrop = {
    initFirebase,
    isDemoMode,
    loadDemo,
    saveDemo,
    seedDemoIfEmpty,
    toast,
    t,
    applyTranslations,
    setLang,
    getLang
  };

  document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    const switcher = document.getElementById('langSwitch');
    if (switcher) {
      switcher.addEventListener('change', (e) => {
        setLang(e.target.value);
        applyTranslations();
        renderTopList(topListCache);
        renderSearch(searchCache);
      });
    }
    const page = document.body.dataset.page;
    if (page === 'index') setupIndexPage();
  });
})();

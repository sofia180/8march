(function() {
  const { initFirebase, isDemoMode, loadDemo, saveDemo, seedDemoIfEmpty, toast, t } = window.wishdrop;
  let db = null;
  let userId = null;

  function getId() {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  }

  function renderProfile(data) {
    document.getElementById('profileName').textContent = data.name || '—';
    document.getElementById('profileAbout').textContent = data.about || t('card.profile.addAbout');
    const photoEl = document.getElementById('profilePhoto');
    if (data.photo) photoEl.src = data.photo;
    else photoEl.src = 'https://placehold.co/120x120?text=Wish';
    const socials = document.getElementById('socials');
    if (socials) {
      socials.innerHTML = '';
      if (data.tgUsername) socials.innerHTML += `<span class="badge dark">@${data.tgUsername}</span>`;
      if (data.photoPdf) socials.innerHTML += `<a class="badge dark" href="${data.photoPdf}" target="_blank" rel="noopener">PDF фото</a>`;
    }
    document.getElementById('shareLink').value = `${location.origin}${location.pathname.replace('card.html','')}card.html?id=${userId}`;
    document.getElementById('statusBadge').textContent = t('card.status.active');
  }

  function displayLink(link) {
    try {
      const u = new URL(link);
      const path = u.pathname.length > 24 ? u.pathname.slice(0, 24) + '…' : u.pathname;
      return `${u.hostname}${path}`;
    } catch (_) {
      return link;
    }
  }

  function giftThumb(link) {
    try {
      const u = new URL(link);
      return `https://www.google.com/s2/favicons?sz=64&domain=${u.hostname}`;
    } catch (_) {
      return 'https://www.google.com/s2/favicons?sz=64&domain=example.com';
    }
  }

  function giftCover(g) {
    if (g.preview) return g.preview;
    try {
      const u = new URL(g.link);
      return `https://image.thum.io/get/width/800/${encodeURIComponent(g.link)}`;
    } catch (_) {
      return 'https://placehold.co/640x360?text=Gift';
    }
  }

  function statusLabel(status) {
    if (status === 'reserved') return t('status.reserved');
    if (status === 'sent') return t('status.sent');
    return t('status.needed');
  }

  function renderGifts(list) {
    const container = document.getElementById('giftContainer');
    const counter = document.getElementById('giftCounter');
    container.innerHTML = '';
    counter.textContent = `${list.length} ${t('card.gifts.counterSuffix')}`;
    if (!list.length) {
      container.innerHTML = `<p class="small">${t('card.gifts.empty')}</p>`;
      return;
    }

    list.forEach(g => {
      const card = document.createElement('div');
      card.className = 'card gift-card';
      const disabled = g.status === 'sent';
      card.innerHTML = `
        <div class="gift-cover"><img src="${giftCover(g)}" alt="gift" loading="lazy" /></div>
        <div class="gift-body">
          <div class="title"><a href="${g.link}" target="_blank" rel="noopener">${displayLink(g.link)}</a></div>
          <div class="flex wrap" style="align-items:center; gap:8px;">
            <span class="status-chip ${g.status}">${statusLabel(g.status)}</span>
            <div class="gift-thumb"><img src="${giftThumb(g.link)}" alt="icon" /></div>
            ${g.donor ? `<span class="small">От: ${g.donor}</span>` : ''}
          </div>
          <div class="gift-actions">
            <button class="btn secondary" data-action="reserve" data-id="${g.id}" ${disabled ? 'disabled' : ''}>${t('card.gift.reserve')}</button>
            <button class="btn" data-action="send" data-id="${g.id}">${t('card.gift.send')}</button>
          </div>
        </div>`;
      container.appendChild(card);
    });

    container.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => handleAction(btn.dataset.id, btn.dataset.action));
    });
  }

  async function handleAction(giftId, action) {
    const donorName = prompt(t('card.prompt.name')) || 'Аноним';
    const newStatus = action === 'send' ? 'sent' : 'reserved';

    if (isDemoMode()) {
      const data = loadDemo();
      const user = data.users[userId];
      if (!user) return toast(t('card.toast.notFound'));
      const gift = user.gifts.find(g => g.id === giftId);
      if (gift) { gift.status = newStatus; gift.donor = donorName; }
      if (newStatus === 'sent') user.sentCount = (user.sentCount || 0) + 1;
      saveDemo(data);
      renderGifts(user.gifts);
      toast(t('card.toast.updated'));
      return;
    }

    const giftRef = db.collection('users').doc(userId).collection('gifts').doc(giftId);
    await giftRef.update({ status: newStatus, donor: donorName });
    await recalcSentCount();
    toast(t('card.toast.statusUpdated'));
  }

  async function recalcSentCount() {
    if (isDemoMode()) return;
    const snap = await db.collection('users').doc(userId).collection('gifts').where('status', '==', 'sent').get();
    const count = snap.size;
    await db.collection('users').doc(userId).update({ sentCount: count });
  }

  function listenFirebase() {
    const userRef = db.collection('users').doc(userId);
    userRef.onSnapshot((doc) => {
      if (!doc.exists) {
        toast(t('card.toast.notFound'));
        return;
      }
      renderProfile({ id: doc.id, ...doc.data() });
    });
    userRef.collection('gifts').orderBy('addedAt', 'desc').onSnapshot((snap) => {
      const gifts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderGifts(gifts);
    });
  }

  function loadDemoUser() {
    seedDemoIfEmpty();
    const data = loadDemo();
    const user = data.users[userId];
    if (!user) { toast(t('card.toast.notFound')); return; }
    renderProfile(user);
    renderGifts(user.gifts || []);
  }

  function setupShare() {
    const copyBtn = document.getElementById('copyLink');
    const shareBtn = document.getElementById('shareBtn');
    const linkInput = document.getElementById('shareLink');
    const copy = () => {
      navigator.clipboard.writeText(linkInput.value).then(() => toast(t('toast.linkCopied')));
    };
    copyBtn && copyBtn.addEventListener('click', copy);
    shareBtn && shareBtn.addEventListener('click', copy);
  }

  function setupCardPage() {
    userId = getId();
    db = initFirebase().db;
    setupShare();
    if (!userId) { toast(t('card.toast.noId')); return; }
    if (isDemoMode()) loadDemoUser(); else listenFirebase();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'card') setupCardPage();
  });
})();

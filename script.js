/* ===== NAVBAR: scroll shadow + active link ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);

  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ===== TYPING ANIMATION ===== */
const phrases = [
  'Computer Engineering Student',
  'Full-Stack Developer',
  'Network Engineer',
  'CCNA & SRWE Certified',
];

const titleEl = document.querySelector('.hero-title');
if (titleEl) {
  titleEl.innerHTML = '<span id="typed-text"></span><span class="cursor"></span>';
  const typedEl = document.getElementById('typed-text');

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  setTimeout(type, 800);
}

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement
        ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
        : [];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ===== CONTACT FORM — handled by EmailJS in index.html ===== */

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.offsetTop - (navbar ? navbar.offsetHeight : 0);
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ===== CERTIFICATES & MEDIA — ADMIN PROTECTED ===== */
const ADMIN_PASSWORD = 'Haymanot2026'; // change this to your own password
let mediaCounter = 10;

function adminLogin() {
  const input = document.getElementById('adminPass');
  const error = document.getElementById('adminError');
  if (input.value === ADMIN_PASSWORD) {
    document.body.classList.add('admin-mode');
    document.getElementById('adminLocked').style.display = 'none';
    document.getElementById('adminUnlocked').style.display = 'flex';
    error.textContent = '';
    input.value = '';
  } else {
    error.textContent = '❌ Wrong password';
    input.value = '';
    setTimeout(() => { error.textContent = ''; }, 2500);
  }
}

function adminLogout() {
  document.body.classList.remove('admin-mode');
  document.getElementById('adminLocked').style.display = 'flex';
  document.getElementById('adminUnlocked').style.display = 'none';
}

/* Clean up ugly auto-generated file names */
function cleanFileName(raw) {
  return raw
    .replace(/\.[^/.]+$/, '')            // remove extension
    .replace(/_page-\d+$/i, '')           // remove _page-0001 suffix
    .replace(/[_-][a-f0-9]{8,}.*$/i, '') // remove long hashes
    .replace(/[_-]/g, ' ')               // underscores/hyphens → spaces
    .replace(/\s+/g, ' ')                // collapse spaces
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase()); // Title Case
}

/* Caption: click to expand (public) or edit (admin) */
function editCaption(el) {
  if (!document.body.classList.contains('admin-mode')) {
    // Public: toggle expand/collapse
    el.classList.toggle('expanded');
    return;
  }
  // Admin: make it editable inline
  el.contentEditable = 'true';
  el.classList.add('expanded');
  el.focus();
  // Place cursor at end
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  el.addEventListener('blur', () => {
    el.contentEditable = 'false';
  }, { once: true });
}

/* Add certificate image or video */
function addMedia(input, type) {
  const grid = document.getElementById('mediaGrid');
  const files = Array.from(input.files);

  files.forEach(file => {
    const id = 'media-' + mediaCounter++;
    const url = URL.createObjectURL(file);
    const name = cleanFileName(file.name);
    const defaultCaption = type === 'image'
      ? 'Click to add a description for this certificate...'
      : 'Click to add a description for this video...';

    const card = document.createElement('div');
    card.className = 'media-card';
    card.id = id;

    if (type === 'image') {
      card.innerHTML = `
        <div class="media-thumb">
          <img src="${url}" alt="${name}" />
        </div>
        <div class="media-info">
          <span class="media-label cert-label">🏅 Certificate</span>
          <p class="media-title">${name}</p>
          <p class="media-caption" onclick="editCaption(this)">${defaultCaption}</p>
        </div>
        <button class="media-delete-btn admin-only" onclick="deleteMedia('${id}')" title="Delete">✕</button>`;
    } else {
      card.innerHTML = `
        <div class="media-thumb">
          <video src="${url}" controls></video>
        </div>
        <div class="media-info">
          <span class="media-label video-label">🎬 Video</span>
          <p class="media-title">${name}</p>
          <p class="media-caption" onclick="editCaption(this)">${defaultCaption}</p>
        </div>
        <button class="media-delete-btn admin-only" onclick="deleteMedia('${id}')" title="Delete">✕</button>`;
    }

    grid.appendChild(card);
    requestAnimationFrame(() => card.classList.add('visible'));
  });

  input.value = '';
}

/* Delete a media card (admin only) */
function deleteMedia(id) {
  if (!document.body.classList.contains('admin-mode')) return;
  const card = document.getElementById(id);
  if (card) {
    card.style.transform = 'scale(0.8)';
    card.style.opacity = '0';
    card.style.transition = 'all 0.3s ease';
    setTimeout(() => card.remove(), 300);
  }
}

const header = document.querySelector('.site-header');
const publicationList = document.querySelector('#publication-list');
const bibtexDialog = document.querySelector('#bibtex-dialog');
const bibtexCode = document.querySelector('#bibtex-code');
const bibtexTitle = document.querySelector('#bibtex-dialog-title');
const copyBibtexButton = document.querySelector('.copy-bibtex');

document.querySelector('#year').textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 40);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderMedia(media, title) {
  const fit = media?.fit === 'contain' ? 'media-contain' : 'media-cover';
  const background = media?.background === 'dark' ? 'media-dark' : 'media-light';
  const ratio = media?.ratio === '16/9' ? 'media-native' : '';
  const position = escapeHtml(media?.position || 'center');
  const classes = `publication-media ${fit} ${background} ${ratio}`.trim();

  if (!media || media.type === 'placeholder' || !media.src) {
    return `<div class="${classes} placeholder" aria-label="Media placeholder for ${escapeHtml(title)}"></div>`;
  }
  if (media.type === 'video') {
    const poster = escapeHtml(media.poster || '');
    const webm = media.webm ? `<source src="${escapeHtml(media.webm)}" type="video/webm">` : '';
    const video = `<video muted loop playsinline preload="metadata" poster="${poster}" aria-label="${escapeHtml(media.alt || title)}" style="object-position:${position}">${webm}<source src="${escapeHtml(media.src)}" type="video/mp4"></video>`;
    const framed = ratio ? `<div class="media-frame">${video}${renderOverlay(media.overlay)}</div>` : `${video}${renderOverlay(media.overlay)}`;
    return `<div class="${classes}">${framed}</div>`;
  }
  return `<div class="${classes}"><img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt || title)}" loading="lazy" style="object-position:${position}"></div>`;
}

function renderOverlay(overlay) {
  if (overlay !== 'tacgb') return '';
  return `<div class="media-overlay" aria-hidden="true"><p class="overlay-title"><span class="overlay-brand"><span class="tac">Tac</span><span class="g">G</span>oose<span class="b">B</span>umps:</span><span class="overlay-rest">Hacking Tactile Sensors to Feel Friction</span></p><p class="overlay-subtitle">For Learning Contact-Rich Manipulation</p></div>`;
}

function renderAuthors(authors, self) {
  return authors.map(name => name === self
    ? `<span class="self">${escapeHtml(name)}</span>`
    : escapeHtml(name)).join(', ');
}

function renderBadges(badges = []) {
  if (!badges.length) return '';
  return `<div class="publication-badges" aria-label="Publication distinctions">${badges.map(badge => {
    const content = `<span class="badge-icon" aria-hidden="true">✦</span>${escapeHtml(badge.label)}`;
    return badge.url
      ? `<a class="publication-badge" href="${escapeHtml(badge.url)}" target="_blank" rel="noreferrer" title="${escapeHtml(badge.title || badge.label)}">${content}</a>`
      : `<span class="publication-badge forthcoming" title="${escapeHtml(badge.title || badge.label)}">${content}</span>`;
  }).join('')}</div>`;
}

function renderPublications() {
  const publications = window.PUBLICATIONS || [];
  publicationList.innerHTML = publications.map((pub, index) => `
    <article class="publication-card ${pub.highlighted ? 'highlighted' : ''}">
      ${renderMedia(pub.media, pub.title)}
      <div class="publication-body">
        <div class="publication-meta"><span>${escapeHtml(pub.year)}</span><span>—</span><span>${escapeHtml(pub.venue)}</span></div>
        <h3 class="publication-title">${escapeHtml(pub.title)}</h3>
        <p class="publication-authors">${renderAuthors(pub.authors, pub.self)}</p>
        ${renderBadges(pub.badges)}
        <p class="publication-summary">${escapeHtml(pub.summary)}</p>
        <div class="publication-links">
          ${(pub.links || []).map(link => `<a href="${escapeHtml(link.url)}" ${link.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}>${escapeHtml(link.label)}</a>`).join('')}
          ${pub.bibtex ? `<button class="bibtex-button" type="button" data-publication-index="${index}">BibTeX</button>` : ''}
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.publication-media video').forEach(video => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }

        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // If autoplay is blocked, the poster stays visible.
            video.pause();
          });
        }
      });
    }, { threshold: .35 });
    observer.observe(video);
  });

  document.querySelectorAll('.bibtex-button').forEach(button => {
    button.addEventListener('click', () => {
      const publication = publications[Number(button.dataset.publicationIndex)];
      bibtexTitle.textContent = publication.title;
      bibtexCode.textContent = publication.bibtex;
      copyBibtexButton.textContent = 'Copy BibTeX';
      bibtexDialog.showModal();
    });
  });
}

document.querySelector('.dialog-close').addEventListener('click', () => bibtexDialog.close());
bibtexDialog.addEventListener('click', event => {
  if (event.target === bibtexDialog) bibtexDialog.close();
});
copyBibtexButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(bibtexCode.textContent);
    copyBibtexButton.textContent = 'Copied';
  } catch {
    copyBibtexButton.textContent = 'Select and copy above';
  }
});

const dataScript = document.createElement('script');
dataScript.src = 'data/publications.js';
dataScript.onload = renderPublications;
document.head.appendChild(dataScript);

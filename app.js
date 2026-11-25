import './shared/styles.css';
import { FORMSPREE_ENDPOINT } from './config.js';
import { themeAt, loadReviews, saveSystemInfo, storageEntries, submitContact, FORM_DELAY, alreadyShown, markShown } from './shared/core.js';
const $ = id => document.getElementById(id);
let manualTheme = false;
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('theme-toggle').textContent = theme === 'light' ? 'Нічна тема' : 'Денна тема';
  $('theme-auto').setAttribute('aria-pressed', String(!manualTheme));
}
applyTheme(themeAt());
$('theme-toggle').addEventListener('click', () => {
  manualTheme = true;
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
});
$('theme-auto').addEventListener('click', () => { manualTheme = false; applyTheme(themeAt()); });
const themeTimer = setInterval(() => { if (!manualTheme) applyTheme(themeAt()); }, 1000);
function renderStorage() {
  const container = $('storage-content'); container.replaceChildren();
  try {
    for (const {key, value} of storageEntries()) {
      const title = document.createElement('strong'); title.textContent = key;
      const text = document.createElement('pre'); text.textContent = value;
      container.append(title, text);
    }
  } catch { container.textContent = 'Доступ до localStorage заборонено налаштуваннями браузера.'; }
}
try { saveSystemInfo(); } catch { /* показуємо пояснення у футері */ }
renderStorage();
window.addEventListener('storage', renderStorage);
let reviewsController;
async function renderReviews() {
  reviewsController?.abort(); reviewsController = new AbortController();
  $('reviews-retry').hidden = true;
  $('reviews-list').textContent = 'Завантаження відгуків…';
  try {
    const reviews = await loadReviews(reviewsController.signal);
    $('reviews-list').replaceChildren();
    if (!reviews.length) $('reviews-list').textContent = 'Відгуків поки немає.';
    for (const review of reviews) {
      const article = document.createElement('article'); article.className = 'review';
      const number = document.createElement('span'); number.className = 'review-number'; number.textContent = `#${review.id}`;
      const name = document.createElement('h3'); name.textContent = review.name;
      const email = document.createElement('span'); email.textContent = review.email;
      const body = document.createElement('p'); body.textContent = review.body;
      article.append(number, name, email, body); $('reviews-list').append(article);
    }
  } catch (error) {
    if (error.name === 'AbortError') return;
    $('reviews-list').textContent = `Не вдалося завантажити відгуки. ${error.message}`;
    $('reviews-retry').hidden = false;
  }
}
$('reviews-retry').addEventListener('click', renderReviews);
renderReviews();
const dialog = $('contact-modal');
let contactTimer;
function openContact() { clearTimeout(contactTimer); markShown(); if (!dialog.open) dialog.showModal(); }
$('contact-open').addEventListener('click', openContact);
$('contact-second').addEventListener('click', openContact);
$('contact-close').addEventListener('click', () => dialog.close());
if (!alreadyShown()) contactTimer = setTimeout(openContact, FORM_DELAY);
const form = $('contact-form'); form.action = FORMSPREE_ENDPOINT;
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('[type=submit]');
  button.disabled = true; $('form-status').classList.remove('error'); $('form-status').textContent = 'Надсилання…';
  try {
    await submitContact(FORMSPREE_ENDPOINT, new FormData(form));
    $('form-status').textContent = 'Повідомлення успішно надіслано.'; form.reset();
  } catch (error) { $('form-status').textContent = error.message; $('form-status').classList.add('error'); }
  finally { button.disabled = false; }
});
window.addEventListener('pagehide', () => { clearTimeout(contactTimer); clearInterval(themeTimer); reviewsController?.abort(); });
// При поверненні з back-forward cache заново ініціалізуємо таймери.
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });

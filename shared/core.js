export const FORM_DELAY = 60000;
export const SESSION_KEY = 'lab4.contactShown';
export const REVIEWS_URL = 'https://jsonplaceholder.typicode.com/posts/13/comments';
export function themeAt(date = new Date()) {
  const hour = date.getHours();
  return hour >= 7 && hour < 21 ? 'light' : 'dark';
}
export async function loadReviews(signal, fetcher = fetch) {
  const response = await fetcher(REVIEWS_URL, { signal });
  if (!response.ok) throw new Error(`Помилка сервера: HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Сервер повернув некоректні дані.');
  return data; // Зберігаємо початкову послідовність сервера.
}
export function saveSystemInfo(nav = navigator, display = screen, store = localStorage) {
  // Лише дані, доступні браузеру без запиту дозволів.
  const info = {
    userAgent: nav.userAgent, platform: nav.platform, vendor: nav.vendor,
    language: nav.language, languages: Array.from(nav.languages || []),
    cookieEnabled: nav.cookieEnabled, onLine: nav.onLine,
    hardwareConcurrency: nav.hardwareConcurrency, deviceMemory: nav.deviceMemory,
    maxTouchPoints: nav.maxTouchPoints, doNotTrack: nav.doNotTrack,
    screen: { width: display.width, height: display.height, colorDepth: display.colorDepth, pixelDepth: display.pixelDepth },
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgentData: nav.userAgentData?.toJSON?.(),
  };
  store.setItem('lab4.system', JSON.stringify(info));
  return info;
}
export function storageEntries(store = localStorage) {
  return Array.from({length: store.length}, (_, i) => {
    const key = store.key(i); const value = store.getItem(key);
    let formatted = value;
    try { formatted = JSON.stringify(JSON.parse(value), null, 2); } catch { /* звичайний рядок */ }
    return {key, value:formatted};
  });
}
export function alreadyShown() {
  try { return sessionStorage.getItem(SESSION_KEY) === 'true'; } catch { return false; }
}
export function markShown() {
  try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch { /* таймер усе одно одноразовий */ }
}
export async function submitContact(endpoint, data, fetcher = fetch) {
  if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
    throw new Error('Потрібно налаштувати адресу форми Formspree у config.js.');
  }
  const response = await fetcher(endpoint, {
    method: 'POST', body: data, headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Не вдалося надіслати повідомлення (HTTP ${response.status}). Спробуйте ще раз.`);
  return true;
}

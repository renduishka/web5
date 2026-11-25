import { useEffect, useState } from 'react';
import { saveSystemInfo, storageEntries } from '../../shared/core.js';
export default function Footer() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const read = () => {
      try { setEntries(storageEntries()); }
      catch { setError('Доступ до localStorage заборонено налаштуваннями браузера.'); }
    };
    try { saveSystemInfo(); } catch { setError('Не вдалося зберегти системні дані у localStorage.'); }
    read(); window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, []);
  return <footer><h2>Інформація браузера</h2><p>Доступні відомості про систему збережено у localStorage. Браузер може обмежувати точність цих даних.</p><details><summary>Переглянути вміст localStorage</summary>{error ? <p>{error}</p> : entries.map(({key,value}) => <div key={key}><strong>{key}</strong><pre>{value}</pre></div>)}</details><p className="footer-credit">Лозинський Р. Р. · КБ-202 · Лабораторна №4 · Варіант 13 · React</p></footer>;
}

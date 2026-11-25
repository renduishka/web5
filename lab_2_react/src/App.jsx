import { useEffect, useState } from 'react';
import { themeAt } from '../../shared/core.js';
import Reviews from './Reviews.jsx';
import Footer from './Footer.jsx';
import ContactForm from './ContactForm.jsx';
export default function App() {
  const [theme, setTheme] = useState(() => themeAt());
  const [automatic, setAutomatic] = useState(true);
  const [contactRequest, setContactRequest] = useState(0);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    if (!automatic) return;
    const update = () => setTheme(themeAt()); update();
    const id = setInterval(update, 1000); return () => clearInterval(id);
  }, [automatic]);
  const openContact = () => setContactRequest(value => value + 1);
  return <>
    <header><a href="#" className="wordmark">Лозинський Р. Р.</a><nav aria-label="Основна навігація"><a href="#about">Про мене</a><a href="#reviews">Відгуки</a><a href="../">JS-версія</a><button className="btn" type="button" onClick={() => {setAutomatic(false);setTheme(theme === 'light' ? 'dark' : 'light');}}>{theme === 'light' ? 'Нічна тема' : 'Денна тема'}</button><button className="btn" type="button" aria-pressed={automatic} onClick={() => setAutomatic(true)}>Авто</button></nav></header>
    <main><section><h1>Лозинський Р. Р.</h1><p className="hero-copy">Студент КБ-202. Вивчаю вебпрограмування та створюю інтерактивні вебсторінки.</p><div className="hero-actions"><button className="btn btn-primary" type="button" onClick={openContact}>Зв’язатися зі мною ↗</button><a href="#reviews">Переглянути відгуки</a></div></section>
    <section id="about"><h2>Про мене</h2><div className="about-grid"><dl><dt>Університет</dt><dd>Львівська політехніка</dd><dt>Напрям</dt><dd>Кібербезпека</dd></dl><div><p>Це навчальне резюме, створене в межах курсу «Технології вебпрограмування».</p><p>Практикую HTML, CSS та JavaScript. У цій роботі додаю отримання даних із сервера, збереження інформації у браузері та обробку подій.</p></div></div></section>
    <Reviews /><section><h2>Будьмо на зв’язку</h2><p>Маєте запитання або пропозицію? Залиште повідомлення у формі зворотного зв’язку.</p><button className="btn" type="button" onClick={openContact}>Відкрити форму ↗</button></section></main>
    <Footer /><ContactForm request={contactRequest}/>
  </>;
}

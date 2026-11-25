import { useEffect, useRef, useState } from 'react';
import { FORMSPREE_ENDPOINT } from '../../config.js';
import { FORM_DELAY, alreadyShown, markShown, submitContact } from '../../shared/core.js';
export default function ContactForm({request}) {
  const [isOpen, setIsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [failed, setFailed] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    if (alreadyShown()) return;
    const timer = setTimeout(() => { if (!alreadyShown()) { markShown(); setIsOpen(true); } }, FORM_DELAY);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { if (request > 0) {markShown();setIsOpen(true);} }, [request]);
  useEffect(() => {
    if (isOpen) {
      markShown(); if (!dialog.current.open) dialog.current.showModal();
    } else if (dialog.current.open) dialog.current.close();
  }, [isOpen]);
  async function send(event) {
    event.preventDefault(); const form = event.currentTarget;
    setBusy(true); setFailed(false); setStatus('Надсилання…');
    try {
      await submitContact(FORMSPREE_ENDPOINT, new FormData(form));
      setStatus('Повідомлення успішно надіслано.'); form.reset();
    } catch (error) { setFailed(true); setStatus(error.message); }
    finally { setBusy(false); }
  }
  return <dialog className="modal" ref={dialog} aria-labelledby="contact-title" onClose={() => setIsOpen(false)}><div className="modal-box"><h2 id="contact-title">Напишіть мені</h2><p>Повідомлення буде надіслано через Formspree.</p><form action={FORMSPREE_ENDPOINT} method="POST" onSubmit={send}><div className="form-fields"><label>Ім’я<input className="input" name="name" autoComplete="name" required maxLength={100}/></label><label>Email<input className="input" name="email" type="email" autoComplete="email" required/></label><label>Номер телефону<input className="input" name="phone" type="tel" autoComplete="tel" required pattern="[+0-9 \(\)\.\-]{7,25}" title="Від 7 до 25 символів: цифри, пробіли, +, -, дужки або крапка"/></label><label>Повідомлення<textarea className="textarea" name="message" required maxLength={5000}/></label></div><div className="modal-action"><button className="btn" type="button" onClick={() => setIsOpen(false)}>Закрити</button><button className="btn" type="submit" disabled={busy}>Надіслати</button></div><p className={`form-feedback ${failed ? 'error' : ''}`} role="status">{status}</p></form></div><form method="dialog" className="modal-backdrop"><button aria-label="Закрити форму">Закрити</button></form></dialog>;
}

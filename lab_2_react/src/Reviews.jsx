import { useEffect, useState } from 'react';
import { loadReviews } from '../../shared/core.js';
export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    loadReviews(controller.signal).then(setReviews).catch(error => {
      if (error.name !== 'AbortError') setError(error.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  return <section id="reviews"><h2>Відгуки роботодавців</h2><p className="section-note">Навчальні коментарі JSONPlaceholder для варіанта 13. Дані вигадані та не описують реальний досвід роботи.</p><div aria-live="polite">{loading ? <p>Завантаження відгуків…</p> : error ? <><p>Не вдалося завантажити відгуки. {error}</p><button className="btn" type="button" onClick={() => setAttempt(value => value + 1)}>Спробувати ще раз</button></> : reviews.length ? reviews.map(review => <article className="review" key={review.id}><span className="review-number">#{review.id}</span><h3>{review.name}</h3><span>{review.email}</span><p>{review.body}</p></article>) : <p>Відгуків поки немає.</p>}</div></section>;
}

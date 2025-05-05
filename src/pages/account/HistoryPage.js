import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      // Если токена нет — перенаправляем на логин
      return navigate('/login', { replace: true });
    }

    axios.get('http://localhost:8000/api/accounts/history/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setHistory(res.data);
    })
    .catch(err => {
      console.error('Ошибка при загрузке истории:', err);
      // Если токен просрочен или неверен — редирект на логин
      if (err.response && err.response.status === 401) {
        navigate('/login', { replace: true });
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <p>Загрузка истории…</p>;
  if (history.length === 0) return <p>Ваша история просмотров пуста.</p>;

  return (
    <div>
      {history.map(entry => (
        <div key={entry.id} className="card mb-3">
          <div className="row g-0">
            {entry.post.cover && (
              <div className="col-md-4">
                <img
                  src={entry.post.cover}
                  className="img-fluid rounded-start"
                  alt="Обложка"
                />
              </div>
            )}
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/post/${entry.post.id}`}>
                    {entry.post.title}
                  </Link>
                </h5>
                <p className="card-text text-truncate">
                  {entry.post.content}
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    Провёл(а) {entry.seconds_spent} сек ({new Date(entry.timestamp).toLocaleString()})
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

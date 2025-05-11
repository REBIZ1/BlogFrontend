// src/pages/FavoritesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    axios.get('http://localhost:8000/api/accounts/favorites/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // res.data — массив записей вида { id, post: { … } }
      setPosts(res.data.map(entry => entry.post));
    })
    .catch(err => {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    })
    .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          <h1 className="mb-4">Избранное</h1>

          {loading ? (
            <p>Загрузка избранных постов...</p>
          ) : posts.length === 0 ? (
            <p>Ваш список избранного пуст.</p>
          ) : (
            <div className="row g-4">
              {posts.map(post => (
                <div key={post.id} className="col-md-6 col-lg-3">
                  <div className="card h-100 shadow-sm">
                    <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                      {post.cover && (
                        <img
                          src={post.cover}
                          className="card-img-top"
                          alt="Обложка"
                          style={{ objectFit: 'cover', height: '180px' }}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text flex-grow-1 text-truncate">
                          {post.content.replace(/<[^>]+>/g, '').slice(0, 100)}…
                        </p>
                        <div className="mt-auto d-flex justify-content-between">
                          <small className="text-muted">👁 {post.views}</small>
                          <small className="text-muted">❤️ {post.likes_count}</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

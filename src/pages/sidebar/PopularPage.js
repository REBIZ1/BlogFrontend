// src/pages/sidebar/PopularPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function PopularPage() {
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [period, setPeriod]     = useState('all'); // all|week|month|year

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/posts/popular/', {
      params: { period }
    })
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <>
      <Header />

      <div className="d-flex">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          {/* Заголовок + селектор периода */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="m-0">Популярные посты</h1>
            <select
              className="form-select form-select-sm w-auto"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              <option value="all">За все время</option>
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
              <option value="year">За год</option>
            </select>
          </div>

          {loading ? (
            <p>Загрузка...</p>
          ) : posts.length === 0 ? (
            <p>Постов не найдено.</p>
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
                          style={{ objectFit: "cover", height: "180px" }}
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

// src/pages/NewPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function NewPage() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/posts/ возвращает по умолчанию сортировку по -created_at
    axios.get('http://localhost:8000/api/posts/')
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      <div className="d-flex">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          <h1 className="mb-4">Новые посты</h1>

          {loading ? (
            <p>Загрузка...</p>
          ) : posts.length === 0 ? (
            <p>Постов пока нет.</p>
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

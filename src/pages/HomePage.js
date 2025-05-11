// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const location = useLocation(); // для чтения ?tag=…&tag=… из URL

  useEffect(() => {
    const url = location.search
      ? `http://localhost:8000/api/posts/${location.search}`
      : 'http://localhost:8000/api/posts/';
    axios.get(url)
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, [location.search]);

  return (
    <>
      <Header />

      <div className="d-flex">
        {/* Сайдбар с мульти‑фильтром */}
        <Sidebar />

        {/* Основной контент */}
        <main className="flex-grow-1 p-4">
          <h1 className="mb-4">Список постов</h1>

          <div className="row g-4">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="col-md-6 col-lg-3">
                  <div className="card h-100 shadow-sm d-flex flex-column">
                    {/* Обёртка link только вокруг контента, без footer */}
                    <Link to={`/post/${post.id}`} className="text-decoration-none text-dark flex-grow-1 d-flex flex-column">
                      {post.cover && (
                        <img
                          src={post.cover}
                          className="card-img-top"
                          alt="Обложка"
                          style={{ objectFit: "cover", height: "180px" }}
                        />
                      )}
                      <div className="card-body d-flex flex-column flex-grow-1">
                        {/* Автор */}
                        <div className="d-flex align-items-center mb-2">
                          {post.author_avatar && (
                            <img
                              src={post.author_avatar}
                              alt={post.author_username}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginRight: 8
                              }}
                            />
                          )}
                          <strong>{post.author_username}</strong>
                        </div>
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text flex-grow-1 text-truncate">
                          {post.content.replace(/<[^>]+>/g, '').slice(0, 100)}…
                        </p>
                      </div>
                    </Link>

                    {/* Здесь footer — он всегда внизу карточки */}
                    <div className="card-footer bg-white border-0 d-flex justify-content-between">
                      <small className="text-muted">👁 {post.views}</small>
                      <small className="text-muted">❤️ {post.likes_count}</small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Постов пока нет.</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

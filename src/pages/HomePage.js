// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags]   = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag') || '';

  useEffect(() => {
    axios.get('http://localhost:8000/api/tags/')
      .then(res => setTags(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const url = selectedTag
      ? `http://localhost:8000/api/posts/?tag=${selectedTag}`
      : 'http://localhost:8000/api/posts/';
    axios.get(url)
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, [selectedTag]);

  return (
    <>
      <Header />

      <div className="d-flex">
        {/* Сайдбар слева */}
        <Sidebar />

        {/* Основной контент */}
        <main className="flex-grow-1 p-4">
          <h1 className="mb-4">Список постов</h1>

          {/* Фильтр по тегам */}
          <div className="mb-4 d-flex flex-wrap gap-2">
            <button
              className={`btn btn-sm ${selectedTag === '' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSearchParams({})}
            >
              Все
            </button>
            {tags.map(tag => (
              <button
                key={tag.slug}
                className={`btn btn-sm ${selectedTag === tag.slug ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSearchParams({ tag: tag.slug })}
              >
                #{tag.name}
              </button>
            ))}
          </div>

          {/* Сетка карточек */}
          <div className="row g-4">
            {posts.length > 0 ? (
              posts.map(post => (
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

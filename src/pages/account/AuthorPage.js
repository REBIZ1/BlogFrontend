// src/pages/AuthorPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link }       from 'react-router-dom';
import axios                     from 'axios';
import Header                    from '../../components/Header';
import Sidebar                   from '../../components/Sidebar';

export default function AuthorPage() {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts]   = useState([]);

  useEffect(() => {
    // загрузить профиль автора
    axios.get(`http://localhost:8000/api/users/${username}/`)
      .then(res => setAuthor(res.data))
      .catch(console.error);

    // загрузить его посты
    axios.get(`http://localhost:8000/api/posts/?author=${username}`)
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, [username]);

  if (!author) {
    return (
      <>
        <Header />
        <div className="d-flex">
          <Sidebar />
          <main className="flex-grow-1 p-4">
            <p>Загрузка профиля…</p>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          {/* Заголовок страницы */}
          <h1 className="mb-4">Профиль автора</h1>

          {/* Блок с аватаром, именем и кнопкой */}
          <div className="d-flex align-items-center mb-5 position-relative">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.username}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: 16
                }}
              />
            )}
            <div>
              <h2 className="mb-1">{author.username}</h2>
            </div>
            <button
              className="btn btn-outline-primary btn-sm ms-auto"
              onClick={() => alert(`Подписаться на ${author.username}`)}
            >
              Подписаться
            </button>
          </div>

          {/* Сетка карточек постов автора */}
          <div className="row g-4">
            {posts.length > 0 ? posts.map(post => (
              <div key={post.id} className="col-md-6 col-lg-3">
                <div className="card post-card h-100 shadow-sm position-relative">
                  <Link
                    to={`/post/${post.id}`}
                    className="text-decoration-none text-dark d-flex flex-column h-100"
                  >
                    {/* обложка */}
                    {post.cover && (
                      <div className="post-card__cover-wrapper">
                        <img
                          src={post.cover}
                          alt="Обложка"
                          className="card-img-top post-card__cover"
                        />
                      </div>
                    )}

                    <div className="card-body d-flex flex-column flex-grow-1">
                      {/* заголовок */}
                      <h5 className="card-title">{post.title}</h5>
                      {/* аннотация */}
                      <p className="card-text flex-grow-1 text-truncate">
                        {post.content.replace(/<[^>]+>/g, '').slice(0, 100)}…
                      </p>
                    </div>

                    <div className="card-footer bg-white border-0 d-flex justify-content-between">
                      <small className="text-muted">👁 {post.views}</small>
                      <small className="text-muted">❤️ {post.likes_count}</small>
                    </div>
                  </Link>
                </div>
              </div>
            )) : (
              <p>У автора пока нет постов.</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="col-md-6 col-lg-3">
      <div className="card post-card h-100 shadow-sm position-relative">
        <Link
          to={`/post/${post.id}`}
          className="text-decoration-none text-dark d-flex flex-column h-100"
        >
          {/* Обложка */}
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
            {/* Автор и кнопка «Подписаться» */}
            <div className="d-flex align-items-center mb-2 position-relative">
              {post.author_avatar && (
                <Link to={`/author/${post.author_username}`}>
                  <img
                    src={post.author_avatar}
                    alt={post.author_username}
                    className="rounded-circle post-card__avatar"
                  />
                </Link>
              )}
              <Link
                to={`/author/${post.author_username}`}
                className="text-dark text-decoration-none me-auto"
              >
                <strong>{post.author_username}</strong>
              </Link>
              <button className="btn btn-sm btn-primary post-card__sub-btn">
                Подписаться
              </button>
            </div>

            {/* Заголовок */}
            <h5 className="card-title">{post.title}</h5>

            {/* Анотация */}
            <p className="card-text flex-grow-1 text-truncate">
              {post.content.replace(/<[^>]+>/g, '').slice(0, 100)}…
            </p>

            {/* Лайки и просмотры */}
            <div className="mt-auto d-flex justify-content-between">
              <small className="text-muted">👁 {post.views}</small>
              <small className="text-muted">❤️ {post.likes_count}</small>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

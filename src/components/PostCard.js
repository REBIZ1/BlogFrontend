// src/components/PostCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

export default function PostCard({
  post,
  isFollowed,
  onToggleFollow,
  noWrapper = false,
  isLoading = false  // новый пропс
}) {
  // 1) skeleton view
  if (isLoading) {
    const card = (
      <div className="card post-card h-100 shadow-sm position-relative">
        <div className="skeleton post-card__cover-wrapper" style={{ height: 160 }} />
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center mb-2">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <div className="skeleton ms-2" style={{ width: '40%', height: 16 }} />
          </div>
          <div className="skeleton mb-2" style={{ width: '80%', height: 20 }} />
          <div className="skeleton mb-auto" style={{ width: '100%', height: 12, marginBottom: 16 }} />
          <div className="d-flex justify-content-between">
            <div className="skeleton" style={{ width: '20%', height: 12 }} />
            <div className="skeleton" style={{ width: '20%', height: 12 }} />
          </div>
        </div>
      </div>
    );
    return noWrapper ? card : <div className="col-md-6 col-lg-3">{card}</div>;
  }

  // 2) обычный рендер
  const card = (
    <div className="card post-card h-100 shadow-sm position-relative">
      <Link
        to={`/post/${post.id}`}
        className="text-decoration-none text-dark d-flex flex-column h-100"
      >
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
          <div className="d-flex align-items-center mb-2 position-relative">
            {post.author_avatar && (
              <img
                src={post.author_avatar}
                alt={post.author_username}
                className="rounded-circle post-card__avatar"
              />
            )}
            <div
              to={`/author/${post.author_username}`}
              className="text-dark text-decoration-none me-auto"
            >
              <strong>{post.author_username}</strong>
            </div>
            <FollowButton
              authorUsername={post.author_username}
              isFollowed={isFollowed}
              onChange={onToggleFollow}
            />
          </div>

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
  );

  return noWrapper ? card : <div className="col-md-6 col-lg-3">{card}</div>;
}

// src/components/FollowButton.js
import React, { useState, useEffect } from 'react';
import { toggleFollow, fetchFollows } from '../api';

export default function FollowButton({
  authorUsername,
  isFollowed: externalIsFollowed,
  onChange
}) {
  const controlled = typeof externalIsFollowed === 'boolean' && typeof onChange === 'function';
  const [localStatus, setLocalStatus] = useState(null);

  useEffect(() => {
    if (controlled) return;
    let mounted = true;
    fetchFollows()
      .then(follows => {
        if (!mounted) return;
        const isF = follows.some(f => f.author_username === authorUsername);
        setLocalStatus(isF ? 'followed' : 'unfollowed');
      })
      .catch(console.error);
    return () => { mounted = false; };
  }, [authorUsername, controlled]);

  const status = controlled
    ? (externalIsFollowed ? 'followed' : 'unfollowed')
    : localStatus;

  if (status === null) return null;

  const handleClick = async e => {
    e.preventDefault();
    try {
      const newStatus = await toggleFollow(authorUsername);
      if (controlled) {
        onChange(newStatus, authorUsername);
      } else {
        setLocalStatus(newStatus);
      }
    } catch {
      alert('Не удалось обновить подписку. Попробуйте позже.');
    }
  };

  return (
    <button
      className="btn btn-sm btn-primary post-card__sub-btn"
      onClick={handleClick}
    >
      {status === 'followed' ? 'Подписаны ✓' : 'Подписаться'}
    </button>
  );
}

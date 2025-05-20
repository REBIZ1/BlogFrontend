// src/pages/sidebar/RecommendationsPage.js
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';
import {
  fetchContentRecommendations,
  fetchCFRecommendations,
  fetchHybridRecommendations,
  fetchFollows
} from '../../api';

export default function RecommendationsPage() {
  // 3 варианта
  const MODES = [
    { key: 'hybrid', label: 'Гибридная' },
    { key: 'cf',     label: 'Коллаборативная' },
    { key: 'content',label: 'Контентная' }
  ];

  const [mode, setMode]     = useState('hybrid');
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedAuthors, setFollowedAuthors] = useState(new Set());

  // для гибрида пока жёстко
  const alpha = 0.6, n = 16;

  useEffect(() => {
    // один раз при монтировании страницы стягиваем подписки
    fetchFollows()
      .then(follows => {
        setFollowedAuthors(new Set(follows.map(f => f.author_username)));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    let fetcher;
    if (mode === 'hybrid') {
      fetcher = () => fetchHybridRecommendations(alpha, n);
    } else if (mode === 'cf') {
      fetcher = () => fetchCFRecommendations();
    } else {
      fetcher = () => fetchContentRecommendations();
    }

    fetcher()
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [mode]);

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          {/* шапка + селектор режима */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            

            <select
              className="form-select form-select-sm w-auto"
              value={mode}
              onChange={e => setMode(e.target.value)}
            >
              {MODES.map(m => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="row g-4">
            {loading ? (
              // пока грузим — показываем 8 скелетонов
              Array.from({ length: 8 }).map((_, i) => (
                <PostCard key={`skeleton-${i}`} isLoading />
              ))
            ) : posts.length > 0 ? (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  isFollowed={followedAuthors.has(post.author_username)}
                  onToggleFollow={(newStatus, username) => {
                    setFollowedAuthors(prev => {
                      const next = new Set(prev);
                      if (newStatus === 'followed') next.add(username);
                      else next.delete(username);
                      return next;
                    });
                  }}
                />
              ))
            ) : (
              <p>Пока нет рекомендаций.</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
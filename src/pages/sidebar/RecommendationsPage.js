// src/pages/sidebar/RecommendationsPage.js
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';
import {
  fetchContentRecommendations,
  fetchCFRecommendations,
  fetchHybridRecommendations
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

  // для гибрида пока жёстко
  const alpha = 0.6, n = 16;

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
            <h1 className="m-0">Рекомендации</h1>

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

          {loading ? (
            <p>Загрузка…</p>
          ) : posts.length > 0 ? (
            <div className="row g-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p>Пока нет рекомендаций.</p>
          )}
        </main>
      </div>
    </>
  );
}

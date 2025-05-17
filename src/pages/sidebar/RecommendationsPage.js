// src/pages/sidebar/RecommendationsPage.js
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';
import { fetchContentRecommendations } from '../../api';

export default function RecommendationsPage() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentRecommendations()
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <h1 className="mb-4">Рекомендации</h1>
          {loading ? (
            <p>Загрузка…</p>
          ) : posts.length > 0 ? (
            <div className="row g-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p>Пока нет рекомендаций. Поставьте лайк или добавьте в избранное несколько статей, чтобы мы могли лучше вас понять.</p>
          )}
        </main>
      </div>
    </>
  );
}

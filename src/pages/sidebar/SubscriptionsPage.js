// src/pages/sidebar/SubscriptionsPage.js
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';
import { fetchSubscriptionsPosts } from '../../api';

export default function SubscriptionsPage() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSubscriptionsPosts()
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
          {loading ? (
            <div className="row g-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PostCard key={`skeleton-${i}`} isLoading />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="row g-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p>Нет новых статей от подписанных авторов.</p>
          )}
        </main>
      </div>
    </>
  );
}

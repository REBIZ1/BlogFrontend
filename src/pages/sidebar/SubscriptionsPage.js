import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';
import { fetchSubscriptionsPosts } from '../../api';

export default function SubscriptionsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          <h1 className="mb-4">Подписки</h1>
          {loading ? (
            <p>Загрузка…</p>
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

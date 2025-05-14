// src/pages/NewPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';

export default function NewPage() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/posts/ возвращает по умолчанию сортировку по -created_at
    axios.get('http://localhost:8000/api/posts/')
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      <div className="d-flex">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          <h1 className="mb-4">Новые посты</h1>

          {loading ? (
            <p>Загрузка...</p>
          ) : posts.length === 0 ? (
            <p>Постов пока нет.</p>
          ) : (
              <div className="row g-4">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
          )}
        </main>
      </div>
    </>
  );
}

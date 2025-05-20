// src/pages/sidebar/PopularPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';

export default function PopularPage() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod]   = useState('all'); // all|week|month|year

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/posts/popular/', {
      params: { period }
    })
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <>
      <Header />

      <div className="d-flex">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          {/* Заголовок + селектор периода */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="m-0">Популярные</h1>
            <select
              className="form-select form-select-sm w-auto"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              <option value="all">За все время</option>
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
              <option value="year">За год</option>
            </select>
          </div>

          {loading ? (
            // Пока грузим, показываем 8 скелетонов-карточек
            <div className="row g-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PostCard key={`skeleton-${i}`} isLoading />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p>Постов не найдено.</p>
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

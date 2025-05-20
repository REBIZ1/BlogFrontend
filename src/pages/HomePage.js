// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // для чтения ?tag=…&tag=… из URL

  useEffect(() => {
    setLoading(true);
    // передаём всю строку параметров, а не только search
    const apiUrl = location.search
      ? `http://localhost:8000/api/posts/${location.search}`
      : 'http://localhost:8000/api/posts/';
    
    axios.get(apiUrl)
      .then(res => setPosts(res.data))
      .catch(err => {
        console.error('Error fetching posts:', err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  
  return (
    <>
      <Header />

      <div className="d-flex">
        {/* Сайдбар с мульти‑фильтром */}
        <Sidebar />

        {/* Основной контент */}
        <main className="flex-grow-1 p-4">
          
          {loading ? (
            // Пока грузятся — показываем, скажем, 8 скелетонов
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
            <p>Постов пока нет.</p>
          )}
        </main>
      </div>
    </>
  );
}

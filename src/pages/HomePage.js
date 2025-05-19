// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const location = useLocation(); // для чтения ?tag=…&tag=… из URL

  useEffect(() => {
    const url = location.search
      ? `http://localhost:8000/api/posts/${location.search}`
      : 'http://localhost:8000/api/posts/';
    axios.get(url)
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, [location.search]);

  return (
    <>
      <Header />

      <div className="d-flex">
        {/* Сайдбар с мульти‑фильтром */}
        <Sidebar />

        {/* Основной контент */}
        <main className="flex-grow-1 p-4">
          

          {posts.length > 0
            ? <div className="row g-4">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            : <p>Постов пока нет.</p>
          }
        </main>
      </div>
    </>
  );
}

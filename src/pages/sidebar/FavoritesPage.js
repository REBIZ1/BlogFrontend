// src/pages/FavoritesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    axios.get('http://localhost:8000/api/accounts/favorites/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // res.data — массив записей вида { id, post: { … } }
      setPosts(res.data.map(entry => entry.post));
    })
    .catch(err => {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    })
    .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar />

        <main className="flex-grow-1 p-4">
          

          {loading ? (
            <p>Загрузка избранных постов...</p>
          ) : posts.length === 0 ? (
            <p>Ваш список избранного пуст.</p>
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

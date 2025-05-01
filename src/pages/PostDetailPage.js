import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [message, setMessage] = useState('');
    

    useEffect(() => {
      // Загрузка поста и статуса лайка
      axios.get(`http://localhost:8000/api/posts/${id}/`)
        .then(res => {
          setPost(res.data);
          setLikesCount(res.data.likes_count);
          setIsLiked(res.data.is_liked)
        })
        .catch(console.error);
    
      // Засечь время чтения + вызвать TrackPostView при уходе
      const start = Date.now();
      const handleUnload = () => {
        const seconds = Math.round((Date.now() - start) / 1000);
        if (seconds < 8) return;
    
        const token = localStorage.getItem('access');
        fetch('http://localhost:8000/api/track/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ post_id: id, seconds })
        });
      };
    
      window.addEventListener('beforeunload', handleUnload);
      return () => {
        handleUnload();
        window.removeEventListener('beforeunload', handleUnload);
      };
    }, [id]);
    
    const toggleLike = () => {
      const token = localStorage.getItem('access');
      if (!token) {
      // если не залогинен — показываем сообщение и редирект
      setMessage('Чтобы поставить лайк нужно войти в аккаунт');
    }
      
      axios.post(`http://localhost:8000/api/posts/${id}/like/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setLikesCount(res.data.likes_count);
        setIsLiked(res.data.status === 'liked');
        setMessage('');  // сбросим сообщение, если было
      })
      .catch(console.error);
    };

    if (!post) return <p>загрузка...</p>;

    return (
        <>
          <Header />
          <div className="container py-5">
            <h1>{post.title}</h1>
            {post.cover && (
              <img
                src={post.cover}
                alt="Обложка поста"
                style={{ width: "100%", maxHeight: "400px", objectFit: "cover", marginBottom: "20px" }}
              />
            )}
            <p>{post.content}</p>

            <div className="d-flex justify-content-between align-items-center">
              <button
                className={`btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={toggleLike}
              >
                {isLiked ? '❤️ ' : '❤️ '} {likesCount}
              </button>
              <p className="text-muted mb-0">👁 Просмотров: {post.views}</p>
            </div>
            {/* Сообщение об ошибке или подсказка */}
            {message && (
              <div className="alert alert-warning my-2">
                {message}&nbsp;
                {!localStorage.getItem('access') && (
                  <a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}>
                    Войти в аккаунт
                  </a>
                )}
              </div>
            )}
          </div>
        </>
      );
    }

export default PostDetailPage;
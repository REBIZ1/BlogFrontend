// src/pages/PostDetailPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import CommentsList from '../components/CommentsList';
import PostCard from '../components/PostCard';
import { toggleFollow, fetchFollows, fetchHybridRecommendations } from '../api';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subStatus, setSubStatus] = useState(null);
  const [post, setPost]             = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked]       = useState(false);
  const [message, setMessage]       = useState('');
  const [recs, setRecs]     = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);
  
  useEffect(() => {
    axios.get(`http://localhost:8000/api/posts/${id}/`)
      .then(res => {
        setPost(res.data);
        setLikesCount(res.data.likes_count);
        setIsLiked(res.data.is_liked);
      })
      .catch(console.error);
      
    const start = Date.now();
    const handleUnload = () => {
      const seconds = Math.round((Date.now() - start) / 1000);
      if (seconds < 8) return;
      const token = localStorage.getItem('access');
      fetch('http://localhost:8000/api/track/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
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

  // 2) Как только post подтянется — проверяем статус подписки
  useEffect(() => {
    if (!post) return;  // ждём, пока post не загрузится
    fetchFollows()
      .then(follows => {
        const isFollow = follows.some(f => f.author_username === post.author_username);
        setSubStatus(isFollow ? 'followed' : 'unfollowed');
      })
      .catch(console.error);

    setRecsLoading(true);
    // например, гибридные рекомендации, можно передать n=3
    const desired = 3;
    // запрашиваем на 1 больше
    fetchHybridRecommendations(0.6, desired + 1)
      .then(data => {
        // фильтруем текущую статью и обрезаем до нужного размера
        const filtered = data
          .filter(p => p.id !== post.id)
          .slice(0, desired);
        setRecs(filtered);
    })
      .catch(console.error)
      .finally(() => setRecsLoading(false));
  }, [post]);

  const toggleLike = () => {
    const token = localStorage.getItem('access');
    if (!token) {
      setMessage('Чтобы поставить лайк нужно войти в аккаунт');
      return;
    }
    if (message) setMessage('');

    axios.post(
      `http://localhost:8000/api/posts/${id}/like/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      setLikesCount(res.data.likes_count);
      setIsLiked(res.data.status === 'liked');
    })
    .catch(err => {
      console.error(err);
      setMessage('Не удалось обновить лайк. Попробуйте позже.');
    });
  };

  if (!post) return <p>Загрузка…</p>;

  return (
    <>
      <Header />

      <div className="d-flex">
        {/* Сайдбар */}
        <Sidebar />

        {/* Основной контент: центрируем и ограничиваем ширину */}
        <main className="flex-grow-1 p-4">
          <div className="post-content-wrapper">
            {/* Обложка: object-position top */}
            {post.cover && (
              <div style={{ overflow: 'hidden', borderRadius: 8, marginBottom: 20 }}>
                <img
                  src={post.cover}
                  alt="Обложка поста"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",  // или можно вовсе убрать objectFit
                    marginBottom: "20px"
                  }}
                />
              </div>
            )}

            {/* Автор и подписка */}
            <div className="d-flex align-items-center mb-4">
              {post.author_avatar && (
                <Link to={`/author/${post.author_username}`}>
                  <img
                    src={post.author_avatar}
                    alt={post.author_username}
                    style={{
                      width: 40, height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: 12
                    }}
                  />
                </Link>
              )}
              <Link to={`/author/${post.author_username}`} className="text-dark text-decoration-none">
                <strong>{post.author_username}</strong>
              </Link>
              <button
                className="btn btn-sm btn-primary ms-auto"
                onClick={async () => {
                  const status = await toggleFollow(post.author_username);
                  setSubStatus(status);
                }}
              >
                {subStatus === 'followed' ? 'Подписаны ✓' : 'Подписаться'}
              </button>
            </div>

            {/* Заголовок */}
            <h1 className="mb-4 post-title">{post.title}</h1>

            {/* Содержимое */}
            <div
             className="article-content mb-5"
             dangerouslySetInnerHTML={{ __html: post.content }}
           />

            {/* Теги */}
            <div className="mb-4">
              {post.tags.map(tag => (
              <Link
                key={tag.slug}
                to={`/?tag=${tag.slug}`}
                className="tag-badge"
              >
                #{tag.name}
              </Link>
              ))}
            </div>

            {/* Лайк + просмотры */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className={`btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={toggleLike}
              >
                {isLiked ? ' ❤️ ' : ' ❤️ '} {likesCount}
              </button>
              <p className="text-muted mb-0">👁 Просмотров: {post.views}</p>
            </div>
            
            {/* Подсказка */}
            {message && (
              <div className="alert alert-warning my-2">
                {message}&nbsp;
                {!localStorage.getItem('access') && (
                  <a
                    href="/login"
                    onClick={e => {
                      e.preventDefault();
                      navigate('/login');
                    }}
                  >
                    Войти в аккаунт
                  </a>
                )}
              </div>
            )}
            <CommentsList postId={post.id} />

            <section className="mt-5 recommendations">
              <h2>Рекомендуем почитать</h2>
              {recsLoading ? (
                <p>Загрузка рекомендаций…</p>
              ) : recs.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                  {recs.map(p => (
                    // Здесь уже сами контролируем колонку, а карточке говорим noWrapper
                    <div className="col" key={p.id}>
                      <PostCard post={p} noWrapper />
                    </div>
                  ))}
                </div>
              ) : (
                <p>Пока нет рекомендаций.</p>
              )}
            </section>

          </div>
        </main>
      </div>
    </>
  );
}

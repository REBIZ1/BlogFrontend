import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost]           = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked]       = useState(false);
  const [message, setMessage]       = useState('');

  useEffect(() => {
    // 1) Загрузить пост и лайк‑статус
    axios.get(`http://localhost:8000/api/posts/${id}/`)
      .then(res => {
        setPost(res.data);
        setLikesCount(res.data.likes_count);
        setIsLiked(res.data.is_liked);
      })
      .catch(console.error);

    // 2) Засечь время чтения и отправить при уходе
    const start = Date.now();
    const handleUnload = () => {
      const seconds = Math.round((Date.now() - start) / 1000);
      if (seconds < 8) return;  // прежний порог в 8 секунд

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
      handleUnload();  // сработает и при переходе внутри SPA
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [id]);

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
      <div className="container py-5">

        {post.cover && (
          <img
            src={post.cover}
            alt="Обложка поста"
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              marginBottom: "20px"
            }}
          />
        )}

        <h1>{post.title}</h1>

        {/* рендерим HTML-контент, полученный из Quill */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* теги */}
        <div className="mb-3">
          {post.tags.map(tag => (
            <Link
              key={tag.slug}
              to={`/?tag=${tag.slug}`}
              className="badge bg-secondary me-1"
            >
              #{tag.name}
            </Link>
          ))}
        </div>

        {/* лайк + просмотры */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className={`btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={toggleLike}
          >
            {isLiked ? '💔 Убрать лайк' : '❤️ Лайкнуть'} {likesCount}
          </button>
          <p className="text-muted mb-0">👁 Просмотров: {post.views}</p>
        </div>

        {/* подсказка для гостя */}
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
      </div>
    </>
  );
}

export default PostDetailPage;

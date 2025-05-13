import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentItem from './CommentItem';


const MIN_COMMENT_LENGTH = 3;
const MAX_COMMENT_LENGTH = 500;

export default function CommentsList({ postId }) {
  const [comments, setComments]       = useState([]);
  const [showAll, setShowAll]         = useState(false);
  const [newText, setNewText]         = useState('');
  const [newError, setNewError]       = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/comments/?post=${postId}`)
      .then(res => setComments(res.data))
      .catch(console.error);
  }, [postId]);

  const handleNew = comment => {
    // если корневой — вставляем в начало
    if (!comment.parent) {
      setComments(prev => [comment, ...prev]);
      setShowAll(true);
    } else {
      // ответ — внедряем рекурсивно
      const insertReply = (nodes) =>
        nodes.map(n => n.id === comment.parent
          ? { ...n, replies: [...n.replies, comment] }
          : { ...n, replies: insertReply(n.replies) }
        );
      setComments(prev => insertReply(prev));
    }
  };

  const submitNew = () => {
    setNewError('');
    const text = newText.trim();
    if (text.length < MIN_COMMENT_LENGTH) {
      setNewError(`Комментарий должен быть не менее ${MIN_COMMENT_LENGTH} символов.`);
      return;
    }
    if (text.length > MAX_COMMENT_LENGTH) {
      setNewError(`Комментарий не может превышать ${MAX_COMMENT_LENGTH} символов.`);
      return;
    }
    const token = localStorage.getItem('access');
    setLoadingSubmit(true);
    axios.post(
      'http://localhost:8000/api/comments/',
      { post: postId, content: text },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      handleNew(res.data);
      setNewText('');
    })
    .catch(() => setNewError('Ошибка при отправке комментария'))
    .finally(() => setLoadingSubmit(false));
  };

  const total = comments.length;
  const visible = showAll ? comments : comments.slice(0, 5);
  const hiddenCount = total - visible.length;

  return (
    <div className="comments-container">
      <h5 className="mb-3">Комментарии {total}</h5>

      {localStorage.getItem('access') ? (
        <div className="comment-form mb-4">
          <div className="d-flex">
            <input
              className="form-control me-2"
              placeholder="Написать комментарий"
              value={newText}
              maxLength={MAX_COMMENT_LENGTH}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitNew()}
              disabled={loadingSubmit}
            />
            <button
              className="btn btn-primary"
              onClick={submitNew}
              disabled={loadingSubmit || newText.trim().length < MIN_COMMENT_LENGTH}
            >
              ➤
            </button>
          </div>
          {newError && <div className="comment-error">{newError}</div>}
        </div>
      ) : (
        <p className="text-end mb-4">
          <a href="/login">Войти</a>, чтобы комментировать
        </p>
      )}

      {visible.map(c => (
        <CommentItem
          key={c.id}
          comment={c}
          depth={0}
          onNewComment={handleNew}
        />
      ))}

      {hiddenCount > 0 && !showAll && (
        <button
          className="btn btn-sm btn-link text-muted mt-3"
          onClick={() => setShowAll(true)}
        >
          Показать все комментарии
        </button>
      )}

      {total === 0 && (
        <p className="text-muted">Пока нет комментариев. Будьте первым!</p>
      )}
    </div>
  );
}

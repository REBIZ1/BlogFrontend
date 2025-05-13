import React, { useState } from 'react';
import axios from 'axios';

const MIN_REPLY_LENGTH = 3;
const MAX_REPLY_LENGTH = 500;

export default function CommentItem({ comment, depth, onNewComment }) {
  const [replyOpen, setReplyOpen]   = useState(false);
  const [replyText, setReplyText]   = useState('');
  const [replyError, setReplyError] = useState('');
  const [expanded, setExpanded]     = useState(false);

  const replies = comment.replies || [];
  const count   = replies.length;
  const INDENT  = 16;

  const submitReply = () => {
    setReplyError('');
    const text = replyText.trim();
    if (text.length < MIN_REPLY_LENGTH) {
      setReplyError(`Ответ должен быть не менее ${MIN_REPLY_LENGTH} символов.`);
      return;
    }
    if (text.length > MAX_REPLY_LENGTH) {
      setReplyError(`Ответ не может превышать ${MAX_REPLY_LENGTH} символов.`);
      return;
    }
    const token = localStorage.getItem('access');
    axios.post(
      'http://localhost:8000/api/comments/',
      { post: comment.post, parent: comment.id, content: text },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      onNewComment(res.data);
      setReplyText('');
      setReplyOpen(false);
      setExpanded(true);
    })
    .catch(() => setReplyError('Ошибка при отправке ответа'));
  };

  return (
    <>
      <div
        className="comment-item"
        style={{ marginLeft: depth * INDENT }}
      >
        {depth > 0 && <div className="comment-replies-line" />}

        <div className="comment-header">
          {comment.author_avatar && (
            <img src={comment.author_avatar} alt={comment.author_username} />
          )}
          <strong>{comment.author_username}</strong>
          <small className="text-muted ms-2">
            {new Date(comment.created_at).toLocaleString()}
          </small>
        </div>

        <div className="comment-content">
          {comment.content}
        </div>

        <div className="comment-actions">
          <button
            className="btn btn-sm btn-link"
            onClick={() => {
              if (!localStorage.getItem('access')) {
                alert('Чтобы ответить, нужно войти в аккаунт.');
                return;
              }
              setReplyOpen(o => !o);
            }}
          >
            Ответить
          </button>

          {count > 0 && !expanded && (
            <button
              className="btn btn-sm btn-link text-muted"
              onClick={() => setExpanded(true)}
            >
              — Показать все ответы
            </button>
          )}
        </div>

        {replyOpen && (
          <div className="comment-reply-form">
            <textarea
              className="form-control mb-1"
              rows="3"
              value={replyText}
              maxLength={MAX_REPLY_LENGTH}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Ваш ответ…"
            />
            {replyError && <div className="comment-error">{replyError}</div>}
            <button className="btn btn-primary btn-sm" onClick={submitReply}>
              Отправить
            </button>
          </div>
        )}
      </div>

      {expanded && count > 0 && (
        <div className="comment-replies">
          {replies.map(r => (
            <CommentItem
              key={r.id}
              comment={r}
              depth={depth + 1}
              onNewComment={onNewComment}
            />
          ))}
        </div>
      )}
    </>
  );
}

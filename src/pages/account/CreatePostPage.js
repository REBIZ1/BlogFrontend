import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTags } from '../../hooks/useTags';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { tags, loading: tagsLoading, error: tagsError } = useTags();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    cover: null,
    tagSlugs: []      // здесь будем хранить выбранные slug
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files, selectedOptions } = e.target;
    if (name === 'cover') {
      setFormData(f => ({ ...f, cover: files[0] }));
    } else if (name === 'tagSlugs') {
      // собираем массив выбранных slug из <select multiple>
      const slugs = Array.from(selectedOptions).map(opt => opt.value);
      setFormData(f => ({ ...f, tagSlugs: slugs }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('access');
      if (!token) throw new Error('Не авторизован');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (formData.cover) data.append('cover', formData.cover);
      // важное: указываем именно field name 'tag_slugs'
      formData.tagSlugs.forEach(slug => data.append('tag_slugs', slug));

      await axios.post('http://localhost:8000/api/posts/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/account/create');  // или куда нужно после создания
    } catch (err) {
      console.error('Ошибка создания поста:', err);
      setSubmitError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3>Создать новый пост</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Заголовок</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Обложка</label>
          <input
            type="file"
            name="cover"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Теги</label>
          {tagsLoading && <p>Загрузка тегов…</p>}
          {tagsError && <p className="text-danger">Не удалось загрузить теги.</p>}
          <select
            multiple
            name="tagSlugs"
            className="form-select"
            value={formData.tagSlugs}
            onChange={handleChange}
          >
            {tags.map(tag => (
              <option key={tag.id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
          <div className="form-text">
            Чтобы выбрать несколько, удерживайте Ctrl (Cmd на Mac).
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Содержимое</label>
          <textarea
            name="content"
            className="form-control"
            rows={6}
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        {submitError && (
          <div className="alert alert-danger">
            Ошибка при отправке: {submitError.message}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Сохраняем…' : 'Создать'}
        </button>
      </form>
    </div>
  );
}

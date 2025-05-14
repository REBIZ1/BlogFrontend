// src/pages/account/CreatePostPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTags } from '../../hooks/useTags';
import RichTextEditor from '../../components/RichTextEditor';

export default function CreatePostPage() {
  const navigate = useNavigate();

  // как только зашли на страницу — проверяем токены
  useEffect(() => {
    const refresh = localStorage.getItem('refresh');
    const access  = localStorage.getItem('access');
    // если вообще нет refresh — сразу на логин
    if (!refresh) {
      navigate('/login', {replace: true});
      return;
    }
    // если есть refresh, пытаемся обновить access
    axios.post('http://localhost:8000/api/token/refresh/', { refresh })
    .then(res => {
      localStorage.setItem('access', res.data.access);
    })
    .catch(() =>{
      // не удалось обновить — уходим на логин
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  const { tags, loading: tagsLoading, error: tagsError } = useTags();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    cover: null,
    tag_slugs: []
  });
  // errors хранит объект полевых ошибок { title: [...], content: [...], tag_slugs: [...], non_field_errors: [...] }
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, selectedOptions } = e.target;
    setErrors(prev => ({ ...prev, [name]: null, non_field_errors: null }));

    if (name === 'cover') {
      setFormData(f => ({ ...f, cover: files[0] }));
    } else if (name === 'tag_slugs') {
      const slugs = Array.from(selectedOptions).map(opt => opt.value);
      setFormData(f => ({ ...f, tag_slugs: slugs }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const refresh = localStorage.getItem('refresh');
    let access = localStorage.getItem('access');
    if (!access || !refresh) {
      return navigate('/login', { replace: true });
    }

    // обновляем access по refresh
    try {
      const resp = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
      access = resp.data.access;
      localStorage.setItem('access', access);
    } catch {
      return navigate('/login', { replace: true });
    }

    // формируем FormData
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (formData.cover) data.append('cover', formData.cover);
    formData.tag_slugs.forEach(slug => data.append('tag_slugs', slug));
    
    try {
      await axios.post(
        'http://localhost:8000/api/posts/',
        data,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      navigate('/account/create');  // или на detail созданного поста
    } catch (err) {
      const resp = err.response?.data;
      if (resp) {
        // преобразуем tag_slugs в совпадающий ключ
        const fieldErrors = {};
        for (const key of Object.keys(resp)) {
          // если бэкенд отдал tag_slugs, поправим на tagSlugs
          const field = key === 'tag_slugs' ? 'tagSlugs' : key;
          fieldErrors[key] = resp[key];
        }
        setErrors(fieldErrors);
      } else {
        setErrors({ non_field_errors: ['Ошибка сервера. Попробуйте позже.'] });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <h3 className="mb-4">Создать новую статью</h3>

      {errors.non_field_errors && (
        <div className="alert alert-danger">
          {errors.non_field_errors.map((msg, i) => <div key={i}>{msg}</div>)}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Заголовок */}
        <div className="mb-3">
          <label className="form-label">Заголовок</label>
          <input
            name="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            value={formData.title}
            onChange={handleChange}
            required
          />
          {errors.title && errors.title.map((msg, i) => (
            <div key={i} className="invalid-feedback">{msg}</div>
          ))}
        </div>

        {/* Обложка */}
        <div className="mb-3">
          <label className="form-label">Обложка</label>
          <input
            type="file"
            name="cover"
            className={`form-control ${errors.cover ? 'is-invalid' : ''}`}
            onChange={handleChange}
          />
          {errors.cover && errors.cover.map((msg, i) => (
            <div key={i} className="invalid-feedback">{msg}</div>
          ))}
        </div>

        {/* Теги */}
        <div className="mb-3">
          <label className="form-label">Теги</label>
          {tagsLoading && <p>Загрузка тегов…</p>}
          {tagsError && <p className="text-danger">Не удалось загрузить теги.</p>}
          <select
            multiple
            name="tag_slugs"
            className={`form-select ${errors.tag_slugs ? 'is-invalid' : ''}`}
            value={formData.tag_slugs}
            onChange={handleChange}
          >
            {tags.map(tag => (
              <option key={tag.id} value={tag.slug}>{tag.name}</option>
            ))}
          </select>
          {errors.tag_slugs && errors.tag_slugs.map((msg, i) => (
            <div key={i} className="invalid-feedback">{msg}</div>
          ))}
          <div className="form-text">Чтобы выбрать несколько, удерживайте Ctrl (Cmd на Mac).</div>
        </div>

        {/* Контент */}
        <div className="mb-3">
          <label className="form-label">Содержимое статьи</label>
          <RichTextEditor
            value={formData.content}
            onChange={value => {
              setFormData(f => ({ ...f, content: value }));
              setErrors(prev => ({ ...prev, content: null }));
            }}
            className={errors.content ? 'is-invalid' : ''}
          />
          {errors.content && errors.content.map((msg, i) => (
            <div key={i} className="text-danger mt-1">{msg}</div>
          ))}
        </div>

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

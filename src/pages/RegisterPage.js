// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  // errors — объект вида { username: [...], password: [...], password2: [...], non_field_errors: [...] }
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    // сбрасываем ошибку этого поля при вводе
    setErrors((prev) => ({ ...prev, [name]: null, non_field_errors: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});  // сброс предыдущих ошибок

    // фронтенд-проверка совпадения паролей
    if (formData.password !== formData.password2) {
      return setErrors({ password2: ['Пароли не совпадают.'] });
    }

    try {
      await axios.post(
        'http://localhost:8000/api/accounts/register/',
        formData
      );
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        // сюда придёт объект с ключами полей и массивами ошибок
        setErrors(err.response.data);
      } else {
        // общая ошибка
        setErrors({ non_field_errors: ['Сервер не отвечает. Попробуйте позже.'] });
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container py-5">
        <h2 className="text-center mb-4">Регистрация</h2>

        {/* Общие ошибки (если есть) */}
        {errors.non_field_errors && (
          <div className="alert alert-danger">
            {errors.non_field_errors.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* username */}
          <div className="mb-3">
            <label className="form-label">Имя пользователя</label>
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && errors.username.map((msg, i) => (
              <div key={i} className="invalid-feedback">
                {msg}
              </div>
            ))}
          </div>

          {/* email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && errors.email.map((msg, i) => (
              <div key={i} className="invalid-feedback">
                {msg}
              </div>
            ))}
          </div>

          {/* password */}
          <div className="mb-3">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && errors.password.map((msg, i) => (
              <div key={i} className="invalid-feedback">
                {msg}
              </div>
            ))}
          </div>

          {/* password2 */}
          <div className="mb-3">
            <label className="form-label">Подтвердите пароль</label>
            <input
              type="password"
              name="password2"
              className={`form-control ${errors.password2 ? 'is-invalid' : ''}`}
              value={formData.password2}
              onChange={handleChange}
              required
            />
            {errors.password2 && errors.password2.map((msg, i) => (
              <div key={i} className="invalid-feedback">
                {msg}
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Зарегистрироваться
          </button>

          <p className="py-4 text-center">
            Уже зарегистрированы? <a href="/login">Войти.</a>
          </p>
        </form>
      </div>
    </>
  );
}

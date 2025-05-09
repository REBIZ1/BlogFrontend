// src/pages/account/SettingsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();

  // состояние профиля
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [errorsProfile, setErrorsProfile] = useState({}); // { username: [...], email: [...], non_field_errors: [...] }
  const [msgProfile, setMsgProfile] = useState('');

  // состояние смены пароля
  const [pwdData, setPwdData] = useState({
    old_password: '',
    new_password1: '',
    new_password2: ''
  });
  const [errorsPwd, setErrorsPwd] = useState({});
  const [msgPwd, setMsgPwd] = useState('');

  // загрузка данных профиля
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return navigate('/login', { replace: true });

    axios.get('http://localhost:8000/api/accounts/profile/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProfile(res.data))
    .catch(() => navigate('/login', { replace: true }));
  }, [navigate]);

  // обработка изменений профиля
  const handleProfileChange = e => {
    const { name, value, files } = e.target;
    setErrorsProfile(prev => ({ ...prev, [name]: null, non_field_errors: null }));
    if (name === 'avatar') {
      setAvatarFile(files[0]);
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  // отправка профиля
  const submitProfile = async e => {
    e.preventDefault();
    setErrorsProfile({});
    setMsgProfile('');
    const token = localStorage.getItem('access');

    const form = new FormData();
    form.append('username', profile.username);
    form.append('email', profile.email);
    if (avatarFile) form.append('avatar', avatarFile);

    try {
      await axios.patch(
        'http://localhost:8000/api/accounts/profile/',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setMsgProfile('Профиль обновлён');
      localStorage.setItem('username', profile.username);
      if (avatarFile) {
        const url = URL.createObjectURL(avatarFile);
        localStorage.setItem('avatar', url);
      }
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        setErrorsProfile(data);
      } else {
        setMsgProfile('Ошибка при обновлении профиля');
      }
    }
  };

  // изменения в полях пароля
  const handlePwdChange = e => {
    const { name, value } = e.target;
    setErrorsPwd(prev => ({ ...prev, [name]: null, non_field_errors: null }));
    setPwdData(prev => ({ ...prev, [name]: value }));
  };

  // отправка смены пароля
  const submitPassword = async e => {
    e.preventDefault();
    setErrorsPwd({});
    setMsgPwd('');
    const token = localStorage.getItem('access');

    try {
      const res = await axios.post(
        'http://localhost:8000/api/accounts/change_password/',
        pwdData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgPwd(res.data.detail || 'Пароль успешно изменён');
      setPwdData({ old_password: '', new_password1: '', new_password2: '' });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        setErrorsPwd(data);
      } else {
        setMsgPwd('Ошибка при смене пароля');
      }
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Настройки аккаунта</h2>

      {/* Форма профиля */}
      <form onSubmit={submitProfile} className="card mb-5">
        <div className="card-body">
          <h5 className="card-title">Изменить профиль</h5>

          {/* Общие ошибки */}
          {errorsProfile.non_field_errors && (
            <div className="alert alert-danger">
              {errorsProfile.non_field_errors.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          )}
          {msgProfile && (
            <div className="alert alert-success">{msgProfile}</div>
          )}

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Имя пользователя</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleProfileChange}
              className={`form-control ${
                errorsProfile.username ? 'is-invalid' : ''
              }`}
              required
            />
            {errorsProfile.username && errorsProfile.username.map((msg, i) => (
              <div key={i} className="invalid-feedback">{msg}</div>
            ))}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className={`form-control ${
                errorsProfile.email ? 'is-invalid' : ''
              }`}
            />
            {errorsProfile.email && errorsProfile.email.map((msg, i) => (
              <div key={i} className="invalid-feedback">{msg}</div>
            ))}
          </div>

          {/* Avatar */}
          <div className="mb-3">
            <label className="form-label">Аватар</label>
            <input
              type="file"
              name="avatar"
              onChange={handleProfileChange}
              className={`form-control ${
                errorsProfile.avatar ? 'is-invalid' : ''
              }`}
              accept="image/*"
            />
            {errorsProfile.avatar && errorsProfile.avatar.map((msg, i) => (
              <div key={i} className="invalid-feedback">{msg}</div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary">
            Сохранить профиль
          </button>
        </div>
      </form>

      {/* Форма смены пароля */}
      <form onSubmit={submitPassword} className="card">
        <div className="card-body">
          <h5 className="card-title">Сменить пароль</h5>

          {/* Общие ошибки */}
          {errorsPwd.non_field_errors && (
            <div className="alert alert-danger">
              {errorsPwd.non_field_errors.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          )}
          {msgPwd && (
            <div className="alert alert-success">{msgPwd}</div>
          )}

          {/* Старый пароль */}
          <div className="mb-3">
            <label className="form-label">Старый пароль</label>
            <input
              type="password"
              name="old_password"
              value={pwdData.old_password}
              onChange={handlePwdChange}
              className={`form-control ${
                errorsPwd.old_password ? 'is-invalid' : ''
              }`}
              required
            />
            {errorsPwd.old_password && errorsPwd.old_password.map((msg, i) => (
              <div key={i} className="invalid-feedback">{msg}</div>
            ))}
          </div>

          {/* Новый пароль */}
          <div className="mb-3">
            <label className="form-label">Новый пароль</label>
            <input
              type="password"
              name="new_password1"
              value={pwdData.new_password1}
              onChange={handlePwdChange}
              className={`form-control ${
                errorsPwd.new_password1 ? 'is-invalid' : ''
              }`}
              required
            />
            {errorsPwd.new_password1 && errorsPwd.new_password1.map((msg, i) => (
              <div key={i} className="invalid-feedback">{msg}</div>
            ))}
          </div>

          {/* Подтверждение нового пароля */}
          <div className="mb-3">
            <label className="form-label">Подтвердите новый пароль</label>
            <input
              type="password"
              name="new_password2"
              value={pwdData.new_password2}
              onChange={handlePwdChange}
              className={`form-control ${
                errorsPwd.new_password2 ? 'is-invalid' : ''
              }`}
              required
            />
            {errorsPwd.new_password2 && errorsPwd.new_password2.map((msg, i) => (
              <div key={i} className="invalid-feedback">{msg}</div>
            ))}
          </div>

          <button type="submit" className="btn btn-warning">
            Изменить пароль
          </button>
        </div>
      </form>
    </div>
  );
}

// src/pages/account/SettingsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function SettingsPage() {
  const navigate = useNavigate();

  // состояние профиля
  const [profile, setProfile]   = useState({ username: '', email: '', avatar: '' });
  const [avatarFile, setAvatar] = useState(null);
  const [msgProfile, setMsgProfile] = useState('');

  // состояние смены пароля
  const [pwdData, setPwdData]   = useState({
    old_password: '', new_password1: '', new_password2: ''
  });
  const [msgPwd, setMsgPwd]     = useState('');

  // при монтировании — загрузить текущие данные профиля
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return navigate('/login', { replace: true });

    axios.get('http://localhost:8000/api/accounts/profile/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProfile(res.data))
    .catch(() => navigate('/login', { replace: true }));
  }, [navigate]);

  // обработка изменения полей профиля
  const handleProfileChange = e => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setAvatar(files[0]);
    } else {
      setProfile(p => ({ ...p, [name]: value }));
    }
  };

  // отправка обновлённых данных профиля
  const submitProfile = async e => {
    e.preventDefault();
    setMsgProfile('');
    const token = localStorage.getItem('access');

    const form = new FormData();
    form.append('username', profile.username);
    form.append('email',    profile.email);
    if (avatarFile) form.append('avatar', avatarFile);

    try {
      await axios.patch('http://localhost:8000/api/accounts/profile/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMsgProfile('Профиль обновлён');
      // обновим username и avatar в localStorage
      localStorage.setItem('username', profile.username);
      if (avatarFile) {
        const url = URL.createObjectURL(avatarFile);
        localStorage.setItem('avatar', url);
      }
    } catch (err) {
      setMsgProfile('Ошибка при обновлении профиля');
    }
  };

  // обработка полей смены пароля
  const handlePwdChange = e => {
    const { name, value } = e.target;
    setPwdData(d => ({ ...d, [name]: value }));
  };

  // отправка запроса на смену пароля
  const submitPassword = async e => {
    e.preventDefault();
    setMsgPwd('');
    const token = localStorage.getItem('access');

    try {
      const res = await axios.post(
        'http://localhost:8000/api/accounts/change_password/',
        pwdData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgPwd(res.data.detail || 'Пароль изменён');
      setPwdData({ old_password:'', new_password1:'', new_password2:'' });
    } catch (err) {
      const data = err.response?.data || {};
      setMsgPwd(Object.values(data).flat().join(' ') || 'Ошибка при смене пароля');
    }
  };

  return (
    <>
      <div className="container py-4" style={{ maxWidth: '800px' }}>
        <h2 className="mb-4">Настройки аккаунта</h2>

        {/* — Форма профиля — */}
        <form onSubmit={submitProfile} className="card mb-5">
          <div className="card-body">
            <h5 className="card-title">Изменить профиль</h5>
            {msgProfile && <div className="alert alert-info">{msgProfile}</div>}

            <div className="mb-3">
              <label className="form-label">Имя пользователя</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Аватар</label>
              <input
                type="file"
                name="avatar"
                onChange={handleProfileChange}
                className="form-control"
                accept="image/*"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Сохранить профиль
            </button>
          </div>
        </form>

        {/* — Форма смены пароля — */}
        <form onSubmit={submitPassword} className="card">
          <div className="card-body">
            <h5 className="card-title">Сменить пароль</h5>
            {msgPwd && <div className="alert alert-info">{msgPwd}</div>}

            <div className="mb-3">
              <label className="form-label">Старый пароль</label>
              <input
                type="password"
                name="old_password"
                value={pwdData.old_password}
                onChange={handlePwdChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Новый пароль</label>
              <input
                type="password"
                name="new_password1"
                value={pwdData.new_password1}
                onChange={handlePwdChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Подтверждение нового пароля</label>
              <input
                type="password"
                name="new_password2"
                value={pwdData.new_password2}
                onChange={handlePwdChange}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-warning">
              Изменить пароль
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

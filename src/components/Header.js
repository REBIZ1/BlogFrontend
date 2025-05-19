import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate    = useNavigate();
  const accessToken = localStorage.getItem('access');
  const username    = localStorage.getItem('username');
  const avatar      = localStorage.getItem('avatar');

  const [open, setOpen] = useState(false);
  const dropdownRef     = useRef(null);

  // закрываем при клике вне
  useEffect(() => {
    const onClickOutside = e => {
      if (open && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const handleLogout = () => {
    ['access','refresh','username','avatar'].forEach(k => localStorage.removeItem(k));
    navigate('/');
  };

  return (
    <header className="site-header">
      {/* Лого */}
      <Link to="/" className="site-logo">Дзен</Link>

      {/* Поиск */}
      <div className="site-search">
        <img src="/Header/Search.png" alt="Поиск" className="search-icon" />
        <input
          type="search"
          placeholder="Поиск ..."
        />
      </div>

      {/* Кнопка Войти / профиль */}
    {accessToken ? (
      <div className="dropdown-wrapper" ref={dropdownRef}>
        <button
          className="btn-login"
          onClick={() => setOpen(o => !o)}
        >
          {avatar && (
            <img
              src={avatar}
              alt="Аватар"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '8px'
              }}
            />
          )}
          <span>{username}</span>
          <span style={{ marginLeft: '6px' }}>&#x25BE;</span>
        </button>

        {open && (
          <div className="custom-dropdown-menu">
            <Link to="/account/create" className="custom-dropdown-item">
              <img src="/Header/Create.png" className="icon" />
              Написать статью
            </Link>
            <Link to="/account/favorites" className="custom-dropdown-item">
              <img src="/SideBar/Favorites.png" className="icon" />
              Избранное
            </Link>
            <Link to="/account/history" className="custom-dropdown-item">
              <img src="/Header/History.png" className="icon" />
              История
            </Link>
            <Link to="/account/settings" className="custom-dropdown-item">
              <img src="/Header/Setting.png" className="icon" />
              Настройки
            </Link>


            <div className="divider" />

            <button
              onClick={handleLogout}
              className="custom-dropdown-item logout"
            >
              <img src="/Header/Exit.png" className="icon" /> 
              Выйти
            </button>
          </div>
        )}
      </div>
    ) : (
      <button onClick={() => navigate('/login')} className="btn-login">
        Войти
      </button>
    )}
    </header>
  );
}

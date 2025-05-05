// src/components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('access');
  const username    = localStorage.getItem('username');
  const avatar      = localStorage.getItem('avatar');

  const [open, setOpen] = useState(false);
  const dropdownRef     = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    navigate('/login');
  };

  // Закрываем дропдаун при клике вне его
  useEffect(() => {
    const onClickOutside = e => {
      if (open && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <header className="bg-white shadow-sm mb-4">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <Link to="/" className="text-decoration-none text-dark">
          <h2 className="mb-0">📚 BlogGibrid</h2>
        </Link>

        {accessToken ? (
          <div className="position-relative" ref={dropdownRef}>
            <button
              className="btn btn-light d-flex align-items-center"
              onClick={() => setOpen(o => !o)}
            >
              {avatar && (
                <img
                  src={avatar}
                  alt="Аватар"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "8px"
                  }}
                />
              )}
              <span>{username}</span>
              <span className="ms-2">&#x25BE;</span> {/* стрелочка вниз */}
            </button>

            <div
              className={`dropdown-menu dropdown-menu-end${open ? ' show' : ''}`}
              style={{ minWidth: '200px' }}
            >
                <Link to="/account/create"    className="dropdown-item">📝 Написать статью</Link>
                <Link to="/account/favorites" className="dropdown-item">⭐ Избранное</Link>
                <Link to="/account/history"   className="dropdown-item">📜 История просмотра</Link>
                <Link to="/account/settings"  className="dropdown-item">⚙️ Настройки аккаунта</Link>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item text-danger">
                🚪 Выйти
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn btn-outline-primary btn-sm">
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}

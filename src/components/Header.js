import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('access');
  const username = localStorage.getItem('username'); // будем сохранять позже
  const avatar = localStorage.getItem('avatar');     // будем сохранять позже

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm mb-4">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 className="mb-0">📚 BlogGibrid</h2>
        </Link>

        {accessToken ? (
          <div className="d-flex align-items-center">
            {avatar && (
              <img
                src={avatar}
                alt="Аватар"
                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", marginRight: "10px" }}
              />
            )}
            {username && <span style={{ marginRight: "10px" }}>{username}</span>}
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Выйти
            </button>
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

export default Header;

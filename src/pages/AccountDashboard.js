import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function AccountDashboard() {
  const navigate = useNavigate()
  return (
    <div className="container py-3" style={{ maxWidth: '900px' }}>
      <button className="btn btn-sm btn-secondary mb-3" onClick={() => navigate('/')}>
        ← Назад
      </button>
      <h2 className="mb-4">Личный кабинет</h2>
      <div className="row">
        <nav className="col-12 col-md-3 mb-4">
          <ul className="nav flex-md-column nav-pills">
            <li className="nav-item">
              <NavLink to="create"    className="nav-link">Создать пост</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="favorites" className="nav-link">Избранное</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="history"   className="nav-link">История просмотра</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="settings"  className="nav-link">Настройки</NavLink>
            </li>
          </ul>
        </nav>
        <main className="col-12 col-md-9">
          <div className="card">
            <div className="card-body p-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


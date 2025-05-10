// src/components/Sidebar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // пункты меню
  const navItems = [
    { to: '/',                   label: 'Главная',      icon: '🏠' },
    { to: '/subscriptions',      label: 'Подписки',     icon: '🔔' },
    { to: '/popular',            label: 'Популярное',   icon: '🔥' },
    { to: '/recommendations',    label: 'Рекомендации', icon: '⭐' },
    { to: '/new',                label: 'Новые',        icon: '🆕' },
    { to: '/account/favorites',  label: 'Избранное',    icon: '❤️' },
  ];

  // состояние фильтра по тегам
  const [allTags, setAllTags]           = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const wrapperRef = useRef(null);

  // показывать панель фильтров?
  const [showFilters, setShowFilters] = useState(false);

  // загрузить теги
  useEffect(() => {
    axios.get('http://localhost:8000/api/tags/')
      .then(res => setAllTags(res.data))
      .catch(console.error);
  }, []);

  // обновлять подсказки
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTags([]);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredTags(
        allTags.filter(
          tag =>
            tag.name.toLowerCase().startsWith(q) &&
            !selectedTags.some(t => t.slug === tag.slug)
        )
      );
    }
  }, [searchTerm, allTags, selectedTags]);

  // закрыть подсказки при клике вне
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFilteredTags([]);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // выбрать тег
  const pickTag = tag => {
    setSelectedTags([...selectedTags, tag]);
    setSearchTerm('');
  };
  // удалить
  const removeTag = slug => {
    setSelectedTags(selectedTags.filter(t => t.slug !== slug));
  };

  // применить фильтры — переход на главную с параметром tag
  const applyFilters = () => {
    if (selectedTags.length > 0) {
      const param = selectedTags.map(t => t.slug).join(',');
      navigate(`/?tag=${param}`);
    } else {
      navigate('/');
    }
    setShowFilters(false);
  };

  return (
    <div
      className='bg-white border-end'
      style={{
        width: '240px',       // зафиксированная ширина
        maxWidth: '240px',    // больше не растянется
        flex: '0 0 240px',    // внутри d-flex‑контейнера не будет расти или сжиматься
        height: 'calc(100vh - 68px)',  // при желании жёстко задать высоту
        overflowY: 'auto'     // чтобы, если контента много, появился скролл
      }}
    >
      <ul className="list-unstyled m-0 p-0">
        {navItems.map(item => {
          const active = pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={
                  'd-flex align-items-center py-2 px-3 ' +
                  (active ? 'bg-light fw-bold' : 'text-dark')
                }
              >
                <span className="me-2">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Кнопка показа/скрытия фильтров */}
      <div className="p-3">
        <button
          className="btn btn-outline-secondary w-100 mb-2"
          onClick={() => setShowFilters(f => !f)}
        >
          Поиск по фильтрам
        </button>

        {showFilters && (
          <div ref={wrapperRef}>
            <label htmlFor="tag-search" className="form-label">
              Фильтр по тегам
            </label>
            <input
              id="tag-search"
              type="text"
              className="form-control mb-1"
              placeholder="Начните вводить…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            {/* подсказки */}
            {filteredTags.length > 0 && (
              <ul
                className="list-group position-absolute"
                style={{ zIndex: 1000, width: 200, marginTop: 0 }}
              >
                {filteredTags.map(tag => (
                  <li
                    key={tag.slug}
                    className="list-group-item list-group-item-action"
                    onClick={() => pickTag(tag)}
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            )}

            {/* выбранные */}
            {selectedTags.length > 0 && (
              <div className="mt-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag.slug}
                    className="badge bg-primary me-1 mb-1"
                  >
                    {tag.name}
                    <button
                      type="button"
                      className="btn-close btn-close-white btn-sm ms-1"
                      aria-label="Close"
                      onClick={() => removeTag(tag.slug)}
                    />
                  </span>
                ))}
              </div>
            )}

            {/* Кнопка применения фильтра */}
            <button
              className="btn btn-primary w-100 mt-3"
              onClick={applyFilters}
            >
              Поиск
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

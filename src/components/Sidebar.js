// src/components/Sidebar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Range } from 'react-range';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: '/',                   label: 'Главная',      icon: '🏠' },
    { to: '/subscriptions',      label: 'Подписки',     icon: '🔔' },
    { to: '/popular',            label: 'Популярное',   icon: '🔥' },
    { to: '/recommendations',    label: 'Рекомендации', icon: '⭐' },
    { to: '/new',                label: 'Новые',        icon: '🆕' },
    { to: '/favorites',          label: 'Избранное',    icon: '❤️' },
  ];

  // состояние фильтра по тегам
  const [allTags, setAllTags]           = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [likesOrder, setLikesOrder]     = useState(null); // 'asc' | 'desc' | null
  const [viewsOrder, setViewsOrder]     = useState(null); // 'asc' | 'desc' | null
  const [showFilters, setShowFilters]   = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/tags/')
      .then(res => setAllTags(res.data))
      .catch(console.error);
  }, []);

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

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFilteredTags([]);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const pickTag = tag => {
    setSelectedTags(prev => [...prev, tag]);
    setSearchTerm('');
  };

  const removeTag = slug => {
    setSelectedTags(prev => prev.filter(t => t.slug !== slug));
  };

  // Тоггл сортировки по лайкам: при включении сбрасываем просмотры
  const toggleLikesOrder = () => {
    setLikesOrder(prev => {
      const next = prev === 'desc' ? 'asc' : 'desc';
      if (next) setViewsOrder(null);
      return next;
    });
  };
  // Тоггл сортировки по просмотрам: при включении сбрасываем лайки
  const toggleViewsOrder = () => {
    setViewsOrder(prev => {
      const next = prev === 'desc' ? 'asc' : 'desc';
      if (next) setLikesOrder(null);
      return next;
    });
  };

  // --- слайдер дат + ручной ввод ---
  const ONE_DAY      = 24 * 60 * 60 * 1000;
  const minTs        = new Date('2023-01-01').getTime();
  const maxTs        = Date.now();
  const [dateRange, setDateRange] = useState([minTs, maxTs]);

  // Парам dateFrom/dateTo в формате YYYY-MM-DD
  const dateFrom = new Date(dateRange[0]).toISOString().slice(0,10);
  const dateTo   = new Date(dateRange[1]).toISOString().slice(0,10);

  // Когда вручную меняют поля, конвертим в timestamp и обновляем слайдер
  const onDateFromChange = e => {
    const ts = new Date(e.target.value).getTime();
    if (!isNaN(ts) && ts <= dateRange[1]) {
      setDateRange([ts, dateRange[1]]);
    }
  };
  const onDateToChange = e => {
    const ts = new Date(e.target.value).getTime();
    if (!isNaN(ts) && ts >= dateRange[0]) {
      setDateRange([dateRange[0], ts]);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    selectedTags.forEach(t => params.append('tag', t.slug));
    if (likesOrder)  params.set('likes_order', likesOrder);
    if (viewsOrder)  params.set('views_order', viewsOrder);
    params.set('date_from', dateFrom);
    params.set('date_to',   dateTo);
    const qs = params.toString();
    navigate(qs ? `/?${qs}` : `/`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setLikesOrder(null);
    setViewsOrder(null);
    setDateRange([minTs, maxTs]);
    navigate('/');
    setShowFilters(false);
  };

  return (
    <div
      className='bg-white border-end'
      style={{
        width: '240px',
        flex: '0 0 240px',
        height: 'calc(100vh - 68px)',
        overflowY: 'auto'
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

      {pathname === '/' && (
        <div className="p-3">
          <button
            className="btn btn-outline-secondary w-100 mb-2"
            onClick={() => setShowFilters(f => !f)}
          >
            Поиск по фильтрам
          </button>

          {showFilters && (
            <div ref={wrapperRef}>
              {/* Сортировка по лайкам */}
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-2"
                onClick={toggleLikesOrder}
              >
                По лайкам {likesOrder === 'asc' ? '↑' : likesOrder === 'desc' ? '↓' : ''}
              </button>

              {/* Сортировка по просмотрам */}
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-2"
                onClick={toggleViewsOrder}
              >
                По просмотрам {viewsOrder === 'asc' ? '↑' : viewsOrder === 'desc' ? '↓' : ''}
              </button>

              {/* Слайдер */}
              <div className="mt-2">
                <label className="form-label mb-0">Диапазон дат</label>
                <Range
                  step={ONE_DAY}
                  min={minTs}
                  max={maxTs}
                  values={dateRange}
                  onChange={setDateRange}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 6,
                        background: '#ddd',
                        margin: '15px 0'
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, index }) => (
                    <div {...props} style={{
                      ...props.style,
                      height:16, width:16,
                      backgroundColor:'#007bff', borderRadius:8
                    }}/>
                  )}
                />
                {/* Поля ввода */}
                <div className="d-flex justify-content-between">
                  <input 
                    type="date" 
                    value={dateFrom} 
                    onChange={onDateFromChange} 
                    style={{ flex: '1 1 40%', maxWidth: '100px', boxSizing: 'border-box' }}
                  />

                  <input
                    type="date"
                    value={dateTo}
                    onChange={onDateToChange}
                    style={{ flex: '1 1 40%', maxWidth: '100px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              
              {/* Фильтр по тегам */}
              <label htmlFor="tag-search" className="form-label mt-2 mb-1">Теги</label>
              <input
                id="tag-search"
                type="text"
                className="form-control mb-1"
                placeholder="Начните вводить…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
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
              {selectedTags.length > 0 && (
                <div className="mt-2">
                  {selectedTags.map(tag => (
                    <span key={tag.slug} className="badge bg-primary me-1 mb-1">
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

              {/* Очистить фильтры */}
              <button
                className="btn btn-secondary w-100 mt-2"
                onClick={clearFilters}
              >
                Очистить фильтры
              </button>

              {/* Применить */}
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={applyFilters}
              >
                Применить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

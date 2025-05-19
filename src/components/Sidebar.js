// src/components/Sidebar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Range } from 'react-range';
import { fetchSubscriptionsCount } from '../api';

// Constants
const ONE_DAY = 24 * 60 * 60 * 1000;
const MIN_TIMESTAMP = new Date('2023-01-01').getTime();
const MAX_TIMESTAMP = Date.now();

export default function Sidebar() {
  // Router hooks
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Ref for dropdown wrapper
  const wrapperRef = useRef(null);

  // State: new subscriptions badge
  const [newSubsCount, setNewSubsCount] = useState(0);

  // State: filter panel visibility
  const [showFilters, setShowFilters] = useState(false);

  // Tag filter states
  const [allTags, setAllTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Author filter states
  const [allAuthors, setAllAuthors] = useState([]);
  const [authorSearch, setAuthorSearch] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // Sorting states
  const [likesOrder, setLikesOrder] = useState(null); // 'asc' | 'desc' | null
  const [viewsOrder, setViewsOrder] = useState(null); // 'asc' | 'desc' | null

  // Date range state
  const [dateRange, setDateRange] = useState([MIN_TIMESTAMP, MAX_TIMESTAMP]);
  const dateFrom = new Date(dateRange[0]).toISOString().slice(0, 10);
  const dateTo = new Date(dateRange[1]).toISOString().slice(0, 10);

  // Navigation items
  const navItems = [
    { to: '/', label: 'Главная', iconSrc: '/SideBar/Home.png' },
    { to: '/subscriptions', label: 'Подписки', iconSrc: '/SideBar/Subscriptions.png', badge: newSubsCount },
    { to: '/popular', label: 'Популярное', iconSrc: '/SideBar/Popular.png' },
    { to: '/recommendations', label: 'Рекомендации', iconSrc: '/SideBar/Recommendations.png' },
    { to: '/new', label: 'Новые', iconSrc: '/SideBar/New.png' },
    { to: '/favorites', label: 'Избранное', iconSrc: '/SideBar/Favorites.png' },
  ];

  // Range component renderers
  const renderTrack = ({ props, children }) => (
    <div
      {...props}
      style={{
        position: 'relative',
        width: '100%',
        height: 6,
        background: '#ddd',
        margin: '15px 0',
      }}
    >
      {children}
    </div>
  );

  const renderThumb = ({ props }) => (
    <div
      {...props}
      style={{
        ...props.style,
        height: 16,
        width: 16,
        backgroundColor: '#007bff',
        borderRadius: 8,
      }}
    />
  );

  // Effects
  useEffect(() => {
    // Fetch tags
    axios.get('http://localhost:8000/api/tags/')
      .then(res => setAllTags(res.data))
      .catch(console.error);

    // Fetch authors
    axios.get('http://localhost:8000/api/users/')
      .then(res => setAllAuthors(res.data))
      .catch(console.error);

    // Fetch new subscriptions count
    fetchSubscriptionsCount()
      .then(count => setNewSubsCount(count))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Filter tags by searchTerm
    if (!searchTerm.trim()) {
      setFilteredTags([]);
      return;
    }
    const q = searchTerm.toLowerCase();
    setFilteredTags(
      allTags.filter(
        tag => tag.name.toLowerCase().startsWith(q) &&
               !selectedTags.some(t => t.slug === tag.slug)
      )
    );
  }, [searchTerm, allTags, selectedTags]);

  useEffect(() => {
    // Filter authors by authorSearch
    if (!authorSearch.trim()) {
      setFilteredAuthors([]);
      return;
    }
    const q = authorSearch.toLowerCase();
    setFilteredAuthors(
      allAuthors.filter(a => a.username.toLowerCase().startsWith(q))
    );
  }, [authorSearch, allAuthors]);

  useEffect(() => {
    // Close dropdowns on outside click
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFilteredTags([]);
        setFilteredAuthors([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const pickTag = tag => {
    setSelectedTags(prev => [...prev, tag]);
    setSearchTerm('');
  };

  const removeTag = slug => setSelectedTags(prev => prev.filter(t => t.slug !== slug));

  const pickAuthor = author => {
    setSelectedAuthor(author);
    setAuthorSearch('');
    setFilteredAuthors([]);
  };

  const removeAuthor = () => setSelectedAuthor(null);

  const toggleLikesOrder = () => {
    setLikesOrder(prev => {
      const next = prev === 'desc' ? 'asc' : 'desc';
      if (next) setViewsOrder(null);
      return next;
    });
  };

  const toggleViewsOrder = () => {
    setViewsOrder(prev => {
      const next = prev === 'desc' ? 'asc' : 'desc';
      if (next) setLikesOrder(null);
      return next;
    });
  };

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
    if (likesOrder) params.set('likes_order', likesOrder);
    if (viewsOrder) params.set('views_order', viewsOrder);
    if (selectedAuthor) params.set('author', selectedAuthor.username);
    params.set('date_from', dateFrom);
    params.set('date_to', dateTo);

    const query = params.toString();
    navigate(query ? `/?${query}` : '/');
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedAuthor(null);
    setLikesOrder(null);
    setViewsOrder(null);
    setDateRange([MIN_TIMESTAMP, MAX_TIMESTAMP]);
    navigate('/');
    setShowFilters(false);
  };

  return (
    <div
      className="custom-sidebar"  
      style={{ width: '240px', flex: '0 0 240px', height: 'calc(100vh - 68px)', overflowY: 'auto' }}
    >
      {/* Navigation */}
      <ul className="list-unstyled m-0 p-0">
        {navItems.map(item => {
          const active = pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`custom-sidebar-item d-flex align-items-center${active ? ' active' : ''}`}
              >
                <img src={item.iconSrc} alt="" className="sidebar-icon" />
                <span>{item.label}</span>
                {item.badge > 0 && <span className="badge bg-danger ms-auto">{item.badge}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Filters */}
      {pathname === '/' && (
        <div className="sidebar-filters">
          <button
            className="filter-btn"
            onClick={() => setShowFilters(v => !v)}
          >
            Поиск по фильтрам
          </button>

          {showFilters && (
            <div ref={wrapperRef}>
              {/* Sorting buttons */}
              <button
                className="filter-btn"
                onClick={toggleLikesOrder}
              >
                По лайкам {likesOrder === 'asc' ? '↑' : likesOrder === 'desc' ? '↓' : ''}
              </button>
              <button
                className="filter-btn"
                onClick={toggleViewsOrder}
              >
                По просмотрам {viewsOrder === 'asc' ? '↑' : viewsOrder === 'desc' ? '↓' : ''}
              </button>

              {/* Date slider */}
              <div className="mt-2">
                <label className="form-label mb-0">Диапазон дат</label>
                <Range
                  step={ONE_DAY}
                  min={MIN_TIMESTAMP}
                  max={MAX_TIMESTAMP}
                  values={dateRange}
                  onChange={setDateRange}
                  renderTrack={renderTrack}
                  renderThumb={renderThumb}
                />
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

              {/* Author filter */}
              <label className="form-label">Автор</label>
              <input
                type="text"
                className="form-control mb-1"
                placeholder="Введите имя…"
                value={authorSearch}
                onChange={e => setAuthorSearch(e.target.value)}
              />
              {filteredAuthors.length > 0 && (
                <ul className="list-group position-absolute" style={{ zIndex: 1000, width: 200 }}>
                  {filteredAuthors.map(a => (
                    <li
                      key={a.username}
                      className="list-group-item list-group-item-action"
                      onClick={() => pickAuthor(a)}
                    >
                      {a.username}
                    </li>
                  ))}
                </ul>
              )}
              {selectedAuthor && (
                <div className="mb-3">
                  <span className="badge bg-primary me-1 mb-1">
                    {selectedAuthor.username}
                    <button
                      type="button"
                      className="btn-close btn-close-white btn-sm ms-1"
                      onClick={removeAuthor}
                    />
                  </span>
                </div>
              )}

              {/* Tag filter */}
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

              {/* Action buttons */}
              <button
                className="filter-btn clear-btn"
                onClick={clearFilters}
              >
                Очистить фильтры
              </button>
              <button
                className="filter-btn apply-btn"
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
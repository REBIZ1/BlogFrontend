import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags]   = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag') || '';

  // Загрузка тегов один раз
  useEffect(() => {
    axios.get('http://localhost:8000/api/tags/')
      .then(res => setTags(res.data))
      .catch(console.error);
  }, []);

  // Загрузка постов при изменении selectedTag
  useEffect(() => {
    const url = selectedTag
      ? `http://localhost:8000/api/posts/?tag=${selectedTag}`
      : 'http://localhost:8000/api/posts/';

    axios.get(url)
      .then(response => setPosts(response.data))
      .catch(error => console.error('Ошибка при загрузке постов:', error));
  }, [selectedTag]);

  return (
    <>
      <Header />

      <div className="container py-4">
        <h1 className="mb-4">Список постов</h1>

        {/* Фильтр по тегам */}
        <div className="mb-4">
          <span className="me-2">Фильтр:</span>
          <button
            className={`btn btn-sm me-1 ${selectedTag === '' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSearchParams({})}
          >
            Все
          </button>
          {tags.map(tag => (
            <button
              key={tag.slug}
              className={`btn btn-sm me-1 ${
                selectedTag === tag.slug ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setSearchParams({ tag: tag.slug })}
            >
              #{tag.name}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                    {post.cover && (
                      <img
                        src={post.cover}
                        className="card-img-top"
                        alt="Обложка"
                        style={{ objectFit: "cover", height: "200px" }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text">
                        {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                      </p>
                      <div className="mt-auto">
                        <small className="text-muted">👁 {post.views}</small>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Постов пока нет.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header'
import '../App.css';

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/posts/')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке постов:', error);
      });
  }, []);

  return (
    <>
        <Header />
        <div className="page-background">
        <div className="container py-5">
            <h1 className="text-center mb-5">📚 Список постов</h1>

            <div className="grid-container">
            {posts.length > 0 ? (
                posts.map(post => (
                <div key={post.id} className="card grid-item shadow-sm">
                    <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {post.cover && (
                        <img
                        src={post.cover}
                        className="card-img-top"
                        alt="Обложка поста"
                        style={{ objectFit: "cover", height: "200px" }}
                        />
                    )}
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">
                        {post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content}
                        </p>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                        <small className="text-muted">👁 {post.views} просмотров</small>
                        </div>
                    </div>
                    </Link>
                </div>
                ))
            ) : (
                <p>Постов пока нет.</p>
            )}
            </div>
        </div>
        </div>
    </>
  );
}

export default HomePage;

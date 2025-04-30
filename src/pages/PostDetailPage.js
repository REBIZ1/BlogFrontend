import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

function PostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
      // загрузить пост
      axios.get(`http://localhost:8000/api/posts/${id}/`)
        .then(res => setPost(res.data))
        .catch(console.error);
    
      // Засечь время чтения + вызвать TrackPostView при уходе
      const start = Date.now();
      const handleUnload = () => {
        const seconds = Math.round((Date.now() - start) / 1000);
        if (seconds < 8) return;
    
        const token = localStorage.getItem('access');
        fetch('http://localhost:8000/api/track/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ post_id: id, seconds })
        });
      };
    
      window.addEventListener('beforeunload', handleUnload);
      return () => {
        handleUnload();
        window.removeEventListener('beforeunload', handleUnload);
      };
    }, [id]);
    

    if (!post) return <p>загрузка...</p>;

    return (
        <>
          <Header />
          <div className="container py-5">
            <h1>{post.title}</h1>
            {post.cover && (
              <img
                src={post.cover}
                alt="Обложка поста"
                style={{ width: "100%", maxHeight: "400px", objectFit: "cover", marginBottom: "20px" }}
              />
            )}
            <p>{post.content}</p>
            <p className="text-muted">👁 Просмотров: {post.views}</p>
          </div>
        </>
      );
    }

export default PostDetailPage;
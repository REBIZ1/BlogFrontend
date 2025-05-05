import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function FavoritesPage() {
    const navigate = useNavigate();
    const [likes, setlikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (!token) {
            return navigate('/login', { replace: true });
        }

        axios.get(`http://localhost:8000/api/accounts/favorites/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setlikes(res.data);
        })
        .catch(err => {
            console.error('Ошибка при загрузке избранных статей', err);
            // Если токен просрочен или не верен - редирект на логин
            if (err.response && err.response.status === 401) {
                navigate('/login', {replace: true });
            }
        })
        .finally(() => {
            setLoading(false);
        }); 
    }, [navigate]);

    if (loading) return <p>Загрузка избранных статей...</p>
    if (likes.length === 0) return <p>Ваш список избранных статей пуст.</p>

    return (
        <div>
            {likes.map(entry => (
                <div key={entry.id} className='card mb-3'>
                    <div className='row g-0'>
                            {entry.post.cover && (
                                <div className='col-md-4'>
                                    <img
                                    src={entry.post.cover}
                                    alt='Обложка статьи'
                                    className='img-fluid rounded-start'
                                    />
                                </div>
                            )}
                            <div className='col-md-8'>
                                <div className='card-body'>
                                    <h5 className='card-title'>
                                        <Link to={`/post/${entry.post.id}`}>
                                            {entry.post.title}
                                        </Link>
                                    </h5>
                                    <p className='card-text text-truncate'>
                                        {entry.post.content}
                                    </p>
                                </div>
                            </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
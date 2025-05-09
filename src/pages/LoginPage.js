import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')

        try {
            const response = await axios.post('http://localhost:8000/api/token/', formData);
            const { access, refresh } = response.data;
      
            // Сохраняем токены в localStorage
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);

            const userResponse = await axios.get('http://localhost:8000/api/accounts/profile/', {
                headers: {
                    Authorization: `Bearer ${access}`
                }    
            });

            const userData = userResponse.data;
            localStorage.setItem('username', userData.username);
            if (userData.avatar) {
              localStorage.setItem('avatar', userData.avatar);
            } else {
              localStorage.removeItem('avatar');
            }        

            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Неверный логин или пароль!')
        }
    };

    return (
        <>
            <Header />
            <div className="container py-5">
                <h2 className="text-center mb-4">Вход в аккаунт</h2>
                <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
                    <div className="mb-3">
                        <label className="form-label">Логин:</label>
                        <input 
                        type="text"
                        name="username"
                        value={formData.username}
                        className="form-control"
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Пароль:</label>
                        <input
                        type="password"
                        name="password"
                        value={formData.password}
                        className="form-control"
                        onChange={handleChange}
                        required
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100">Войти</button>

                    <p className="py-4">Нет аккаунта? <a href="/register">Зарегистрироваться.</a></p>
                </form>
            </div>
        </>
    );
}

export default LoginPage;
// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Переключить подписку, возвращает 'followed' или 'unfollowed'
export async function toggleFollow(authorUsername) {
  const token = localStorage.getItem('access');
  const resp = await API.post(
    'follow/',
    { author: authorUsername },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data.status;
}

// Получить текущие подписки
export async function fetchFollows() {
  const token = localStorage.getItem('access');
  const resp = await API.get(
    'follow/',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data; // массив объектов { author_username, … }
}

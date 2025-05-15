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

// Получить число новых постов от подписанных авторов
export async function fetchSubscriptionsCount() {
  const token = localStorage.getItem('access');
  const resp = await API.get(
    'subscriptions/count/',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data.count;  // например, 5
}

// Получить список постов от подписанных авторов и сбросить счётчик
export async function fetchSubscriptionsPosts() {
  const token = localStorage.getItem('access');
  const resp = await API.get(
    'subscriptions/',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data; // массив постов
}
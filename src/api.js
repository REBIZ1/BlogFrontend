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

// src/api.js
export async function fetchContentRecommendations() {
  const token = localStorage.getItem('access');
  const resp = await API.get(
    'recommendations/content/',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data; // массив постов
}


export async function fetchCFRecommendations() {
  const token = localStorage.getItem('access');
  try {
    const resp = await API.get('recommendations/cf/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return resp.data;
  } catch (err) {
    console.error('CF fetch error data:', err.response?.data);
    throw err;
  }
}


export async function fetchHybridRecommendations(alpha = 0.6, n = 10) {
  const token = localStorage.getItem('access');
  const resp = await API.get(
    `recommendations/hybrid/`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { alpha, n }
    }
  );
  return resp.data;
}
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AccountDashboard from './pages/AccountDashboard'
import CreatePostPage from './pages/account/CreatePostPage'
import FavoritesPage   from './pages/account/FavoritesPage'
import HistoryPage     from './pages/account/HistoryPage'
import SettingsPage    from './pages/account/SettingsPage'
import 'react-quill/dist/quill.snow.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/post/:id' element={<PostDetailPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />

        {/* Личный кабинет: общий лэйаут и вложенные вкладки */}
        <Route path="/account"     element={<AccountDashboard />}>
        <Route index             element={<CreatePostPage />} />
        <Route path="create"     element={<CreatePostPage />} />
        <Route path="favorites"  element={<FavoritesPage />} />
        <Route path="history"    element={<HistoryPage />} />
        <Route path="settings"   element={<SettingsPage />} />

        {/* Можно добавить 404 */}
        <Route path="*" element={<p>Страница не найдена</p>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

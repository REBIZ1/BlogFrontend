import { useEffect, useState } from 'react';
import axios from 'axios';

export function useTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/tags/')
      .then(res => setTags(res.data))
      .catch(err => {
        console.error('Ошибка при загрузке тегов:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { tags, loading, error };
}

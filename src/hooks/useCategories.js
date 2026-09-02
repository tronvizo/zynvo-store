import { useState, useEffect, useCallback } from 'react';
import { getCategories } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
      const map = {};
      data.forEach(c => {
        map[c.id] = c.name;
      });
      setCategoriesMap(map);
    } catch (err) {
      console.error("useCategories error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, categoriesMap, loading, error, refreshCategories: fetchCategories };
}

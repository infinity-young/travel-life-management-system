import { useState, useEffect } from 'react';
import axios from 'axios';
import { BATH_PATH } from '../config/requestConfig';

export function useFetchData(url, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(BATH_PATH+url, { params });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      } 
    };

    fetchData();
  }, [url, params]);

  return { data, loading, error };
}

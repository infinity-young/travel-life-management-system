import { useState, useEffect } from 'react';
import axios from 'axios';
import { BATH_PATH } from '../config/requestConfig.ts';

export function useJSONData(url, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const JSONData = async () => {
      try {
        setLoading(true);
          const response = await axios.post(BATH_PATH+url, params, {
              headers: {
                'Content-Type': 'application/json',
              },
              responseType: 'json'
          });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    JSONData();
  }, [url, params]);

  return { data, loading, error };
}
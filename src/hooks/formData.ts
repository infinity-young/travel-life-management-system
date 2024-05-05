import { useState, useEffect } from 'react';
import axios from 'axios';
import { BATH_PATH } from '../config/requestConfig.ts';

export function useFormData(url, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const FormData = async () => {
      try {
        setLoading(true);
          const response = await axios.post(BATH_PATH+url, params, {
              headers: {
                  'Content-Type': 'multipart/form-data',
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
    FormData();
  }, [url, params]);

  return { data, loading, error };
}
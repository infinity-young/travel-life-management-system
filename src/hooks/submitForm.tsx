import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormData } from './formData.ts'; // 假设这是封装了网络请求的自定义 Hook
import React from 'react';

export function useSubmitForm(initialValues, path) {
  const [formData, setFormData] = useState(initialValues);
  const { data, loading, error } = useFormData(path, formData);

  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("提交成功");
        // 处理成功逻辑
      } else {
        toast.error("提交失败");
        // 处理失败逻辑
      }
    }
    if (error) {
      toast.error(`Error: ${error?.message}`);
    }
    // if (loading) {
    //   // 展示loading图标
    //   toast.info(<CircularProgress />, {
    //     // position: toast.POSITION.TOP_CENTER,
    //     autoClose: 5000,
    //   });
    // }
  }, [data, loading, error]);

  const validateForm = () => {
    // 校验逻辑
    const newErrors = {};
    let isValid = true;
    // 校验逻辑
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        isValid = false;
        newErrors[key] = 'This field is required';
        toast.error(`Error: ${newErrors[key]}`); // 显示错误toast提示
      }
    });
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    // 准备更新 formData 状态，以触发 useFormData Hook 发送网络请求
    setFormData({ ...formData });
  };

  return {
    formData,
    setFormData,
    handleSubmit,
  };
}

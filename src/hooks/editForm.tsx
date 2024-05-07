import { useState } from 'react';
import { toast } from 'react-toastify';

export function useEditForm(initialValues,path) {
  const [formData, setFormData] = useState(initialValues);
  const [isVisible, setIsVisible] = useState(false);

  function toggleModal() {
    setIsVisible(!isVisible);
  }

  const validateForm = () => {
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
  const handleSubmit = async (closeModal) => {
    if (!validateForm()) return;
    try {
      // 发送更新请求等逻辑
      const fd = new FormData();
      fd.append('enableStatus', 'ALL');
      // const response = await updateData(formData);
      closeModal();
    } catch (error) {
      toast.error(`Error: ${error}`); // 显示错误toast提示
    }
  };


  return {
    formData,
    setFormData,
    handleSubmit,
    toggleModal
  };
}

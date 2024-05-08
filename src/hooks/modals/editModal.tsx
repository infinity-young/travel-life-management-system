import React, { useState, useCallback } from 'react';
import styles from './index.module.scss'
import { useSubmitForm } from '../submitForm.ts';
import { HEADLINE_ADD_PATH } from '../../config/requestConfig.ts';


// 弹窗UI组件
const Modal = ({ isVisible, onClose,onSubmit,onReset, children }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {children}
        <div className={styles.buttonContainer}>
          {onClose && <button onClick={onClose}>关闭</button>} 
          {onSubmit&& <button onClick={onSubmit}>提交</button>}
         {onReset&& <button onClick={onReset}>重置</button>}
       </div>
      </div>
    </div>
  );
};

// useModal Hook，封装了弹窗的状态和UI渲染
export function useModal(onSubmit,onReset) {
  const [isVisible, setIsVisible] = useState(false);
  const { formData, setFormData, handleSubmit } = useSubmitForm([], HEADLINE_ADD_PATH);


 //开关弹窗
  const toggleModal = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  //提交数据
  const submitModal = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
    setIsVisible(false); // 关闭弹窗
  }, [onSubmit]);

//重置弹窗数据
  const resetModal = useCallback(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);


  // 渲染弹窗UI的函数
  const renderModal = useCallback(
    (content) => (
      <Modal isVisible={isVisible} onClose={toggleModal} onReset={resetModal} onSubmit={submitModal}>
        {content}
      </Modal>
    ),
    [isVisible, toggleModal]
  );

  return {
    isVisible,
    toggleModal,
    renderModal,
    submitModal,
    resetModal
  };
}
import React, { useState, useCallback } from 'react';
import styles from './index.module.scss'


// 弹窗UI组件
const Modal = ({ isVisible, onClose,onSubmit,onReset, children }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {children}
        <div className={styles.buttonContainer}>
          <button onClick={onClose}>关闭</button>
          <button onClick={onSubmit}>提交</button>
          <button onClick={onReset}>重置</button>
       </div>
      </div>
    </div>
  );
};

// useModal Hook，封装了弹窗的状态和UI渲染
export function useModal(onSubmit,onReset) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleModal = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);
  const submitModal = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
    setIsVisible(false); // 关闭弹窗
  }, [onSubmit]);

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
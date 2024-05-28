import React, { useState, useCallback } from 'react';
import styles from './index.module.scss'


// 弹窗UI组件
const Modal = ({ isVisible, onClose,onSubmit,onReset, children }) => {
  if (!isVisible) return null;
  console.log("=====onReset====",onReset)

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {children}
        <div className={styles.buttonContainer}>
          {onClose && <button onClick={onClose} className={styles.button}>关闭</button>} 
          {onSubmit&& <button onClick={onSubmit} className={styles.button}>提交</button>}
         {onReset&& <button onClick={onReset} className={styles.button}>重置</button>}
       </div>
      </div>
    </div>
  );
};

// useModal Hook，封装了弹窗的状态和UI渲染
export function useModal(onSubmit,onReset?) {
  const [isVisible, setIsVisible] = useState(false);


 //开关弹窗
  const toggleModal = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  //提交数据
  const submitModal = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
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
    resetModal,
    setIsVisible
  };
}
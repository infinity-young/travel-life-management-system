import React, { useState, useCallback } from 'react';
import styles from './index.module.scss'


// 弹窗UI组件
const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {children}
        <button onClick={onClose}>关闭</button>
      </div>
    </div>
  );
};

// useModal Hook，封装了弹窗的状态和UI渲染
export function useModal() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleModal = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);
  //todo 提交编辑信息成功应该向外部暴露回调方便页面刷新，页面成功失败都应该有toast提示


  // 渲染弹窗UI的函数
  const renderModal = useCallback(
    (content) => (
      <Modal isVisible={isVisible} onClose={toggleModal}>
        {content}
      </Modal>
    ),
    [isVisible, toggleModal]
  );

  return {
    isVisible,
    toggleModal,
    renderModal,
  };
}
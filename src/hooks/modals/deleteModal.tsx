import React, { useState, useCallback } from 'react';
import styles from './index.module.scss'


const useConfirmDelete = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);
    
  //todo 删除成功应该向外部暴露回调方便页面刷新，接口成功失败都应该有toast提示
 

  const ConfirmDeleteModal = ({ onConfirm }) => {
      if (!isDeleteModalOpen) return null;

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <p>确定要永久删除该数据吗？</p>
            <div className={styles.buttonContainer}>
                <button onClick={() => { onConfirm(); closeDeleteModal(); }}>确认</button>
                <button onClick={closeDeleteModal}>再想想</button>
          </div>
        </div>
      </div>
    );
  };

  return { ConfirmDeleteModal, openDeleteModal, closeDeleteModal };
};

export default useConfirmDelete;

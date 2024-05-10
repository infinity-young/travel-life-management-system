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

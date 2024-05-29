import React from 'react';
import styles from './index.module.scss'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//弹窗
export const showToast = (message) => {
  toast(message, {
    position: "top-center", // 顶部居中
    autoClose: 1000, // 5秒后自动关闭
    hideProgressBar: false, // 显示进度条
    closeOnClick: true, // 点击可关闭
    pauseOnHover: true, // 鼠标悬停时暂停
    draggable: true, // 可拖动
    progress: undefined,
  });
};


// 输入框组件
export const InputItem: React.FC<InputItemProps> = ({ title, onInputChange, value = '',placeholder="" }) => {
  return (
    <li className={styles.container}>
      <label className={styles.title}>{title}</label>
      <input
        type="text"
        onChange={(e) => onInputChange(e.target.value)}
        className={styles.box}
        value={value} // 使用受控组件的值
        placeholder={placeholder}
      />
    </li>
  );
};

// 选择框组件
export const SelectItem = ({
  title,
  options,
  onSelectChange,
  value = -1
}) => {
  return (
    <li className={styles.container}>
      <label className={styles.title}>{title}</label>
      <select
        onChange={(e) => onSelectChange(e.target.value)}
        className={styles.box}
        value={value} // 使用受控组件的值
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </li>
  );
};

// 图片上传按钮组件不需要改变，因为文件输入通常不作为受控组件处理
export const ImageUploadItem = ({
  title,
  onImageUpload,
}) => {
  return (
    <li className={styles.container}>
      <label className={styles.title}>{title}</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageUpload(e.target.files[0])}
        className={styles.box}
      />
    </li>
  );
};




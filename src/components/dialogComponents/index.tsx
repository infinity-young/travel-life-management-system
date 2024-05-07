import React from 'react';
import styles from './index.module.scss'
// 输入框组件
export const InputItem = ({ title, onInputChange, defaultValue = '' }) => {
    return (
      <li className={styles.container}>
        <label className={styles.title}>{title}</label>
        <input
          type="text"
          onChange={(e) => onInputChange(e.target.value)}
          className={styles.value}
          defaultValue={defaultValue} // 使用默认值
        />
      </li>
    );
  };
  
  // 选择框组件
  export const SelectItem = ({
    title,
    options,
    onSelectChange,
    defaultValue = ''
  }) => {
    return (
      <li className={styles.container}>
        <label className={styles.title}>{title}</label>
        <select
          onChange={(e) => onSelectChange(e.target.value)}
          className={styles.value}
          value={defaultValue} // 使用默认值
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
  
  // 图片上传按钮组件
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
          className={styles.value}
        />
      </li>
    );
  };
  
  
import styles from './index.module.scss'
import React from 'react';
// 输入框组件
export const InputComponent = ({ title, placeholder = "", onSearch }) => {
    let inputValue = ''
    const onInputChange = (e) => {
      inputValue=e
    }
    const onInputSearch = () => {
        onSearch(inputValue)
    }

    return (
      <li className={styles.container}>
        <label className={styles.title}>{title}</label>
        <input
          type="text"
          onChange={(e) => onInputChange(e.target.value)}
          className={styles.value}
          placeholder={placeholder}
            />
            <button onClick={onInputSearch}>搜索</button>
      </li>
    );
};
  

export const FilterComponent = ({
  options,
  onSelectChange,
  value = 0
}) => {
  return (
      <select
        onChange={(e) => onSelectChange(e.target.value)}
      value={value} // 使用受控组件的值
      className={styles.filterBox}
       >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
  );
};
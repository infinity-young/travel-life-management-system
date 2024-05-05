import { HEADLINE_GET_PATH } from '../config/requestConfig.ts';
import React, { useMemo, useState } from 'react';
import { useFormData } from '../hooks/formData.ts';

const TableComponent = () => {
  const [filter, setFilter] = useState('');
    //以formdata的形式提交数据
     // 使用useMemo来确保formData只在组件首次渲染时创建一次
  const formData = useMemo(() => {
    const fd = new FormData();
    fd.append('enableStatus', 'ALL');
    return fd;
  }, []);

    const { data=[] } = useFormData(HEADLINE_GET_PATH, formData);

  // 筛选数据的函数（示例中未实现筛选逻辑）
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    // 在这里可以添加筛选逻辑
  };

  // 新增数据的函数（示例中未实现新增逻辑）
  const handleAdd = () => {
    // 在这里可以添加新增数据的逻辑
  };

  // 删除数据的函数（示例中未实现删除逻辑）
  const handleDelete = () => {
    // 在这里可以添加删除数据的逻辑
  };
    if (!data) {
      return <></>
    } 
  return (
    <div>
      <div>
        <button onClick={handleAdd}>新增</button>
        <button onClick={handleDelete}>删除</button>
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="筛选..."
        />
      </div>
      <table>
        <thead>
          <tr>
            {/* 表头内容 */}
            <th>头条名称</th>
            <th>头条链接</th>
            <th>头条图片</th>
            <th>优先级</th>
            <th>头条状态</th>
            <th>创建时间</th>
            <th>最近修改时间</th>
            <th>操作</th>
            {/* 更多列 */}
          </tr>
        </thead>
        <tbody>
          {/* 表格数据渲染 */}
          {data.rows.map((row, index) => (
            <tr key={index}>
              <td>{row.lineName}</td>
              <td>{row.lineLink}</td>
              <td>{row.lineImg}</td>
                  <td>{row.priority}</td>
                  <td>{row.enableStatus}</td>
                  <td>{row.createTime}</td>
                  <td>{row.lastEditTime}</td>
                  <td>{row.lastEditTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

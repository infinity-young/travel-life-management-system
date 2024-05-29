import { HEADLINE_GET_PATH, IMAGE_PATH } from '../../config/requestConfig.ts';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss'
import {FilterComponent} from '../../components/headComponents/index.tsx'
import { postRequestFormData } from '../../request/index.ts';
import { formatDate } from '../../utils/dateUtil.ts';
import commonStyles from '../../styles/common.module.scss'
import { AddButton, DeleteButton, EditButton, PatchDeleteButton } from './Button.tsx';
import { DataType, ResponseData } from '../../model/ResponseData.ts';
import { HeadLineResponseType } from '../../model/HeadLineResponse.ts';
import { HeadLineType } from '../../model/HeadLine.ts';

const HealineComponent = () => {
  const [filter, setFilter] = useState(-1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [data, setData] = useState({rows:[]});
  //以formdata的形式提交数据
  // 使用useMemo来确保formData只在组件首次渲染时创建一次,否则会陷入循环调用
  const formData = useMemo(() => {
    const fd = new FormData();
    fd.append('enableStatus', filter.toString());
    return fd;
  }, [filter]);
  const fetchData = async () => {
    try {
      const requestData = await postRequestFormData<HeadLineResponseType.t>(HEADLINE_GET_PATH, formData);
      const data:DataType<HeadLineResponseType.t> = requestData.data||{} as DataType<HeadLineResponseType.t>;
      const formedData:HeadLineResponseType.safe_t=HeadLineResponseType.from(data)
      setData(formedData); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // 定义一个异步函数来发送请求，网络请求是副作用，应该放在此处
    fetchData(); // 调用异步函数
  }, [formData]); // 依赖数组中包含了 formData

  // 筛选数据的函数
  const handleFilterChange = (value) => {
    setFilter(value);
  };
  const handleChange = (event, id) => {
    // 将选中的元素添加到待删除框
    if (event.target.checked) {
      // 如果选中，将id添加到数组中
      setSelectedIds((prevSelectedIds) => {
        return [...prevSelectedIds, id]
      });
    } else {
      // 如果取消选中，将id从数组中移除
      setSelectedIds((prevSelectedIds) => prevSelectedIds.filter((prevId) => prevId !== id));
    }
  };
  const selectOptions = [{ value: -1, label: "全部" }, { value: 1, label: "启用" }, { value: 0, label: "禁用" }]
  const headLineType = {
    0:'禁用',
    1: '启用'
  }
  if (!data||!data.rows) {
      return <></>
  } 
  return (
    <div>
      <h1  className={commonStyles.pageTitle}>头条管理</h1>
      <div className={commonStyles.headContainer}>
        <AddButton fetchData={fetchData}/>
        <PatchDeleteButton selectedIds={selectedIds} fetchData={fetchData}/>
        <FilterComponent options={selectOptions} value={ filter} onSelectChange={handleFilterChange}  />
      </div>
      {data.rows.length>0&&<table className={styles.table}>
        <thead>
          <tr>
            <th>选择</th>
            <th>头条名称</th>
            <th>头条链接</th>
            <th>头条图片</th>
            <th>优先级</th>
            <th>头条状态</th>
            <th>创建时间</th>
            <th>最近修改时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row:HeadLineType.safe_t, index:number) => (
              <tr key={index}>
              <td>
                <input type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.includes(row.lineId)}
                  onChange={(e) => handleChange(e, row.lineId)}
                />
              </td>
              <td>{row.lineName}</td>
              <td>{row.lineLink}</td>
              <td>
              <img
                src={row.lineImg ? IMAGE_PATH + row.lineImg : ''}
                alt={row.lineName}
              />
              </td>              
              <td>{row.priority}</td>
              <td>{headLineType[row.enableStatus]}</td>
              <td>{formatDate(row.createTime)}</td>
              <td>{formatDate(row.lastEditTime)}</td>
              <td>
                <div className={styles.tableButtonContainer}>
                  <EditButton row={row} fetchData={fetchData} />
                  <DeleteButton row={row} fetchData={fetchData} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
      {data.rows.length<=0&&<div className={styles.noneContent}>筛选结果为空，请切换筛选条件</div>}
    </div>
  );
};

export default HealineComponent;

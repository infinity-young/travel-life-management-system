import { HEADLINE_GET_PATH, IMAGE_PATH } from '../../config/requestConfig.ts';
import React, { useMemo, useState } from 'react';
import { useFormData } from '../../hooks/formData.ts';
import styles from './index.module.scss'
import { useModal } from '../../hooks/modals/editModal.tsx';
import useConfirmDelete from '../../hooks/modals/deleteModal.tsx';

//编辑按钮
const EditButton=()=>{
  const { renderModal, toggleModal } = useModal();

  return (
    <>
      <button onClick={toggleModal}>编辑</button>
      {renderModal(
        <div>这里是弹窗内容，如表单输入等</div>
      )}
    </>
  );
}

//删除按钮
const DeleteButton = () => {
  const { ConfirmDeleteModal, openDeleteModal } = useConfirmDelete();

  // 删除操作的逻辑
  const handleDelete = () => {
    // 执行实际的删除操作
    console.log('项目已删除');
  };

  return (
    <div>
      <button onClick={openDeleteModal}>删除</button>
      <ConfirmDeleteModal onConfirm={handleDelete} />
    </div>
  );
};

//新增按钮
const AddButton=()=>{
  const { renderModal, toggleModal } = useModal();

  return (
    <>
      <button onClick={toggleModal}>新增头条</button>
      {renderModal(
        <div>这里是弹窗内容，如表单输入等</div>
      )}
    </>
  );
}
//批量删除按钮 todo
const PatchDeleteButton =({ selectedIds }) => {
  const { ConfirmDeleteModal, openDeleteModal } = useConfirmDelete();
  console.log("=======",selectedIds)
  // 删除操作的逻辑
  const handleDelete = () => {
    // 执行实际的删除操作
    console.log('项目已删除');
  };

  return (
    <div>
      <button onClick={openDeleteModal}>批量删除头条</button>
      <ConfirmDeleteModal onConfirm={handleDelete} />
    </div>
  );
}

const TableComponent = () => {
  const [filter, setFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
    //以formdata的形式提交数据
     // 使用useMemo来确保formData只在组件首次渲染时创建一次
  const formData = useMemo(() => {
    const fd = new FormData();
    fd.append('enableStatus', 'ALL');
    return fd;
  }, []);

    const { data=[] } = useFormData(HEADLINE_GET_PATH, formData);

  // 筛选数据的函数（示例中未实现筛选逻辑） todo
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    // 在这里可以添加筛选逻辑
  };



  const handleChange = (event, id) => {
    //将选中的元素添加到待删除框
    if (event.target.checked) {
      // 如果选中，将id添加到数组中
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
    } else {
      // 如果取消选中，将id从数组中移除
      setSelectedIds((prevSelectedIds) => prevSelectedIds.filter((prevId) => prevId !== id));
    }
  }
  if (!data) {
      return <></>
    } 
  return (
    <div>
      <div className={styles.headContainer}>
        <AddButton/>
        <PatchDeleteButton selectedIds={selectedIds}/>
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="筛选..."
        />
      </div>
      <table className={styles.table}>
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
          {data.rows.map((row, index) => (
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
                  <td><img
               key={index}
               src={IMAGE_PATH+row.lineImg}
               /></td>              
              <td>{row.priority}</td>
              <td>{row.enableStatus}</td>
              <td>{row.createTime}</td>
              <td>{row.lastEditTime}</td>
              <td> <div><EditButton /> <DeleteButton/></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

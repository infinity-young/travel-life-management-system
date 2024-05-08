import { HEADLINE_ADD_PATH, HEADLINE_GET_PATH, IMAGE_PATH } from '../../config/requestConfig.ts';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormData } from '../../hooks/formData.ts';
import styles from './index.module.scss'
import { useModal } from '../../hooks/modals/editModal.tsx';
import useConfirmDelete from '../../hooks/modals/deleteModal.tsx';
import { ImageUploadItem, InputItem, SelectItem } from '../../components/dialogComponents/index.tsx';
import { useSubmitForm } from '../../hooks/submitForm.tsx';

//编辑按钮
const EditButton = (data) => {
  const [renderFormData, setRenderFormData] = useState(data?.row || {});
  useEffect(() => {
    console.log("renderFormData has been updated", renderFormData);
  }, [renderFormData]); 
  const submitForm = () => {
    // console.log("=====submit=====",row)
    
  }
  const resetForm = () => {
    const resetItem = {
      lineName: '',
      lineLink: '',
      priority: 0,
      enableStatus: 0,
      lineImg:'',
    }
    const newRenderFormData = { ...renderFormData, ...resetItem }
    setRenderFormData(newRenderFormData);
  }
  const { renderModal, toggleModal } = useModal(submitForm,resetForm);
  const handleSelectChange = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, enableStatus: e};
    });
  }
  const handleImageUpload = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, lineImg: e};
    });
  }
  const selectOptions = [ { value: 0, label: '禁用' },
  { value: 1, label: '启用' }]
   
  // const { formData, setFormData, handleSubmit } = useSubmitForm([], HEADLINE_ADD_PATH);
  // console.log("==row===", row)
  // console.log("==row.lineName===",row.row.lineName)
  const handleTitleInputChange = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, lineName: e};
    });
  }
  const handleLinkInputChange = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, lineLink: e};
    });
  }
  const handlePriorityInputChange = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, priority: e};
    });
  }
  return (
    <>
      <button onClick={toggleModal}>编辑</button>
      {renderModal(
        <div className={styles.dialogContainer}>
           <p>头条编辑</p>
          <InputItem title="头条名称" onInputChange={handleTitleInputChange} value={ renderFormData.lineName} />
          <InputItem title="头条链接" onInputChange={handleLinkInputChange} value={renderFormData.lineLink} />
          <ImageUploadItem title="头条图片" onImageUpload={handleImageUpload}  />
          <InputItem title="优先级" onInputChange={handlePriorityInputChange} value={renderFormData.priority } />
          <SelectItem title="状态" options={selectOptions} value={ renderFormData.enableStatus} onSelectChange={handleSelectChange} />
        </div>
      )}
    </>
  );
}

//删除按钮
const DeleteButton = (row) => {
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
const AddButton = () => {
  const defaultValue = {
    lineName: '',
    lineLink: '',
    priority: 0,
    enableStatus: 0,
    lineImg:'',
  }
  const [renderFormData, setRenderFormData] = useState(defaultValue);
  const { formData, setFormData, handleSubmit } = useSubmitForm([], HEADLINE_ADD_PATH);
  const renderFormDataRef = useRef(renderFormData);

useEffect(() => {
  renderFormDataRef.current = renderFormData;
}, [renderFormData]);

const submitForm = () => {
  setFormData(renderFormDataRef.current);
};
  const resetForm = () => {
    const resetItem = {
      lineName: '',
      lineLink: '',
      priority: '',
      enableStatus: 0,
      lineImg:'',
    }
    const newRenderFormData = { ...renderFormData, ...resetItem }
    setRenderFormData(newRenderFormData);
  }
  const { renderModal, toggleModal } = useModal(submitForm,resetForm);
  const handleSelectChange = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, enableStatus: e};
    });
  }
  const handleImageUpload = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, lineImg: e};
    });
  }
  const selectOptions = [ { value: 0, label: '禁用' },
  { value: 1, label: '启用' }]
   
  const handleTitleInputChange = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, lineName: e};
    });
  }
  const handleLinkInputChange = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, lineLink: e};
    });
  }
  const handlePriorityInputChange = (e) => {
    setRenderFormData(prevFormData => {
      return {...prevFormData, priority: e};
    });
  }
  return (
    <>
      <button onClick={toggleModal}>新增头条</button>
      {renderModal(
        <div className={styles.dialogContainer}>
           <p>头条编辑</p>
          <InputItem title="头条名称" onInputChange={handleTitleInputChange} value={ renderFormData.lineName} />
          <InputItem title="头条链接" onInputChange={handleLinkInputChange} value={renderFormData.lineLink} />
          <ImageUploadItem title="头条图片" onImageUpload={handleImageUpload}  />
          <InputItem title="优先级" onInputChange={handlePriorityInputChange} value={renderFormData.priority } />
          <SelectItem title="状态" options={selectOptions} value={ renderFormData.enableStatus} onSelectChange={handleSelectChange} />
        </div>
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
              <td> <div><EditButton row={row} /> <DeleteButton row={row} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

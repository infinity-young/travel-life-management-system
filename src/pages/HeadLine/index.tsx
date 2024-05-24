import { HEADLINE_ADD_PATH, HEADLINE_BATCH_DELETE_PATH, HEADLINE_DELETE_PATH, HEADLINE_EDIT_PATH, HEADLINE_GET_PATH, IMAGE_PATH } from '../../config/requestConfig.ts';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss'
import { useModal } from '../../hooks/modals/editModal.tsx';
import useConfirmDelete from '../../hooks/modals/deleteModal.tsx';
import { FilterItem, ImageUploadItem, InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import { postRequestFormData, postRequestJson } from '../../request/index.ts';
//todo 刷新状态问题

//编辑按钮
const EditButton = ({row,setFilter}) => {
  //如果直接引用会导致父组件img标签渲染异常
  const initState = {...row} || {};
  delete initState.lineImg;
  delete initState.createTime;
  delete initState.lastEditTime;
  const [renderFormData, setRenderFormData] = useState(initState);
  const renderFormDataRef = useRef(renderFormData);
useEffect(() => {
  renderFormDataRef.current = renderFormData;
}, [renderFormData]);
const submitForm = async () => {
  // 校验是否都输入
  const validatedResult = validateForm(renderFormDataRef.current);
  // 校验通过发起请求
  if (validatedResult.isValidated) {
    const headLineObj = { ...renderFormDataRef.current };
    delete headLineObj.lineImg; // 如果你不需要lineImg，取消这行注释
    const headLineStr = JSON.stringify(headLineObj);
    const fd = new FormData();
    if (renderFormDataRef.current.lineImg) {
      fd.append('headTitleManagementEdit_lineImg', renderFormDataRef.current.lineImg);
    } else {
      fd.append('headTitleManagementEdit_lineImg', '');
    }
    fd.append('headLineStr', headLineStr);

    try {
      const requestData = await postRequestFormData(HEADLINE_EDIT_PATH, fd);
      //提交成功toast提示并关闭弹窗
      if (requestData.data?.success) {
        showToast('提交成功');
         //刷新逻辑
         setFilter(-1)
        toggleModal()
      } else {
        //提交失败
        showToast('提交失败')
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } else {
    const message = validatedResult.unvalidatedKey + '是必填项';
    showToast(message);
  }
};
  const resetForm = () => {
    const resetItem = {
      lineName: '',
      lineLink: '',
      priority: '',
      enableStatus: 0,
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
const DeleteButton = ({row,setFilter}) => {
  const { ConfirmDeleteModal, openDeleteModal ,closeDeleteModal} = useConfirmDelete();

  // 删除操作的逻辑
  const handleDelete = async () => {
    const params={headLineId:row?.lineId}
    const responseData = await postRequestJson(HEADLINE_DELETE_PATH,{},params)
    if (responseData.data?.success) {
      setFilter("ALL");
      showToast('删除成功');
      closeDeleteModal()
    } else {
      showToast('删除失败')
    }
  };

  return (
    <div>
      <button onClick={openDeleteModal}>删除</button>
      <ConfirmDeleteModal onConfirm={handleDelete} />
    </div>
  );
};

//新增按钮
const AddButton = ({setFilter}) => {
  const defaultValue = {
    lineName: '',
    lineLink: '',
    priority: 0,
    enableStatus: 0,
    lineImg:'',
  }
  const [renderFormData, setRenderFormData] = useState(defaultValue);
  const renderFormDataRef = useRef(renderFormData);

useEffect(() => {
  renderFormDataRef.current = renderFormData;
}, [renderFormData]);
const submitForm = async () => {
  // 校验是否都输入
  const validatedResult = validateForm(renderFormDataRef.current);
  // 校验通过发起请求
  if (validatedResult.isValidated) {
    const headLineObj = { ...renderFormDataRef.current };
    delete headLineObj.lineImg; // 如果你不需要lineImg，取消这行注释
    const headLineStr = JSON.stringify(headLineObj);
    const fd = new FormData();
    fd.append('headTitleManagementAdd_lineImg', renderFormDataRef.current.lineImg);
    fd.append('headLineStr', headLineStr);

    try {
      const requestData = await postRequestFormData(HEADLINE_ADD_PATH, fd);
      //提交成功toast提示并关闭弹窗
      if (requestData.data?.success) {
        showToast('提交成功');
        //  重新请求
        setFilter(-1)
        toggleModal()
      } else {
        //提交失败
        showToast('提交失败')
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } else {
    const message = validatedResult.unvalidatedKey + '是必填项';
    showToast(message);
  }
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
           <p>新增头条</p>
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
//批量删除按钮 
const PatchDeleteButton =({ selectedIds,setFilter }) => {
  const { ConfirmDeleteModal, openDeleteModal } = useConfirmDelete();
  // 删除操作的逻辑
  const handleDelete = async () => {
    //关闭弹窗
    console.log('项目已删除');
    try {
      const params = {
        headLineIdListStr: selectedIds.join(',')
      }
      const responseDate = await postRequestJson(HEADLINE_BATCH_DELETE_PATH, {}, params);
      if (responseDate.data.success) {
        showToast('删除数据成功')
        setFilter("ALL")
      } else {
        showToast('删除数据失败')
      }
      
    } catch (e) {
      showToast('删除数据失败')
    }
  };

  return (
    <div>
      <button onClick={openDeleteModal}>批量删除头条</button>
      <ConfirmDeleteModal onConfirm={handleDelete} />
    </div>
  );
}

const HealineComponent = () => {
  const [filter, setFilter] = useState(-1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [data, setData] = useState([]);
  //以formdata的形式提交数据
  // 使用useMemo来确保formData只在组件首次渲染时创建一次
  const formData = useMemo(() => {
    const fd = new FormData();
    fd.append('enableStatus', filter);
    return fd;
  }, [filter]);
  useEffect(() => {
    // 定义一个异步函数来发送请求，网络请求是副作用，应该放在此处
    const fetchData = async () => {
      try {
        const requestData = await postRequestFormData(HEADLINE_GET_PATH, formData);
        setData(requestData.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

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
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
    } else {
      // 如果取消选中，将id从数组中移除
      setSelectedIds((prevSelectedIds) => prevSelectedIds.filter((prevId) => prevId !== id));
    }
  };
  const selectOptions = [{ value: -1, label: "全部" }, { value: 1,label:"启用"},{value:0,label:"禁用"}]
  if (!data||!data.rows) {
      return <></>
  } 
  return (
    <div>
      <div className={styles.headContainer}>
        <AddButton setFilter={setFilter}/>
        <PatchDeleteButton selectedIds={selectedIds} setFilter={setFilter}/>
        <FilterItem options={selectOptions} value={ filter} onSelectChange={handleFilterChange} />
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
              <td>
              <img
          src={row.lineImg ? IMAGE_PATH + row.lineImg : ''}
          alt={row.lineName}
        />
              </td>              
              <td>{row.priority}</td>
              <td>{row.enableStatus}</td>
              <td>{row.createTime}</td>
              <td>{row.lastEditTime}</td>
              <td> <div><EditButton row={row} setFilter={setFilter} /> <DeleteButton row={row} setFilter={setFilter} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealineComponent;

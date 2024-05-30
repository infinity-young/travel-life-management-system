import { HEADLINE_ADD_PATH, HEADLINE_BATCH_DELETE_PATH, HEADLINE_DELETE_PATH, HEADLINE_EDIT_PATH } from '../../config/requestConfig.ts';
import React, { useEffect, useRef, useState } from 'react';
import { useModal } from '../../modals/editModal.tsx';
import useConfirmDelete from '../../modals/deleteModal.tsx';
import { ImageUploadItem, InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import { postRequestFormData, postRequestJson } from '../../request/index.ts';
import commonStyles from '../../styles/common.module.scss'
import { ResponseData } from '../../model/ResponseData.ts';
import { statusSelectOptionsForModal } from '../../config/commonConfig.ts';
import { headLineFormConfig } from '../../config/headlineConfig.ts';
import { HeadLineType } from '../../model/HeadLine.ts';
import { StatusResponseDataType } from '../../model/StatusResponseData.ts';
//编辑按钮
export const EditButton = ({row,fetchData}) => {
    //引用数据类型传递的是引用，如果直接引用会导致父组件img标签渲染异常
    const initState = { ...row } || {};
    //删除图片路径，编辑图片提交的是图片数据，而非服务端文件路径
    delete initState.lineImg;
     //删除弹窗内不使用的数据
    delete initState.createTime;
    delete initState.lastEditTime;
    const [renderFormData, setRenderFormData] = useState(initState);
    const renderFormDataRef = useRef(renderFormData);
    useEffect(() => {
        renderFormDataRef.current = renderFormData;
    }, [renderFormData]);
    //提交表单
    const submitForm = async () => {
        // 校验是否都输入
        const validatedResult = validateForm(renderFormDataRef.current);
        // 校验通过发起请求
        if (validatedResult.isValidated) {
        const headLineObj = { ...renderFormDataRef.current };
        delete headLineObj.lineImg; //lineImg通过其他字段传递，此处需删除
        const headLineStr = JSON.stringify(headLineObj);
        const fd = new FormData();
        if (renderFormDataRef.current.lineImg) {
            fd.append('headTitleManagementEdit_lineImg', renderFormDataRef.current.lineImg);
        } else {
            fd.append('headTitleManagementEdit_lineImg', '');
        }
        fd.append('headLineStr', headLineStr);
    
        try {
            const requestData:ResponseData<StatusResponseDataType.safe_t> = await postRequestFormData(HEADLINE_EDIT_PATH, fd);
            //提交成功toast提示并关闭弹窗
            if (requestData.data.success) {
            showToast('提交成功');
            //刷新逻辑
            fetchData()
            toggleModal()
            } else {
            //提交失败
            showToast('提交失败')
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        } else {
        
        const message = headLineFormConfig[validatedResult.unvalidatedKey]  + '是必填项';
        showToast(message);
        }
    };
    //重置表单
    const resetForm = () => {
      const resetItem:HeadLineType.t= {
        lineName: '',
        lineLink: '',
        priority: 0,
        enableStatus: 0,
      }
      const newRenderFormData = { ...renderFormData, ...resetItem }
      setRenderFormData(newRenderFormData);
    }
    //改变头条状态
    const handleSelectChange = (e) => {
      setRenderFormData(prevFormData => {
        return {...prevFormData, enableStatus: e};
      });
    }
    //处理上传头条图片
    const handleImageUpload = (e) => {
      setRenderFormData(prevFormData => {
        return {...prevFormData, lineImg: e};
      });
    }
     //改变头条名称
    const handleTitleInputChange = (e) => {
      setRenderFormData(prevFormData => {
        return {...prevFormData, lineName: e};
      });
    }
    //改变头条链接
    const handleLinkInputChange = (e) => {
      setRenderFormData(prevFormData => {
        return {...prevFormData, lineLink: e};
      });
    }
    //改变头条优先级
    const handlePriorityInputChange = (e) => {
      setRenderFormData(prevFormData => {
        return {...prevFormData, priority: e};
      });
    }
    const { renderModal, toggleModal } = useModal(submitForm,resetForm);
    return (
      <>
        <button onClick={toggleModal} className={commonStyles.button}>编辑</button>
        {renderModal(
          <div className={commonStyles.dialogContainer}>
             <p>头条编辑</p>
            <InputItem title={headLineFormConfig['lineName']} onInputChange={handleTitleInputChange} value={ renderFormData.lineName} />
            <InputItem title={headLineFormConfig['lineLink']} onInputChange={handleLinkInputChange} value={renderFormData.lineLink} />
            <ImageUploadItem title={headLineFormConfig['lineImg']} onImageUpload={handleImageUpload}  />
            <InputItem title={headLineFormConfig['priority']} onInputChange={handlePriorityInputChange} value={renderFormData.priority } />
            <SelectItem title={headLineFormConfig['enableStatus']} options={statusSelectOptionsForModal} value={ renderFormData.enableStatus} onSelectChange={handleSelectChange} />
          </div>
        )}
      </>
    );
  }
  
  //删除按钮
export const DeleteButton = ({row,fetchData}) => {
    const { ConfirmDeleteModal, openDeleteModal ,closeDeleteModal} = useConfirmDelete();

    // 删除操作的逻辑
    const handleDelete = async () => {
        const params={headLineId:row?.lineId}
        const responseData:ResponseData<StatusResponseDataType.safe_t> = await postRequestJson(HEADLINE_DELETE_PATH,{},params)
        if (responseData.data.success) {
            fetchData();
            showToast('删除成功');
            closeDeleteModal()
        } else {
            showToast('删除失败')
        }
    }; 
    return (
        <div>
        <button onClick={openDeleteModal} className={commonStyles.button}>删除</button>
        <ConfirmDeleteModal onConfirm={handleDelete} />
        </div>
    );
};

//新增按钮
export const AddButton = ({fetchData}) => {
  const defaultValue:HeadLineType.t = {
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
      if (renderFormDataRef.current.lineImg instanceof Blob) {
          fd.append('headTitleManagementAdd_lineImg', renderFormDataRef.current.lineImg, 'filename.ext');
      }  
      fd.append('headLineStr', headLineStr);
  
      try {
          const requestData:ResponseData<StatusResponseDataType.safe_t> = await postRequestFormData(HEADLINE_ADD_PATH, fd);
          //提交成功toast提示并关闭弹窗
          if (requestData.data.success) {
          showToast('提交成功');
          //  重新请求
          fetchData()
          toggleModal()
          } else {
          //提交失败
          showToast('提交失败')
          }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
      } else {
      const message = headLineFormConfig[validatedResult.unvalidatedKey]  + '是必填项';
      showToast(message);
      }
  };
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
    <div>
      <button onClick={toggleModal} className={commonStyles.button}>新增头条</button>
      {renderModal(
        <div className={commonStyles.dialogContainer}>
            <p>新增头条</p>
          <InputItem title={headLineFormConfig['lineName']} onInputChange={handleTitleInputChange} value={ renderFormData.lineName} />
          <InputItem title={headLineFormConfig['lineLink']} onInputChange={handleLinkInputChange} value={renderFormData.lineLink} />
          <ImageUploadItem title={headLineFormConfig['lineImg']} onImageUpload={handleImageUpload}  />
          <InputItem title={headLineFormConfig['priority']} onInputChange={handlePriorityInputChange} value={renderFormData.priority } />
          <SelectItem title={headLineFormConfig['enableStatus']} options={statusSelectOptionsForModal} value={renderFormData.enableStatus} onSelectChange={handleSelectChange} />
        </div>
      )}
    </div>
  );
}

//批量删除按钮 
export  const PatchDeleteButton =({ selectedIds,fetchData }) => {
  const { ConfirmDeleteModal, openDeleteModal } = useConfirmDelete();
  // 删除操作的逻辑
  const handleDelete = async () => {
    //关闭弹窗
    try {
      const params = {
        headLineIdListStr: selectedIds.join(',')
      }
      const responseDate:ResponseData<StatusResponseDataType.safe_t>  = await postRequestJson(HEADLINE_BATCH_DELETE_PATH, {}, params);
      if (responseDate.data.success) {
        showToast('删除数据成功')
        fetchData()
      } else {
        showToast('删除数据失败')
      }
      
    } catch (e) {
      showToast('删除数据失败')
    }
  };

  return (
    <div>
      <button onClick={openDeleteModal} className={commonStyles.button}>批量删除头条</button>
      <ConfirmDeleteModal onConfirm={handleDelete} />
    </div>
  );
}
  
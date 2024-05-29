import React, { useEffect, useRef, useState } from 'react';
import { AREA_ADD_PATH, AREA_EDIT_PATH } from '../../config/requestConfig.ts';
import { postRequestFormData } from '../../request/index.ts';
import commnStyles from '../../styles/common.module.scss'
import { InputItem, showToast } from '../../components/dialogComponents/index.tsx';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import { StatusResponseDataType } from '../../model/StatusResponseData.ts';
import { ResponseData } from '../../model/ResponseData.ts';
//新增区域信息按钮
export const AddButton = ({getPageData}) => {
    const defaultFormData = {
        areaName: "",
        priority:""
    }
    const [renderFormData, setRenderFormData] = useState(defaultFormData);
    const renderFormDataRef = useRef(renderFormData);
    useEffect(() => {
        renderFormDataRef.current = renderFormData;
      }, [renderFormData]);
    const submitForm = async () => {
     // 校验是否都输入
    const validatedResult = validateForm(renderFormDataRef.current);
    // 校验通过发起请求
    if (validatedResult.isValidated) {
        const formData = new FormData();
        const areaObj={areaName:encodeURIComponent( renderFormDataRef.current.areaName),priority:renderFormDataRef.current.priority}
        formData.append('areaStr',JSON.stringify(areaObj));
        try {
       const response:ResponseData<StatusResponseDataType.safe_t> = await postRequestFormData(AREA_ADD_PATH, formData)
            //提交成功toast提示并关闭弹窗
            if (response.data.success) {
              showToast('提交成功');
              //  重新请求
              getPageData()
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
    }     
    const resetForm = () => {
        setRenderFormData(defaultFormData)
    }
    const { renderModal, toggleModal } = useModal(submitForm, resetForm);
    const handleAreaNameInputChange = (e) => {
        setRenderFormData(prevFormData => {
            return {...prevFormData, areaName:e};
          });
    }
    const handlePriorityInputChange = (e) => {
        setRenderFormData(prevFormData => {
            return{...prevFormData,priority:e}
        })
    }
  return (
        <>
          <button onClick={toggleModal} className={commnStyles.button}>添加新区域</button>
          {renderModal(
            <div className={commnStyles.dialogContainer}>
               <p>新增区域信息</p>
              <InputItem title="区域名" onInputChange={handleAreaNameInputChange} value={ renderFormData.areaName} />
              <InputItem title="优先级" onInputChange={handlePriorityInputChange} value={renderFormData.priority} placeholder="最多五位，必须是数字" />
            </div>
          )}
        </>
      );
}

//编辑区域信息按钮
export const EditButton = ({row,getPageData}) => {
    const defaultFormData = {
        areaId:row.areaId,
        areaName: row.areaName,
        priority:row.priority
    }
    const [renderFormData, setRenderFormData] = useState(defaultFormData);
    const renderFormDataRef = useRef(renderFormData);
    useEffect(() => {
        renderFormDataRef.current = renderFormData;
      }, [renderFormData]);
    const submitForm = async () => {
     // 校验是否都输入
    const validatedResult = validateForm(renderFormDataRef.current);
    // 校验通过发起请求
    if (validatedResult.isValidated) {
        const formData = new FormData();
        const areaObj = {
            areaName: encodeURIComponent(renderFormDataRef.current.areaName),
            priority: renderFormDataRef.current.priority,
            areaId: renderFormDataRef.current.areaId
        }
        formData.append('areaStr',JSON.stringify(areaObj));
        try {
       const response:ResponseData<StatusResponseDataType.safe_t> = await postRequestFormData(AREA_EDIT_PATH, formData)
            //提交成功toast提示并关闭弹窗
            if (response.data.success) {
              showToast('提交成功');
              //  重新请求
              getPageData()
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
    }     
    const resetForm = () => {
        setRenderFormData(defaultFormData)
    }
    const { renderModal, toggleModal } = useModal(submitForm, resetForm);
    const handleAreaNameInputChange = (e) => {
        setRenderFormData(prevFormData => {
            return {...prevFormData, areaName:e};
          });
    }
    const handlePriorityInputChange = (e) => {
        setRenderFormData(prevFormData => {
            return{...prevFormData,priority:e}
        })
    }
  return (
        <>
          <button onClick={toggleModal} className={commnStyles.button}>编辑</button>
          {renderModal(
            <div className={commnStyles.dialogContainer}>
               <p>编辑区域信息</p>
              <InputItem title="区域名" onInputChange={handleAreaNameInputChange} value={ renderFormData.areaName} />
              <InputItem title="优先级" onInputChange={handlePriorityInputChange} value={renderFormData.priority} placeholder="最多五位，必须是数字" />
            </div>
          )}
        </>
      );
}
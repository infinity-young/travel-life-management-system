import React, { useEffect, useRef, useState } from 'react';
import { AREA_ADD_PATH, AREA_EDIT_PATH, AREA_GET_PATH } from '../../config/requestConfig.ts';
import { getRequest, postRequestFormData } from '../../request/index.ts';
import styles from './index.module.scss'
import { InputItem, showToast } from '../../components/dialogComponents/index.tsx';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import { formatDate } from '../../utils/dateUtil.ts';
//新增区域信息按钮
const AddButton = ({getPageData}) => {
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
       const response = await postRequestFormData(AREA_ADD_PATH, formData)
            //提交成功toast提示并关闭弹窗
            if (response.data?.success) {
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
          <button onClick={toggleModal} className={styles.button}>添加新区域</button>
          {renderModal(
            <div className={styles.dialogContainer}>
               <p>新增区域信息</p>
              <InputItem title="区域名" onInputChange={handleAreaNameInputChange} value={ renderFormData.areaName} />
              <InputItem title="优先级" onInputChange={handlePriorityInputChange} value={renderFormData.priority} placeholder="最多五位，必须是数字" />
            </div>
          )}
        </>
      );
}

//编辑区域信息按钮
const EditButton = ({row,getPageData}) => {
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
       const response = await postRequestFormData(AREA_EDIT_PATH, formData)
            //提交成功toast提示并关闭弹窗
            if (response.data?.success) {
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
          <button onClick={toggleModal} className={styles.button}>编辑</button>
          {renderModal(
            <div className={styles.dialogContainer}>
               <p>编辑区域信息</p>
              <InputItem title="区域名" onInputChange={handleAreaNameInputChange} value={ renderFormData.areaName} />
              <InputItem title="优先级" onInputChange={handlePriorityInputChange} value={renderFormData.priority} placeholder="最多五位，必须是数字" />
            </div>
          )}
        </>
      );
}
const AreaManagerComponent = () => {
    const [data, setData] = useState([]);
    useEffect(()=>{getPageData()},[])
    const getPageData = async () => {
        const response = await getRequest(AREA_GET_PATH, {})
        if (response?.rows) {
            setData(response.rows);
        }
    }
    if (!data) {
        return <></>
    } else {
        return (
          <div className={styles.container}>
             <h1  className={styles.pageTitle}>区域管理</h1>
                <div>
                    <AddButton getPageData={getPageData} />
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>区域Id</th>
                            <th>区域名</th>
                            <th>优先级</th>
                            <th>创建时间</th>
                            <th>最近修改时间</th>
                            <th>编辑</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                        <tr key={index}>
                                <td>{row.areaId}</td>
                                <td>{row.areaName}</td>
                                <td>{row.priority}</td>
                                <td>{formatDate(row.createTime)}</td>
                                <td>{formatDate(row.lastEditTime)}</td>
                                <td><EditButton row={row} getPageData={getPageData} /></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}
export  default  AreaManagerComponent;
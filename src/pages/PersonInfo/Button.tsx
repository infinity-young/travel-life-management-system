import React, { useEffect, useRef, useState } from 'react';
import { postRequestFormData } from '../../request/index.ts';
import { PERSON_INFO_EDIT } from '../../config/requestConfig.ts';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import commonStyles from '../../styles/common.module.scss'
import { ResponseData } from '../../model/ResponseData.ts';
import { StatusResponseDataType } from '../../model/StatusResponseData.ts';
import { statusSelectOptions } from '../../config/commonConfig.ts';
import { PersonFormConfig } from '../../config/personConfig.ts';
export const EditButton = ({ row,setSearchParams }) => {
    const [formData, setFormData] = useState(row);
    const formDataRef = useRef(formData)
    useEffect(() => {
        formDataRef.current = formData;
    },[formData])
    const onSubmit = async () => {
        const validatedResult = validateForm(formDataRef.current);
        if (validatedResult.isValidated) {
            try {
                const formData = new FormData();
                formData.append("userId", formDataRef.current.userId);
                formData.append("enableStatus", formDataRef.current.enableStatus);
                const response:ResponseData<StatusResponseDataType.safe_t> = await postRequestFormData(PERSON_INFO_EDIT, formData);
                if (response.data.success) {
                    setSearchParams((prevSearchParams) => {
                        return{...prevSearchParams, enableStatus: -1,}
                    })
                    showToast("修改账号信息成功");
                    toggleModal();
                } else {
                    showToast("修改账号信息失败")
                }
            } catch {
                showToast("修改账号信息失败")
            }
        } else {
            showToast(PersonFormConfig[validatedResult.unvalidatedKey]+"是必填项")
        }
    }
    const onReset = () => {
        setFormData({
            ...formData,
            name: '',
            enableStatus:0
        })
    }
    const { toggleModal, renderModal } = useModal(onSubmit,onReset)
    const onUserNameChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                name:e
           }
       })
    }
    const onUserStatusChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                enableStatus:e
            }
        })
    }
    return(
       <div>
            <button onClick={toggleModal} className={commonStyles.button}>编辑</button>
            {
                renderModal(
                    <div className={commonStyles.dialogContainer}>
                        <div>编辑账号信息</div>
                        <InputItem title={PersonFormConfig.name} onInputChange={onUserNameChange} value={formData.name} />  
                        <SelectItem title={PersonFormConfig.enableStatus} onSelectChange={onUserStatusChange} options={statusSelectOptions} value={formData.enableStatus} />
                    </div>
                )
            }
       </div >
    )
}
import React, { useEffect, useRef, useState } from 'react';
import { CATEGORY_ADD_PATH, CATEGORY_EDIT_PATH } from '../../config/requestConfig.ts';
import { postRequestFormData } from '../../request/index.ts';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { ImageUploadItem, InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import commnStyles from '../../styles/common.module.scss'
import { ResponseData } from '../../model/ResponseData.ts';
import { StatusResponseDataType } from '../../model/StatusResponseData.ts';
import { ShopCategory } from '../../model/ShopCategory.ts';
export const AddButton = ({ firstCategoryData, getCategoryData }) => {
    const defaultFormData = {
        shopCategoryName: "",
        shopCategoryDesc: "",
        shopCategoryImg: "",
        priority: 0,
        parent: {
            shopCategoryId: 1
        }
    }
    const [formData, setFormData] = useState(defaultFormData);
    const formDataRef = useRef(formData);
    useEffect(() => { 
        formDataRef.current = formData;
    }, [formData]);
    const submitForm = async () => {
        const validatedResult = validateForm(formDataRef.current);
        if (validatedResult.isValidated) {
            try {
                const submitFormData = new FormData();
                const shopCategoryObj:ShopCategory.t= {
                    ...formDataRef.current
                }
                delete shopCategoryObj.shopCategoryImg;
                submitFormData.append("shopCategoryStr", JSON.stringify(shopCategoryObj));
                submitFormData.append("shopCategoryManagementAdd_shopCategoryImg", formDataRef.current.shopCategoryImg);
                const response:ResponseData<StatusResponseDataType.safe_t> = await postRequestFormData(CATEGORY_ADD_PATH, submitFormData)
                if (response.data.success) {
                    showToast("新增店铺类别成功")
                    toggleModal();
                    getCategoryData()
                } else {
                    showToast("新增店铺列表失败")
                }
                
            } catch {
                showToast("新增店铺类别失败")
            }
        }
    }
    const resetForm = () => {
        setFormData(defaultFormData);
    }
    const handleCategoryTitleChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                shopCategoryName:e
            }
        })
    }
    const handleCategoryDesChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                shopCategoryDesc:e
            }
        })
    }
    const handleCategorySelectChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                parent: {
                    shopCategoryId:e
                }
           }

        })
    }
    const handleCategoryImageUpload = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                shopCategoryImg:e
            }
        })
    }
    const handleCategoryPriorityInputChange = (e) => {
        setFormData(
            (prevFormData) => {
                return {
                    ...prevFormData,
                    priority:e
                }
            }
        )
    }
    const { renderModal, toggleModal } = useModal(submitForm, resetForm);
    return <div>
        <button onClick={toggleModal} className={commnStyles.button}>新增店铺类别</button>
        {
            renderModal((
                <div className={commnStyles.dialogContainer}>
                    <div>新增店铺类别</div>
                    <InputItem title="类别名称" value={ formData.shopCategoryName} onInputChange={handleCategoryTitleChange} />
                    <InputItem title="类别描述" value={formData.shopCategoryDesc} onInputChange={ handleCategoryDesChange} />
                    <SelectItem title="上级类别"  options={firstCategoryData} value={formData.parent.shopCategoryId} onSelectChange={handleCategorySelectChange} />
                    <ImageUploadItem title="类别图片" onImageUpload={handleCategoryImageUpload}  />
                    <InputItem title="优先级" value={formData.priority} onInputChange={handleCategoryPriorityInputChange}  />
                </div>
            ))
        }
    </div>
}

export const EditButton = ({ row, firstCategoryData,getCategoryData }) => {
    const [formData, setFormData] = useState(row);
    const renderFormDataRef = useRef(formData);
    useEffect(() => {
      renderFormDataRef.current = formData;
    }, [formData]);

    const submitForm = async () => {
        // 校验是否都输入
    const validatedResult = validateForm(renderFormDataRef.current);
        // 校验通过发起请求
        if (validatedResult.isValidated) {
            try {
                const shopCategoryObj = { ...renderFormDataRef.current };
            delete shopCategoryObj.shopCategoryImg;
            const submitFormData = new FormData();
            submitFormData.append('shopCategoryStr', JSON.stringify(shopCategoryObj));
            submitFormData.append('shopCategoryManagementEdit_shopCategoryImg', renderFormDataRef.current.shopCategoryImg);
            const response :ResponseData<StatusResponseDataType.safe_t> = await postRequestFormData(CATEGORY_EDIT_PATH,submitFormData)
            if (response.data?.success) {
                showToast("修改店铺类别信息成功")
                toggleModal()
                getCategoryData()
            } else {
                showToast("修改店铺类别信息失败")
            }
            } catch (e) {
                showToast("修改店铺类别信息失败")
            }
        }
    }
    const handleCategoryTitleChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                shopCategoryName: e
            }
        })
    }
    const handleCategoryDesChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                shopCategoryDesc: e
            }
        })
    }
    const handleCategorySelectChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                parent: {
                    ...prevFormData.parent,
                    shopCategoryId: e
                }
            }
        })
    }
    const handleCategoryImageUpload = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                shopCategoryImg:e
            }
        })
    }
    const handleCategoryPriorityInputChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                priority:e
            }
        })
    }
    
    const resetForm = () => {
        const defaultFormData = {
            shopCategoryName: "",
            shopCategoryDesc: "",
            shopCategoryImg: "",
            priority: 0,
            parent: {
                shopCategoryId: 1
            }
        }
        const currentData = {
            ...formData,
            ...defaultFormData
        }
        setFormData(currentData);
    }
    const { renderModal, toggleModal } = useModal(submitForm,resetForm);
    return <div>
        <button onClick={toggleModal} className={commnStyles.button}>编辑</button>
        {
            renderModal(<div>
                <div>店铺类别编辑</div>
                <InputItem title="类别名称" value={formData?.shopCategoryName }  onInputChange={handleCategoryTitleChange} />
                <InputItem title="类别描述" value={ formData?.shopCategoryDesc} onInputChange={ handleCategoryDesChange} />
                {formData.parent&&<SelectItem title="上级类别" options={firstCategoryData}  value={formData.parent?.shopCategoryId} onSelectChange={handleCategorySelectChange} />}
                <ImageUploadItem title="类别图片"  onImageUpload={handleCategoryImageUpload}  />
                <InputItem title="优先级" value={formData?.priority} onInputChange={handleCategoryPriorityInputChange}  />
            </div>)
        }
    </div>
    
}
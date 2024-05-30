import React, { useEffect, useRef, useState } from 'react';
import { postRequestJson } from '../../request/index.ts';
import { SHOP_EDIT_PATH } from '../../config/requestConfig.ts';
import { InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { useModal } from '../../modals/editModal.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import commonStyles from '../../styles/common.module.scss'
import { StatusResponseDataType } from '../../model/StatusResponseData.ts';
import { ResponseData } from '../../model/ResponseData.ts';
import { statusSelectOptionsForModal } from '../../config/commonConfig.ts';
import { ShopFormConfig } from '../../config/shopConfig.ts';


export const EditButton = ({ row,shopCategory,setShopParam }) => {
    const [formData, setFormData] = useState(row)
    const renderFormDataRef = useRef(formData);
    useEffect(() => {
      renderFormDataRef.current = formData;
    }, [formData]);
    
    const onSubmit = async () => {
        const validatedResult = validateForm(renderFormDataRef.current);
        if (validatedResult.isValidated) {
            try {
                const shopStr = JSON.stringify(renderFormDataRef.current);
                const formData = new FormData();
                formData.append('shopStr', shopStr);
                const response :ResponseData<StatusResponseDataType.safe_t> =  await postRequestJson(SHOP_EDIT_PATH, formData)
                if (response.data.success) {
                    setShopParam((prevShopPram) => {
                        return {
                            ...prevShopPram,
                            enableStatus: -1,
                        }
                    })
                    showToast("编辑店铺信息成功")
                    toggleModal()
                } else {
                    showToast("编辑店铺信息失败")
                }
            } catch {
                showToast("编辑店铺信息失败")
            }
        } else {
            showToast(ShopFormConfig[validatedResult.unvalidatedKey]+"是必填项")
        }
    }
    const { toggleModal, renderModal } = useModal(onSubmit)
    const onShopNameChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                shopName:e
           }
       })
    }
    const onShopCategoryChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                shopCategory: {
                    ...prevFormData.shopCategory,
                    shopCategoryId:e
                }
           }
       })
    }
    const onPriorityChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                priority:e
            }
        })
    }
    const onShopStatusChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                enableStatus:e
            }
        })
    }
    const onAdviceChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
            advice:e
          }
        })
    }

    return <div>
        <button onClick={toggleModal} className={commonStyles.button}>编辑</button>
        {
            renderModal(
                <div className={commonStyles.dialogContainer}>
                    <div>店铺类别编辑</div>
                    <InputItem title={ShopFormConfig.shopName} value={formData.shopName} onInputChange={onShopNameChange} />
                    <SelectItem title={ShopFormConfig.shopCategory} options={shopCategory} onSelectChange={onShopCategoryChange} value={formData.shopCategory.shopCategoryId} />
                    <InputItem title={ShopFormConfig.priority} value={formData.priority} onInputChange={onPriorityChange} />
                    <SelectItem title={ShopFormConfig.enableStatus} options={statusSelectOptionsForModal} onSelectChange={onShopStatusChange} value={formData.enableStatus} />
                    <InputItem title={ShopFormConfig.advice} value={formData.advice} onInputChange={onAdviceChange} />
                 </div>
            )
        }
    </div>
}

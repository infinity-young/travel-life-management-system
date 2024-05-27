import React, { useEffect, useRef, useState } from 'react';
import { CATEGORY_ADD_PATH, CATEGORY_EDIT_PATH, CATEGORY_FIRST_LEVEL_GET_PATH, CATEGORY_GET_PATH, IMAGE_PATH } from '../../config/requestConfig.ts';
import { postRequestFormData, postRequestJson } from '../../request/index.ts';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { ImageUploadItem, InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import styles from './index.module.scss'
import { formatDate } from '../../utils/dateUtil.ts';
const AddButton = ({ firstCategoryData,getCategoryData }) => {
    const defaultFormData = {
        shopCategoryName: "",
        shopCategoryDesc: "",
        shopCategoryImg: "",
        priority: "",
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
                const shopCategoryObj = {
                    ...formDataRef.current
                }
                delete shopCategoryObj.shopCategoryImg;
                submitFormData.append("shopCategoryStr", JSON.stringify(shopCategoryObj));
                submitFormData.append("shopCategoryManagementAdd_shopCategoryImg", formDataRef.current.shopCategoryImg);
                const response = await postRequestFormData(CATEGORY_ADD_PATH, submitFormData)
                if (response.data?.success) {
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
        <button onClick={toggleModal}>新增店铺类别</button>
        {
            renderModal((
                <div>
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

const EditButton = ({ row, firstCategoryData,getCategoryData }) => {
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
            const response = await postRequestFormData(CATEGORY_EDIT_PATH,submitFormData)
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
    
    const { renderModal, toggleModal } = useModal(submitForm);
    return <div>
        <button onClick={toggleModal}>编辑</button>
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
const CategoryManagerComponent = () => {
    const [data, setData] = useState([]);
    const [firstCategoryData, setFirstCategoryData] = useState([]);
    const getCategoryData = async () => {
        const response = await postRequestJson(CATEGORY_GET_PATH)
        if (response.data?.rows) {
            setData(response.data?.rows);
        }
    }
    const getFirtCategory = async () => {
        const response = await postRequestJson(CATEGORY_FIRST_LEVEL_GET_PATH)
        if (response.data?.rows) {
            const categoryOptions = response.data?.rows?.map((item) => {
                return {
                    value: item.shopCategoryId,
                    label:item.shopCategoryName
                }
            })
            setFirstCategoryData(categoryOptions);
        }
    }
    useEffect(() => {
        getCategoryData();
        getFirtCategory();
    }, []);
    if (!data||data.length<=0) {
        return <></>
    }
    return (
        <div>
            <div><AddButton firstCategoryData={firstCategoryData} getCategoryData={getCategoryData} /></div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>类别id</th>
                        <th>类别名称</th>
                        <th>类别描述</th>
                        <th>上级类别</th>
                        <th>类别图片</th>
                        <th>优先级</th>
                        <th>创建时间</th>
                        <th>最近修改时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                        {data.map(( row, index)=>(
                              <tr key={index}>
                                  <td>{row.shopCategoryId}</td>
                                  <td>{row.shopCategoryName}</td>
                                  <td>{row.shopCategoryDesc}</td>
                                  <td>{row?.parent?.shopCategoryId}</td>
                                  <td>
                                    <img
                                        src={row.shopCategoryImg ? IMAGE_PATH + row.shopCategoryImg : ''} />
                                  </td>
                                  <td>{row.priority}</td>
                                  <td>{formatDate(row.createTime)}</td>
                                  <td>{formatDate(row.lastEditTime)}</td>
                                <td><EditButton row={row} firstCategoryData={firstCategoryData} getCategoryData={getCategoryData} /></td>
                              </tr>
                      ))}
                </tbody>
                
            </table>
        </div>
    )

}
export default CategoryManagerComponent
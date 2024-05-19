import React, { useEffect, useRef, useState } from 'react';
import { postRequestJson } from '../../request/index.ts';
import { SHOP_CATEGORY_SECOND_PATH, SHOP_DATA_PATH, SHOP_EDIT_PATH, SHOP_SEARCH_BY_ID_PATH } from '../../config/requestConfig.ts';
import { InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { validateForm } from '../../utils/formUtil.ts';
//todo 待测试
const EditButton = ({ row,shopCategory,setShopParam }) => {
    const [formData, setFormData] = useState(row)
    const renderFormDataRef = useRef(formData);
    useEffect(() => {
      renderFormDataRef.current = formData;
    }, [formData]);
    
    const onSubmit = () => {
        const validatedResult = validateForm(renderFormDataRef.current);
        if (validatedResult.isValidated) {
            try {
                const shopStr = JSON.stringify(renderFormDataRef.current);
                const formData = new FormData();
                formData.append('shopStr', shopStr);
                const response = postRequestJson(SHOP_EDIT_PATH, formData)
                if (response?.data?.success) {
                    setShopParam((prevShopPram) => {
                        return {
                            ...prevShopPram,
                            enableStatus: 'ALL',
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
    const shopStatusOptions = [ { value: -1, label: '禁用' },
    { value: 1, label: '启用' }]
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
        <button onClick={toggleModal}>编辑</button>
        {
            renderModal(
                <div>
                    <div>商铺类别编辑</div>
                    <InputItem title="商铺名" value={formData.shopName} onInputChange={onShopNameChange} />
                    <SelectItem title="店铺类别" options={shopCategory} onSelectChange={onShopCategoryChange} value={formData.shopCategory.shopCategoryId} />
                    <InputItem title="优先级" value={formData.priority} onInputChange={onPriorityChange} />
                    <SelectItem title="商铺状态" options={shopStatusOptions} onSelectChange={onShopStatusChange} value={formData.enableStatus} />
                    <InputItem title="商铺建议" value={formData.advice} onInputChange={onAdviceChange} />
                 </div>
            )
        }
    </div>
}

const ShopManagerComponent = () => {
    const [shopData, setShopData] = useState([]);
    const [shopCategory, setShopCategory] = useState([]);
    const [shopParam, setShopParam] = useState({
        enableStatus: 'ALL',
                page: 1,
        rows: 10,
    })
    useEffect(() => {
        getShopData();
        getShopCategoryData();
    },[])
    const getShopData = async () => {
        try {
            const response = await postRequestJson(SHOP_DATA_PATH,{},shopParam)
            if (response.data?.rows) {
                setShopData(response?.data?.rows);
            } else {
                showToast("获取店铺信息失败")
            }
        } catch {
            showToast("获取店铺信息失败")
       }
    }
    const getShopCategoryData = async () => {
        try {
            const response = await postRequestJson(SHOP_CATEGORY_SECOND_PATH);
            if (response.data?.rows) {
                const categoryData = response.data.rows.map((item) => ({
                    value: item.shopCategoryId,
                    label: item.shopCategoryName
                }));
                setShopCategory(categoryData)
                  
            } else {
                showToast("获取店铺类别信息失败")       
            }
        } catch {
            showToast("获取店铺类别信息失败")
        }

    }
    const shopStatusOptions = [
        { value: 'ALL', label: "全部" },
        { value: -1, lable: "禁用" },
        { value: 1, label: "启用" },
        {value:0,lable:"待审核"}
    ]
    const onShopStatusChange = (e) => {
        setShopParam((prevShopParam) => {
            return {
                ...prevShopParam,
                enableStatus:e
            }
        })
    }
    const onShopCategoryChange = (e) => {
        setShopParam((prevShopParam) => {
            return {
                ...prevShopParam,
                shopCategoryId:e
            }
        })
    }
    const onShopCategoryIdChange = (e) => {
        const shopParam = {
            page: 1,
            rows: 10,
            shopId:e
        }
        try {
            const response = postRequestJson(SHOP_SEARCH_BY_ID_PATH, {}, shopParam)
            if (response.data?.rows) {
                setShopData(response.data?.rows);
            } else {
                showToast("店铺查询失败")
            }
        } catch {
            showToast("店铺查询失败")
        }
    }
    const onShopNameChange = (e) => {
        setShopParam((prevShopParam) => {
            return {
                ...prevShopParam,
                shopName:encodeURIComponent(e)
            }
        })
    }
    const currentShopCategory=[...shopCategory,{value:"ALL",label:"全部类别"}]
    return <div>
        <div>
        <SelectItem  options={shopStatusOptions} onSelectChange={onShopStatusChange} value="ALL" />
        <SelectItem options={currentShopCategory} onSelectChange={onShopCategoryChange} value="ALL" />
        <InputItem title="按商铺Id查询" onInputChange={onShopCategoryIdChange} />
        <InputItem title="按商铺名称查询"  onInputChange={onShopNameChange} />
        </div>
        <table>
            <thead>
                <tr>
                    <th>商铺Id</th>
                    <th>商铺名称</th>
                    <th>商铺描述</th>
                    <th>商铺地址</th>
                    <th>类别Id</th>
                    <th>电话</th>
                    <th>优先级</th>
                    <th>状态</th>
                    <th>建议</th>
                    <th>创建时间</th>
                    <th>最近修改时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {shopData.map((row,index) => (
                    <tr key={index}>
                        <td>{row.shopId}</td>
                        <td>{row.shopName}</td>
                        <td>{row.shopDesc}</td>
                        <td>{row.shopAddr}</td>
                        <td>{row.shopCategory.shopCategoryId}</td>
                        <td>{row.phone}</td>
                        <td>{row.priority}</td>
                        <td>{row.enableStatus }</td>
                        <td>{row.advice}</td>
                        <td>{row.lastEditTime}</td>
                        <td><EditButton row={row} shopCategory={shopCategory} setShopParam={setShopParam} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
export default  ShopManagerComponent;
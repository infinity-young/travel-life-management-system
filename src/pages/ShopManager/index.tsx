import React, { useEffect, useRef, useState } from 'react';
import { postRequestJson } from '../../request/index.ts';
import { SHOP_CATEGORY_SECOND_PATH, SHOP_DATA_PATH, SHOP_EDIT_PATH, SHOP_SEARCH_BY_ID_PATH } from '../../config/requestConfig.ts';
import { InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import styles from './index.module.scss'
import { FilterComponent, InputComponent } from '../../components/headComponents/index.tsx';
import { formatDate } from '../../utils/dateUtil.ts';
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
        <button onClick={toggleModal} className={styles.button}>编辑</button>
        {
            renderModal(
                <div>
                    <div>店铺类别编辑</div>
                    <InputItem title="店铺名" value={formData.shopName} onInputChange={onShopNameChange} />
                    <SelectItem title="店铺类别" options={shopCategory} onSelectChange={onShopCategoryChange} value={formData.shopCategory.shopCategoryId} />
                    <InputItem title="优先级" value={formData.priority} onInputChange={onPriorityChange} />
                    <SelectItem title="店铺状态" options={shopStatusOptions} onSelectChange={onShopStatusChange} value={formData.enableStatus} />
                    <InputItem title="店铺建议" value={formData.advice} onInputChange={onAdviceChange} />
                 </div>
            )
        }
    </div>
}

const ShopManagerComponent = () => {
    const defaultShopParams = {
        enableStatus: -1,
        page: 1,
        rows: 2,
        shopCategoryId:-1
    }
    const defaultPageSetting = {
        isShowPrevPage: false,
        isShowNextPage: false,
        total:0
    }
    const [shopData, setShopData] = useState([]);
    const [shopCategory, setShopCategory] = useState([]);
    const [pageSetting, setPageSetting] = useState(defaultPageSetting)
    const [shopParam, setShopParam] = useState(defaultShopParams)
    useEffect(() => {
        getShopCategoryData();
    }, [])
    useEffect(() => {
        getShopData();
    },[shopParam])
    const getShopData = async () => {
        try {
            const response = await postRequestJson(SHOP_DATA_PATH,{},shopParam)
            if (response.data?.rows) {
                setShopData(response?.data?.rows);
            } else {
                showToast("获取店铺信息失败")
            }
            if (response.data?.total) {
                setPageSetting({
                    isShowPrevPage: shopParam.page>1,
                    isShowNextPage: shopParam.rows*shopParam.page<=response.data?.total,
                    total:response.data?.total
                })
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
        { value: -1, label: "全部状态" },
        { value:2, label: "禁用" },
        { value: 1, label: "启用" },
        {value:0,  label:"待审核"}
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
    const onShopCategoryIdChange = async (e) => {
        try {
            const shopCategoryParams = {
                shopId:e
            }
            const response = await postRequestJson(SHOP_SEARCH_BY_ID_PATH, {}, shopCategoryParams)
            if (response.data?.rows) {
                setShopData(response.data?.rows);
            }
            else {
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
    const pageFilterOptions = [
        {
            value: 2, label: 2,
        },
        {
            value: 4, label:4
        }
    ]
    const handleFilterChange = (e) => {
        setShopParam((prevShopParam) => {
            return {
                ...prevShopParam,
                rows: e
            }
        });
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                isShowPrevPage: false,
                isShowNextPage:prevPageSetting.total>e
            }
        })
        
    }
    const handlePrevPage = () => {
        setShopParam((prevShopParam) => {
            return {
                ...prevShopParam,
                page: prevShopParam.page - 1
            }
        })
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                isShowNextPage: true,
                isShowPrevPage:shopParam.page>2
            }
        })
    }
    const handleNextPage = () => {
        setShopParam((prevShopParam) => {
            return {
                ...prevShopParam,
                page:prevShopParam.page+1
            }
        })
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                isShowNextPage: prevPageSetting.total > (shopParam.page + 1) * shopParam.rows,
                isShowPrevPage:true
            }
        })
    }
    const currentShopCategory = [...shopCategory, { value: -1, label: "全部类别" }]
    const shopStatus = {
        0: '禁用',
        1:'启用'
    }
    return <div>
        <h1  className={styles.pageTitle}>店铺管理</h1>
        <div className={styles.headButtonContainer}>
            <FilterComponent options={shopStatusOptions} onSelectChange={onShopStatusChange} value={shopParam.enableStatus} />
            <span className={styles.dividedSpan}></span>
            <FilterComponent  options={currentShopCategory} onSelectChange={onShopCategoryChange} value={shopParam.shopCategoryId} />
            <InputComponent placeholder="按店铺Id查询" onSearch={onShopCategoryIdChange} />
            <InputComponent placeholder="按店铺名称查询" onSearch={onShopNameChange}/>
        </div>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>店铺Id</th>
                    <th>店铺名称</th>
                    <th>店铺描述</th>
                    <th>店铺地址</th>
                    <th>类别Id</th>
                    <th>电话</th>
                    <th>优先级</th>
                    <th>店铺状态</th>
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
                        <td>{shopStatus[row.enableStatus] }</td>
                        <td>{row.advice}</td>
                        <td>{formatDate(row.createTime)}</td>
                        <td>{formatDate(row.lastEditTime)}</td>
                        <td><EditButton row={row} shopCategory={shopCategory} setShopParam={setShopParam} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className={styles.bottomContainer}>
            <FilterComponent options={pageFilterOptions} value={shopParam.rows} onSelectChange={handleFilterChange} />
            <span className={styles.dividedSpan}></span>
                {pageSetting.isShowPrevPage&&<button  className={styles.button} onClick={handlePrevPage} >上一页</button>}
                {pageSetting.isShowNextPage&&pageSetting.isShowPrevPage&& <span className={styles.dividedSpan}></span>}
                {pageSetting.isShowNextPage&&<button className={styles.button} onClick={handleNextPage}>下一页</button>}
            </div>
    </div>
}
export default  ShopManagerComponent;
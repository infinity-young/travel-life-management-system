import React, { useEffect, useState } from 'react';
import { postRequestJson } from '../../request/index.ts';
import { SHOP_CATEGORY_SECOND_PATH, SHOP_DATA_PATH, SHOP_SEARCH_BY_ID_PATH } from '../../config/requestConfig.ts';
import { showToast } from '../../components/dialogComponents/index.tsx';
import styles from './index.module.scss'
import commonStyles from '../../styles/common.module.scss'
import { FilterComponent, InputComponent } from '../../components/headComponents/index.tsx';
import { formatDate } from '../../utils/dateUtil.ts';
import { EditButton } from './Button.tsx';
import { shopStatusOptions } from '../../config/shopConfig.ts';
import { pageFilterOptions, statusType } from '../../config/commonConfig.ts';
import { ShopResponse } from '../../model/ShopResponse.ts';
import { ShopType } from '../../model/ShopType.ts';
import { ShopCategoryResponseType } from '../../model/ShopCategoryResponse.ts';
import { OptionType } from '../../model/common.ts';

const ShopManagerComponent = () => {
    const defaultShopParams = {
        enableStatus: -1,
        page: 1,
        rows: 5,
        shopCategoryId:-1
    }
    const defaultPageSetting = {
        isShowPrevPage: false,
        isShowNextPage: false,
        total:0
    }
    const [shopData, setShopData] = useState([] as ShopType.safe_t[]);
    const [shopCategory, setShopCategory] = useState([] as OptionType[]);
    const [shopCategoryMap, setShopCategoryMap] = useState<Map<number, string>>(new Map());
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
            const response = await postRequestJson<ShopResponse.t>(SHOP_DATA_PATH, {}, shopParam)
            const data=ShopResponse.from(response.data)
            if (data.rows) {
                setShopData(data.rows);
            } else {
                showToast("获取店铺信息失败")
            }
            if (response.data.total) {
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
            const response = await postRequestJson<ShopCategoryResponseType.t>(SHOP_CATEGORY_SECOND_PATH);
            const data=ShopCategoryResponseType.from(response.data)
            if (data.rows) {
                const categoryData = data.rows.map((item) => ({
                    value: item.shopCategoryId,
                    label: item.shopCategoryName
                }));
                setShopCategory(categoryData)
                const currentShopCategoryMap = new Map<number, string>();
                for (let i = 0; i < data.rows.length;i++) {
                    currentShopCategoryMap.set(data.rows[i].shopCategoryId, data.rows[i].shopCategoryName);
                }
                setShopCategoryMap(currentShopCategoryMap);
                  
            } else {
                showToast("获取店铺类别信息失败")       
            }
        } catch {
            showToast("获取店铺类别信息失败")
        }

    }
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
            const response = await postRequestJson<ShopResponse.t>(SHOP_SEARCH_BY_ID_PATH, {}, shopCategoryParams)
            const data=ShopResponse.from(response.data)
            if (data.rows) {
                setShopData(data.rows);
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
    return (
        <div>
        <h1  className={commonStyles.pageTitle}>店铺管理</h1>
        <div className={commonStyles.headContainer}>
            <FilterComponent options={shopStatusOptions} onSelectChange={onShopStatusChange} value={shopParam.enableStatus} />
            <span className={commonStyles.dividedSpan}></span>
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
                    <th>类别</th>
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
                        <td>{shopCategoryMap.get(row.shopCategory.shopCategoryId)}</td>
                        <td>{row.phone}</td>
                        <td>{row.priority}</td>
                        <td>{statusType[row.enableStatus] }</td>
                        <td>{row.advice}</td>
                        <td>{formatDate(row.createTime)}</td>
                        <td>{formatDate(row.lastEditTime)}</td>
                        <td><EditButton row={row} shopCategory={shopCategory} setShopParam={setShopParam} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className={commonStyles.bottomContainer}>
            <FilterComponent options={pageFilterOptions} value={shopParam.rows} onSelectChange={handleFilterChange} />
            <span className={commonStyles.dividedSpan}></span>
                {pageSetting.isShowPrevPage&&<button  className={commonStyles.button} onClick={handlePrevPage} >上一页</button>}
                {pageSetting.isShowNextPage&&pageSetting.isShowPrevPage&& <span className={commonStyles.dividedSpan}></span>}
                {pageSetting.isShowNextPage&&<button className={commonStyles.button} onClick={handleNextPage}>下一页</button>}
            </div>
        </div>
    )
}
export default  ShopManagerComponent;
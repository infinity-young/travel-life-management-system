import React, { useEffect, useState } from 'react';
import {CATEGORY_FIRST_LEVEL_GET_PATH, CATEGORY_GET_PATH, IMAGE_PATH } from '../../config/requestConfig.ts';
import styles from './index.module.scss'
import commnStyles from '../../styles/common.module.scss'
import { formatDate } from '../../utils/dateUtil.ts';
import { FilterComponent } from '../../components/headComponents/index.tsx';
import { AddButton, EditButton } from './Button.tsx';
import { postRequestJson } from '../../request/index.ts';
import { ShopCategoryResponseType } from '../../model/ShopCategoryResponse.ts';
import { ShopCategory } from '../../model/ShopCategory.ts';
import { OptionType } from '../../model/common.ts';
import { pageFilterOptions } from '../../config/commonConfig.ts';

const CategoryManagerComponent = () => {
    const defaultPageSetting = {
        pageIndex: 1,
        pageItem: 5,
        totalItems: 5,
        isShowNextPage: false,
        isShowPrevPage: false
    }
    const [data, setData] = useState([] as ShopCategory.t[]);
    const [netData, setNetData] = useState([] as ShopCategory.t[]);
    const [firstCategoryData, setFirstCategoryData] = useState([] as OptionType[]);
    const [pageSetting, setPageSetting] = useState(defaultPageSetting);
    const getCategoryData = async () => {
        const response = await postRequestJson<ShopCategoryResponseType.t>(CATEGORY_GET_PATH)
        const data:ShopCategoryResponseType.safe_t=ShopCategoryResponseType.from(response.data)
        if (data.rows) {
            setNetData(data.rows);
            setData(data.rows.slice(0,pageSetting.pageItem));

        }
        if (data.total) {
            setPageSetting((prevPageSetting) => {
                return {
                    ...prevPageSetting,
                    totalItems: data.total,
                    isShowNextPage:data.total>prevPageSetting.pageIndex*prevPageSetting.pageItem
                }
            })
        }
    }
    const getFirtCategory = async () => {
        const response = await postRequestJson<ShopCategoryResponseType.t>(CATEGORY_FIRST_LEVEL_GET_PATH)
        const data:ShopCategoryResponseType.safe_t=ShopCategoryResponseType.from(response.data)
        if (data.rows) {
            const categoryOptions = data.rows.map((item) => {
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

    const handleFilterChange = (e) => {
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                pageIndex:1,
                pageItem: e,
                isShowNextPage:prevPageSetting.totalItems>e,
                isShowPrevPage:false
            }
        })
        //重新划分渲染数据
        const currentData = netData.slice(0, e);
        setData(currentData)
        
    }
    const handleNextPage = () => {
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                pageIndex:prevPageSetting.pageIndex+1,
                isShowNextPage:prevPageSetting.totalItems>(prevPageSetting.pageIndex+1)*prevPageSetting.pageItem,
                isShowPrevPage:true
            }
        })
        //重新划分渲染数据
        const currentData = netData.slice((pageSetting.pageIndex)*pageSetting.pageItem,(pageSetting.pageIndex+1)*pageSetting.pageItem );
        setData(currentData)
    }
    const handlePrevPage = () => {
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                pageIndex:prevPageSetting.pageIndex-1,
                isShowNextPage:true,
                isShowPrevPage:prevPageSetting.pageIndex-1>1
            }
        })
        //重新划分渲染数据
        const currentData = netData.slice((pageSetting.pageIndex - 2) * pageSetting.pageItem, (pageSetting.pageIndex-1) * pageSetting.pageItem);
        setData(currentData)
    }
    if (!data||data.length<=0) {
        return <></>
    }
    return (
        <div>
             <h1  className={commnStyles.pageTitle}>类别管理</h1>
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
                                  <td>{row.parent?.shopCategoryName}</td>
                                  <td>
                                    <img src={IMAGE_PATH + row.shopCategoryImg} />
                                  </td>
                                  <td>{row.priority}</td>
                                  <td>{formatDate(row.createTime)}</td>
                                  <td>{formatDate(row.lastEditTime)}</td>
                                  <td>
                                    <EditButton row={row} firstCategoryData={firstCategoryData} getCategoryData={getCategoryData} />
                                  </td>
                              </tr>
                      ))}
                </tbody>   
            </table>
            <div className={commnStyles.bottomContainer}>
                <FilterComponent options={pageFilterOptions} value={pageSetting.pageItem} onSelectChange={handleFilterChange} />
                <span className={commnStyles.dividedSpan}></span>
                {pageSetting.isShowPrevPage&&<button  className={commnStyles.button} onClick={handlePrevPage} >上一页</button>}
                {pageSetting.isShowNextPage&&pageSetting.isShowPrevPage&& <span className={commnStyles.dividedSpan}></span>}
                {pageSetting.isShowNextPage&&<button className={commnStyles.button} onClick={handleNextPage}>下一页</button>}
            </div>
        </div>
    )

}
export default CategoryManagerComponent
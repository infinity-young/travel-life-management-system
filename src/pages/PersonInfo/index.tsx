import React, { useEffect, useState } from 'react';
import {  postRequestJson } from '../../request/index.ts';
import { IMAGE_PATH, PERSON_INFO_GET } from '../../config/requestConfig.ts';
import styles from './index.module.scss'
import { FilterComponent, InputComponent } from '../../components/headComponents/index.tsx';
import { formatDate } from '../../utils/dateUtil.ts';
import { EditButton } from './Button.tsx';
import commonStyles from '../../styles/common.module.scss'
import { pageFilterOptions, statusSelectOptions, statusType } from '../../config/commonConfig.ts';
import { genderType, personType } from '../../config/personConfig.ts';
import { PersonResponse } from '../../model/PersonResponse.ts';
import { PersonType } from '../../model/PersonType.ts';
//form 用户名 账号状态
const PersonInfoComponent = () => {
    const [data, setData] = useState([] as PersonType.safe_t[]);
    const defaultPageSetting = {
        isShowPrevPage:false,isShowNextPage:false,total:0
    }
    const [pageSetting,setPageSetting]=useState(defaultPageSetting)
    const defaultParams = {
        enableStatus: -1,
        page: 1,
        rows: 5,
        name:''
    }
    const [searchParams,setSearchParams]=useState(defaultParams)
    useEffect(() => { 
        getPersonData();
    }, [searchParams]);
    const getPersonData = async () => {
        const response = await postRequestJson<PersonResponse.t>(PERSON_INFO_GET, {}, searchParams);
        const data = PersonResponse.from(response.data);
        if (data.rows) {
            setData(data.rows);
        }
        if (data.total) {
            setPageSetting((prevPageSetting) => {
                return {
                    ...prevPageSetting,
                    total: data.total,
                    isShowNextPage:data.total>searchParams.rows*searchParams.page
            }})
        }
    }
    const onOptionSelectChange = (e) => {
        setSearchParams((prevSearchParams) => {
            return{...prevSearchParams,enableStatus:e}
        })
    }
    const onUserNameSearch = (e) => {
        setSearchParams((prevSearchParams) => {
            return{...prevSearchParams,name:encodeURIComponent(e)}
        })
    }
    const handleFilterChange = (e) => {
        const currentSearchParams = {
            ...defaultParams,
            rows:e
        }
        setSearchParams(currentSearchParams);
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                isShowPrevPage: false,
                isShowNextPage:e<pageSetting.total
            }
        })

    }
    const handlePrevPage = () => {
        setSearchParams((prevSearchParams) => {
            return {
                ...prevSearchParams,
                page:prevSearchParams.page-1
            }
        });
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                isShowPrevPage: searchParams.page > 2,
                isShowNextPage:true
            }
        })
    }
    const handleNextPage = () => {
        setSearchParams((prevSearchParams) => {
            return {
                ...prevSearchParams,
                page:prevSearchParams.page+1
            }
        });
        setPageSetting((prevPageSetting) => {
            return {
                ...prevPageSetting,
                isShowNextPage: searchParams.rows * (searchParams.page + 1) < pageSetting.total,
                isShowPrevPage:true
            }
        })
    }
    return(
        <div>
            <h1  className={commonStyles.pageTitle}>账号管理</h1>
            <div className={commonStyles.headContainer}>
                <FilterComponent options={statusSelectOptions} onSelectChange={onOptionSelectChange} value={searchParams.enableStatus} />
                <InputComponent  placeholder="用户名" onSearch={onUserNameSearch}/>
            </div>
            {data.length>0&& <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>账号Id</th>
                            <th>用户名</th>
                            <th>性别</th>
                            <th>电子邮箱</th>
                            <th>用户相片</th>
                            <th>用户类型</th>
                            <th>创建时间</th>
                            <th>最近修改时间</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((row,index) => (
                                <tr key={index}>
                                    <td>{row.userId}</td>
                                    <td>{row.name}</td>
                                    <td>{genderType[row.gender]}</td>
                                    <td>{row.email}</td>
                                    <td><img src={IMAGE_PATH + row.profileImg} /></td>
                                    <td>{personType[row.userType] }</td>
                                    <td>{formatDate(row.createTime)}</td>
                                    <td>{formatDate(row.lastEditTime)}</td>
                                    <td>{ statusType[row.enableStatus]}</td>
                                    <td><EditButton row={row} setSearchParams={setSearchParams} /></td>
                                </tr>
                            ))
                        }
                    </tbody>
                    </table>}
            <div className={commonStyles.bottomContainer}>
                <FilterComponent options={pageFilterOptions} value={searchParams.rows} onSelectChange={handleFilterChange} />
                <span className={commonStyles.dividedSpan}></span>
                {pageSetting.isShowPrevPage&&<button  className={commonStyles.button} onClick={handlePrevPage} >上一页</button>}
                {pageSetting.isShowNextPage&&pageSetting.isShowPrevPage&& <span className={commonStyles.dividedSpan}></span>}
                {pageSetting.isShowNextPage&&<button className={commonStyles.button} onClick={handleNextPage}>下一页</button>}
            </div>
            
    </div>
   )
}
export default PersonInfoComponent;
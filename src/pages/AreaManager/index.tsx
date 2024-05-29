import React, { useEffect, useState } from 'react';
import { AREA_GET_PATH } from '../../config/requestConfig.ts';
import { getRequest } from '../../request/index.ts';
import styles from './index.module.scss'
import { formatDate } from '../../utils/dateUtil.ts';
import { AddButton, EditButton } from './Button.tsx';

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
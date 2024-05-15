import React, { useEffect, useState } from 'react';
import { AREA_GET_PATH } from '../../config/requestConfig.ts';
import { getRequest } from '../../request/index.ts';
const AreaManagerComponent = () => {
    const [data, setDate] = useState([]);
    useEffect(()=>{getPageData()},[])
    const getPageData = async () => {
        const response = await getRequest(AREA_GET_PATH, {})
        console.log("===re==",response)
        if (response?.rows) {
            setDate(response.rows);
        }
    }
    console.log("=====", data);
    if (!data) {
        return <></>
    } else {
        return (
            <div>
                <div>
                    <button/>
                </div>
                <table>
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
                                <td>{row.createTime}</td>
                                <td>{row.lastEditTime}</td>
                                <td><button/></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}
export  default  AreaManagerComponent;
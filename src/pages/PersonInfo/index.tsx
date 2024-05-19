import React, { useEffect, useState } from 'react';
import { postRequestJson } from '../../request/index.ts';
import { IMAGE_PATH, PERSON_INFO_GET } from '../../config/requestConfig.ts';
const EditButton = ()=>{
    //
    return(
       <div>
     <button>编辑</button>
       </div >
    )
}
//form 用户名 账号状态
const PersonInfoComponent = () => {
    const [data, setData] = useState([]);
    useEffect(() => { 
        getPersonData();
    }, []);
    const getPersonData = async () => {//PERSON_INFO_GET
        const params = {
            enableStatus: 'ALL',
            page: 1,
            rows:10
        }
        const response = await postRequestJson(PERSON_INFO_GET, {}, params);
        if (response.data?.rows) {
            setData(response.data?.rows);
        }
    }
    if (data.length <= 0) {
        return <></>
    }
    return <div>
        <div>
            <div>此处有个筛选框，用于做状态筛选（全部、启用、禁用）</div>
            <div>此处有个搜索框和筛选按钮，用于筛选搜索框输入的用户名</div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>账号Id</th>
                    <th>用户名</th>
                    <th>出生日期</th>
                    <th>性别</th>
                    <th>联系方式</th>
                    <th>电子邮箱</th>
                    <th>用户相片</th>
                    <th>顾客</th>
                    <th>店家</th>
                    <th>管理员</th>
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
                            <td>{row.gender}</td>
                            <td>联系方式</td>
                            <td>{row.email}</td>
                            <td><img src={IMAGE_PATH + row.profileImg} /></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{row.createTime}</td>
                            <td>{row.lastEditTime}</td>
                            <td><EditButton/></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
}
export default PersonInfoComponent;
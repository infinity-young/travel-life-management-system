import React from 'react';
//form 用户名 账号状态
const PersonInfoComponent = () => {
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
        </table>
    </div>
}
export default PersonInfoComponent;
import React from 'react';
//form 商铺名、店铺类别、优先级、店铺状态、商铺建议
const ShopManagerComponent = () => {
    return <div>
        <div>
            <div>状态查询，全部、启用、待审核、禁用</div>
            <div>店铺类别查询</div>
            <div>店铺名称模糊查询，此处有个输入框</div>
            <div>店铺Id筛选查询，此处有个筛选框</div>
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
        </table>
    </div>
}
export default  ShopManagerComponent;
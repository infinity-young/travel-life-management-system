import React, { useEffect, useState } from 'react';
import { CATEGORY_GET_PATH } from '../../config/requestConfig.ts';
import { postRequestJson } from '../../request/index.ts';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { ImageUploadItem, InputItem, SelectItem } from '../../components/dialogComponents/index.tsx';
const AddButton = () => {
    //
}
const EditButton = () => {
    const submitForm = () => {
        //
    }
    const resetForm = () => {
        //
    }
    const handleCategoryTitleChange = () => {
        //
    }
    const handleCategoryDesChange = () => {
        //
    }
    const handleCategorySelectChange = () => {
        //
    }
    const handleCategoryImageUpload = () => {
        //
    }
    const handleCategoryPriorityInputChange = () => {
        //
    }
    const selectOptions = {}
    
    const { renderModal, toggleModal } = useModal(submitForm, resetForm);
    return <div>
        <button onClick={toggleModal}>编辑</button>
        {
            renderModal(<div>
                <InputItem title="类别名称" onInputChange={handleCategoryTitleChange} />
                <InputItem title="类别描述" onInputChange={ handleCategoryDesChange} />
                {/* <SelectItem title="上级类别" options={selectOptions}  onSelectChange={handleCategorySelectChange} /> */}
                <ImageUploadItem title="类别图片" onImageUpload={handleCategoryImageUpload}  />
                <InputItem title="优先级" onInputChange={handleCategoryPriorityInputChange}  />
            </div>)
        }
    </div>
    
}
const CategoryManagerComponent = () => {
    const [data, setData] = useState([]);
    const getCategoryData = async () => {
        const response = await postRequestJson(CATEGORY_GET_PATH)
        if (response.data?.rows) {
            setData(response.data?.rows);
        }
    }
    useEffect(() => { getCategoryData() }, []);
    if (!data) {
        return <></>
    }
    return (
        <div>
            <table>
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
                                  <td>{row?.parent?.shopCategoryId}</td>
                                  <td>图片</td>
                                  <td>{row.priority}</td>
                                  <td>{row.createTime}</td>
                                  <td>{row.lastEditTime}</td>
                                <td><EditButton/></td>
                              </tr>
                      ))}
                </tbody>
                
            </table>
        </div>
    )

}
export default CategoryManagerComponent
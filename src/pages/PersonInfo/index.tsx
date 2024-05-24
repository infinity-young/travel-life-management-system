import React, { useEffect, useRef, useState } from 'react';
import { postRequestFormData, postRequestJson } from '../../request/index.ts';
import { IMAGE_PATH, PERSON_INFO_EDIT, PERSON_INFO_GET } from '../../config/requestConfig.ts';
import { useModal } from '../../hooks/modals/editModal.tsx';
import { InputItem, SelectItem, showToast } from '../../components/dialogComponents/index.tsx';
import { validateForm } from '../../utils/formUtil.ts';
import styles from './index.module.scss'
import { InputComponent } from '../../components/headComponents/index.tsx';
const EditButton = ({ row,setSearchParams }) => {
    const [formData, setFormData] = useState(row);
    const formDataRef = useRef(formData)
    useEffect(() => {
        formDataRef.current = formData;
    },[formData])
    const onSubmit = async () => {
        const validatedResult = validateForm(formDataRef.current);
        if (validatedResult.isValidated) {
            try {
                const formData = new FormData();
                formData.append("userId", formDataRef.current.userId);
                formData.append("enableStatus", formDataRef.current.enableStatus);
                const response = await postRequestFormData(PERSON_INFO_EDIT, formData);
                if (response.data?.success) {
                    setSearchParams((prevSearchParams) => {
                        return{...prevSearchParams, enableStatus: -1,}
                    })
                    showToast("修改账号信息成功");
                    toggleModal();
                } else {
                    showToast("修改账号信息失败")
                }
            } catch {
                showToast("修改账号信息失败")
            }
        }
    }
    const { toggleModal, renderModal } = useModal(onSubmit)
    const onUserNameChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                name:e
           }
       })
    }
    const onUserStatusChange = (e) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                enableStatus:e
            }
        })
    }
    const userStatuOptions = [
        { value: 0, label: "禁用" },
        { value: 1, label: "启用" },
        {value:-1,label:"全部"}
    ];
    return(
       <div>
            <button onClick={toggleModal}>编辑</button>
            {
                renderModal(
                    <div>
                        <div>编辑账号信息</div>
                        <InputItem title="用户名" onInputChange={onUserNameChange} value={formData.name} />  
                        <SelectItem title="账号状态" onSelectChange={onUserStatusChange} options={userStatuOptions} value={formData.enableStatus} />
                    </div>
                )
            }
       </div >
    )
}
//form 用户名 账号状态
const PersonInfoComponent = () => {
    const [data, setData] = useState([]);
    const defaultParams = {
        enableStatus: -1,
        page: 1,
        rows: 10,
        name:''
    }
    const [searchParams,setSearchParams]=useState(defaultParams)
    useEffect(() => { 
        getPersonData();
    }, [searchParams]);
    const getPersonData = async () => {
        const response = await postRequestJson(PERSON_INFO_GET, {}, searchParams);
        if (response.data?.rows) {
            setData(response.data?.rows);
        }
    }
    const personType = {
        1: "顾客",
        2: "店家",
        3:"管理员"
    }
    const statusType = {
        0:"禁用",
        1:"启用"
    }
    const genderType = {
        0: "男",
        1:"女"
    }
    const userStatuOptions = [
        { value: 0, label: "禁用" },
        { value: 1, label: "启用" },
        {value:-1,label:"全部"}
    ];
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
    return <div>
        <div>
            <SelectItem title="状态" options={userStatuOptions} onSelectChange={onOptionSelectChange} value={searchParams.enableStatus} />
            <InputComponent title="用户名搜索" placeholder="用户名" onSearch={onUserNameSearch}/>
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
                            <td>{row.createTime}</td>
                            <td>{row.lastEditTime}</td>
                            <td>{ statusType[row.enableStatus]}</td>
                            <td><EditButton row={row} setSearchParams={setSearchParams} /></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>}
    </div>
}
export default PersonInfoComponent;
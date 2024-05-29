import axios from 'axios';
import { BATH_PATH } from '../config/requestConfig.ts';
import { ResponseData } from '../model/ResponseData.ts';


export function getRequest<T>(path: string, params?: Record<string, any>):Promise<ResponseData<T>> {
  const fullPath = BATH_PATH + path;
  const searchParams = new URLSearchParams(params);
  return new Promise((resolve, reject) => {
    axios
      .get(fullPath, { params: searchParams })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function postRequestJson<T>(path:string,data?,params?):Promise<ResponseData<T>>{
  const fullPath=BATH_PATH+path;
  return new Promise((resolve,reject)=>{
    axios.post(fullPath, JSON.stringify(data), {
      params:params,
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(
     (response)=>{
      resolve(response)
     }
    ).catch(
     (error)=>{
      reject(error)
     }
    );
  })
}
export function postRequestFormData<T>(path:string,data?,params?):Promise<ResponseData<T>>{
  const fullPath=BATH_PATH+path;
  return new Promise((resolve,reject)=>{
    axios.post(fullPath,data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'json'
    }).then(
     (response)=>{
      resolve(response)
     }
    ).catch(
     (error)=>{
      reject(error)
     }
    );
  })
}
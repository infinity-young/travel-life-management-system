
export interface ResponseData<T=unknown> { // 使得 ResponseData 泛型 T 也是可选的
    data: T;
}

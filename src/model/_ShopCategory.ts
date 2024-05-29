import { ShopCategory } from './ShopCategory.ts';
export interface nonnull_t{
    shopCategoryId: number;
    shopCategoryName: string;
    shopCategoryDesc: string;
    shopCategoryImg: string;
    priority: number;
    createTime: string;
    lastEditTime: string;
    parent: ShopCategory.nonnull_t|null;
}
export interface t{
    shopCategoryId?: number;
    shopCategoryName?: string;
    shopCategoryDesc?: string;
    shopCategoryImg?: string;
    priority?: number;
    createTime?: string;
    lastEditTime?: string;
    parent?: ShopCategory.t|null;

}
export interface safe_t{
   readonly shopCategoryId: number;
   readonly shopCategoryName: string;
   readonly shopCategoryDesc: string;
   readonly shopCategoryImg: string;
   readonly priority: number;
   readonly createTime: string;
   readonly lastEditTime: string;
   readonly parent: ShopCategory.safe_t|null;

}

export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.shopCategoryId = u.shopCategoryId || 0;
    s.shopCategoryName = u.shopCategoryName || '';
    s.shopCategoryDesc = u.shopCategoryDesc || '';
    s.shopCategoryImg = u.shopCategoryImg || '';
    s.priority = u.priority || 0;
    s.createTime = u.createTime || '';
    s.lastEditTime = u.lastEditTime || '';
    s.parent = u.parent==null?null:ShopCategory.from(u.parent);
    return s;

    
}
import { AreaType } from './AreaType.ts'
import { ShopCategory } from './ShopCategory.ts'
import { PersonType } from './PersonType.ts'
export interface nonnull_t{
    shopId: number,
    shopName: string,
    shopAddr: string,
    shopDesc: string,
    phone: string,
    shopImg:string,
    priority: number,
    createTime: number,
    lastEditTime: number,
    enableStatus: number,
    advice: string,
    area:AreaType.nonnull_t,
    owner: PersonType.nonnull_t,
    shopCategory: ShopCategory.nonnull_t
}
export interface t{
    shopId?: number,
    shopName?: string,
    shopAddr?: string,
    shopDesc?: string,
    phone?: string,
    shopImg?:string,
    priority?: number,
    createTime?: number,
    lastEditTime?: number,
    enableStatus?: number,
    advice?: string,
    area?:AreaType.t,
    owner?: PersonType.t,
    shopCategory?: ShopCategory.t
}
export interface safe_t{
   readonly shopId: number,
   readonly shopName: string,
   readonly  shopAddr: string,
   readonly  shopDesc: string,
   readonly  phone: string,
   readonly  shopImg:string,
   readonly  priority: number,
   readonly  createTime: number,
   readonly lastEditTime: number,
   readonly enableStatus: number,
   readonly advice: string,
   readonly area:AreaType.nonnull_t,
   readonly owner: PersonType.safe_t,
   readonly shopCategory: ShopCategory.safe_t
}
export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.shopId = u.shopId || 0;
    s.shopName = u.shopName || '';
    s.shopAddr = u.shopAddr || '';
    s.shopDesc = u.shopDesc || '';
    s.phone = u.phone || '';
    s.shopImg = u.shopImg || '';
    s.priority = u.priority || 0;
    s.createTime = u.createTime || 0;
    s.lastEditTime = u.lastEditTime || 0;
    s.enableStatus = u.enableStatus || 0;
    s.advice = u.advice || '';
    s.owner = u.owner==null?PersonType.from(<PersonType.t>{}):PersonType.from(u.owner);
    s.shopCategory = u.shopCategory == null ? ShopCategory.from(<ShopCategory.t>{}) : ShopCategory.from(u.shopCategory);
    return s;
}
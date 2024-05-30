import { ShopType } from './ShopType.ts';

export interface nonnull_t{
    rows: ShopType.nonnull_t[];
    total: number;
}
export interface t{
    rows?: ShopType.t[]
    total?: number;
}
export interface safe_t{
    readonly rows: ShopType.safe_t[]
    readonly total:number
}
export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.rows = u.rows == null ? [] : u.rows.map((item: ShopType.t) => { return ShopType.from(item) });
    s.total = u.total || 0;
    return s;
}
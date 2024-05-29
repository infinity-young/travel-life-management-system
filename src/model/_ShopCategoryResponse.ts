import { ShopCategory } from './ShopCategory.ts';

export interface nonnull_t{
    rows: ShopCategory.nonnull_t[];
    total: number;
}
export interface t{
    rows?: ShopCategory.t[]
    total?: number;
}
export interface safe_t{
    readonly rows: ShopCategory.safe_t[]
    readonly total:number
}
export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.rows = u.rows == null ? [] : u.rows.map((item: ShopCategory.t) => { return ShopCategory.from(item) });
    s.total = u.total || 0;
    return s;
}

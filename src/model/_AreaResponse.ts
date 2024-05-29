import { AreaType } from './AreaType.ts';


export interface nonnull_t{
    rows: AreaType.nonnull_t[];
    total: number;
}
export interface t{
    rows?: AreaType.t[]
    total?: number;
}
export interface safe_t{
    readonly rows: AreaType.safe_t[]
    readonly total:number
}
export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.rows = u.rows == null ? [] : u.rows.map((item: AreaType.t) => { return AreaType.from(item) });
    s.total = u.total || 0;
    return s;
}

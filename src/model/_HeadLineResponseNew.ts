import { HeadLineType } from './HeadLine.ts';

export interface nonnull_t{
    rows: HeadLineType.nonnull_t[];
    total: number;
}
export interface t{
    rows?: HeadLineType.t[]
    total?: number;
}
export interface safe_t{
    readonly rows: HeadLineType.safe_t[]
    readonly total:number
}
export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.rows = u.rows == null ? [] : u.rows.map((item: HeadLineType.t) => { return HeadLineType.from(item) });
    s.total = u.total || 0;
    return s;
}

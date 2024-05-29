import { PersonType } from './PersonType.ts';

export interface nonnull_t{
    rows: PersonType.nonnull_t[];
    total: number;
}
export interface t{
    rows?: PersonType.t[]
    total?: number;
}
export interface safe_t{
    readonly rows: PersonType.safe_t[]
    readonly total:number
}
export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.rows = u.rows == null ? [] : u.rows.map((item: PersonType.t) => { return PersonType.from(item) });
    s.total = u.total || 0;
    return s;
}
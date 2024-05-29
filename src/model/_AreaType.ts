export interface nonnull_t {
    areaId: number,
    areaName: string,
    priority: number,
    createTime: number,
    lastEditTime: number
}
export interface t{
    areaId?: number,
    areaName?: string,
    priority?: number,
    createTime?: number,
    lastEditTime?: number
}
export interface safe_t{
   readonly areaId: number,
   readonly areaName: string,
   readonly priority: number,
   readonly createTime: number,
   readonly lastEditTime: number
}
export function from(m: t): safe_t{
    const u = m === null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.areaId = u.areaId || 0;
    s.areaName = u.areaName || '';
    s.createTime = u.createTime || 0;
    s.lastEditTime = u.lastEditTime || 0;
    return s
}
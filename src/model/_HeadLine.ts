import { HeadLineStatus } from '../config/enum.ts';

export interface nonnull_t{
    lineId: number;
    lineName: string;
    lineLink: string;
    lineImg: string|Blob;
    priority: number;
    enableStatus: number;
    createTime: string;
    lastEditTime: string;
}
export interface t{
    lineId?: number;
    lineName?: string;
    lineLink?: string;
    lineImg?: string|Blob;
    priority?: number;
    enableStatus?: number;
    createTime?: string;
    lastEditTime?: string;
}
export interface safe_t{
   readonly lineId: number;
   readonly lineName: string;
   readonly lineLink: string;
   readonly lineImg: string|Blob;
   readonly priority: number;
   readonly enableStatus: HeadLineStatus;
   readonly createTime: string;
   readonly lastEditTime: string;
}

export function from(m: t): safe_t{
    const u = m === null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.lineId = u.lineId || 0;
    s.lineName = u.lineName || '';
    s.lineLink = u.lineLink || '';
    s.lineImg = u.lastEditTime || '';
    s.priority = u.priority || 0;
    s.enableStatus = u.enableStatus || HeadLineStatus.Disabled;
    s.createTime = u.createTime || '';
    s.lastEditTime = u.lastEditTime || '';
    return s;

}
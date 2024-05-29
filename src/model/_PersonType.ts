import { ItemStatus } from '../config/enum.ts';

export interface nonnull_t{
    userId: number,
    name: string,
    profileImg: string,
    email: string,
    gender: string,
    enableStatus: ItemStatus,
    userType: number,
    createTime: string,
    lastEditTime: string
}
export interface t{
    userId?: number,
    name?: string,
    profileImg?: string,
    email?: string,
    gender?: string,
    enableStatus?: ItemStatus,
    userType?: number,
    createTime?: string,
    lastEditTime?: string
}
export interface safe_t{
    readonly userId: number,
    readonly name: string,
    readonly profileImg: string,
    readonly email: string,
    readonly gender: string,
    readonly enableStatus: ItemStatus,
    readonly userType: number,
    readonly createTime: string,
    readonly lastEditTime: string

}
export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.userId = u.userId || 0;
    s.name = u.name || '';
    s.profileImg = u.profileImg || '';
    s.email = u.email || '';
    s.gender = u.gender || '';
    s.enableStatus = u.enableStatus || ItemStatus.Disabled;
    s.userType = u.userType || 0;
    s.createTime = u.createTime || '';
    s.lastEditTime = u.lastEditTime || '';
    return s; 
}
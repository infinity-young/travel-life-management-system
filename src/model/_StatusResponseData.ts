export interface nonnull_t{
    success: boolean;
    
}
export interface t{
    success?: boolean;
}
export interface safe_t{
   readonly success: boolean;
}

export function from(m: t): safe_t{
    const u = m == null ? ({} as t) : m;
    const s = {} as nonnull_t;
    s.success = u.success || false;
    return s;
}


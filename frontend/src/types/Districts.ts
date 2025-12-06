import type { Ward } from "./Ward";

export interface Districts {
    name: string,
    code: number,
    codename: string,
    division_type: string,
    province_code: number,
    wards: Ward | null
}
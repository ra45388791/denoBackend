import { ReSendcode } from "./API_Enum.ts";

type member_Group = 'MASTER' | 'PLAYER' | '';

/**
 * 使用者組態
 */
interface UserSet {
    USER_ID: string;
    MEMBER_ID: string;
    MEMBER_GROUP: member_Group;
    ROOM_ID: string;
}

/**
 * 回傳body格式
 */
interface reSend {
    code: ReSendcode;
    status: boolean;
    body: any | Record<string | number | symbol, never>;
}



export type { member_Group }
export type { UserSet, reSend }
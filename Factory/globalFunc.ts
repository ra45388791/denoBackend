import { Cookie } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { UserSet, member_Group, reSend } from "../describe/enum/API_Type.ts";
// import { CookieOptions } from "express";
import { CookiesGetOptions } from "https://deno.land/x/oak/mod.ts";
import { SecureCookieMapGetOptions, SecureCookieMapSetDeleteOptions } from "https://deno.land/x/oak@v17.0.0/deps.ts";
import { ReSendcode } from "../describe/enum/API_Enum.ts";


/**
 * 產生隨機碼
 * @param count 
 * @returns string
 */
function RandomCode(count: number): string {
    const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    let dateNow = Date.now();
    const RandomStr: string[] = [];
    while (RandomStr.length < count) {
        const RandomNum: number = (dateNow * (RandomStr.length + 1)) % code.length;

        if (RandomStr[RandomStr.length - 1] === code[RandomNum]) {
            dateNow = Date.now() + (dateNow / RandomStr.length);
        } else {
            RandomStr.push(code[RandomNum]);
        }
    }

    return RandomStr.join('');
}

/**
 * 取得時間
 * 
 * @param type "string" | "Date"
 * @param addY 
 * @param addM 
 * @param addD 
 * @param addHH 
 * @param addMM 
 * @param addSS 
 * @returns 
 */
function GetDate(type: "string" | "Date", addY?: number, addM?: number, addD?: number, addHH?: number, addMM?: number, addSS?: number): string | Date {

    let date: Date = new Date(Date.now());

    const y: number = date.getFullYear() + (addY ?? 0);
    const m: number = date.getMonth() + (addM ?? 0);
    const d: number = date.getDate() + (addD ?? 0);
    const hh: number = date.getHours() + (addHH ?? 0);
    const mm: number = date.getMinutes() + (addMM ?? 0);
    const ss: number = date.getSeconds() + (addSS ?? 0);

    date = new Date(y, m, d, hh, mm, ss);


    switch (type) {
        case "string":
            const resultY: string = `${date.getFullYear()}`;
            const resultM: string = `${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}`;
            const resultD: string = `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
            return `${resultY}/${resultM}/${resultD} ${hh}:${mm}:${ss}`;
        case "Date":
            return date;
    }

}

/**
 *  建立使用者組態物件
 * 
 *  @param identity 使用者組別
 *  @param loginToken 登入token
 *  @returns  UserSet
 */
function createUserSet(identity: member_Group, loginToken: string): UserSet {

    const user: UserSet = {
        USER_ID: `USER_ID#${RandomCode(32)}`,
        MEMBER_GROUP: identity,
        MEMBER_ID: loginToken ? loginToken : "",  //登入? 會員ID : "";
        ROOM_ID: '',
    } as UserSet
    // const tokenStr: string = JWT_Encrypt(user);
    return user;
}

/**
 *  建立cookie安全設定物件
 * 
 *  path: "/",
 *  httpOnly: true,
 *  sameSite: "none",
 *  secure: true,
 *  maxAge: 1000 * 60 * 60 * 24
 *  @returns SecureCookieMapSetDeleteOptions
 */
function createCookieSet(): SecureCookieMapSetDeleteOptions {
    const result: SecureCookieMapSetDeleteOptions = {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24
    }
    return result
}

/**
 * 建立 response.body 物件
 * @param code 
 * @param status 
 * @param body 
 * @returns 
 */
function createReSend(code: ReSendcode, status: boolean, body: any | Record<string | number | symbol, never>): reSend {
    const result: reSend = { code: code, status: status, body: body }
    return result
}
export { RandomCode, createUserSet, GetDate, createCookieSet, createReSend };

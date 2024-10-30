import { create, verify, getNumericDate, Header } from 'https://deno.land/x/djwt/mod.ts';
import { Aes } from "https://deno.land/x/crypto@v0.10.1/aes.ts";
import { Cbc, Padding } from "https://deno.land/x/crypto/block-modes.ts";
import { decodeBase64, encodeBase64 } from "https://deno.land/std@0.221.0/encoding/base64.ts";
import { tokenType } from "../describe/enum/API_Enum.ts";
import { UserSet } from "../describe/enum/API_Type.ts";
import { Request } from "@oak/oak";
// import { Question_Mode_0, Question_Mode_1, Question_Type } from '@src/describe/type/GameType';



/*
class ParseQuestion {
    constructor() { }

    //Record<string, string> 是 redis 回傳的資料型態
    public static QuestionType(result: Record<string, string>, ModeCode: number): Question_Type {
        const PQ = new ParseQuestion();

        switch (ModeCode) {
            case 0:
                return PQ.mode_0();
            case 1:
                return PQ.mode_1();
            default:
                const err = PQ.mode_0();
                err.ID = "error";
                return err;
        }
    }

    public mode_0(): Question_Mode_0 {
        return {} as Question_Mode_0;
    }
    public mode_1(): Question_Mode_1 {
        return {} as Question_Mode_1;
    }
}
*/



/**
 * JWT
 */

async function JWT_Encrypt(data: any): Promise<string> {

    const keyStr: string = Deno.env.get("AES_KEY") || "";
    const keyBuf = new TextEncoder().encode(keyStr);


    //標頭
    const header: Header = { alg: "HS256", typ: "JWT" }
    //key
    const key = await JWT_createKey(keyBuf)

    //內容
    const payload = {
        iss: "xxxxxx7380.com",
        exp: getNumericDate(60 * 60 * 24), // 1天後過期
        sub: "Token",
        data: data,
    };

    // 使用 HMAC SHA256 生成 JWT
    const jwtString = await create(header, payload, key);
    console.log("生成的 JWT: ", jwtString);
    return jwtString;
}
async function JWT_Decrypt(jwtString: string): Promise<any> {

    let result = null;
    const keyStr: string = Deno.env.get("AES_KEY") || "";
    const keyBuf = new TextEncoder().encode(keyStr);
    //key
    const key = await JWT_createKey(keyBuf)

    

    try {
        result = await verify(jwtString, key);
    } catch (e) {
        console.error(e)
        result = null;
    }
    return result ? result.data : null;
}

async function JWT_createKey(keyBuffer: Uint8Array) {
    return await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "HMAC", hash: "SHA-256" },
        true,
        ["sign", "verify"],
    )
}


async function TokenCheck(req: Request, token: tokenType): Promise<string | UserSet | null> {
    // const tokenData = req.cookies[token];
    const tokenData = req.headers.get(token);
    console.log(tokenData);
    if (tokenData === null || tokenData === undefined || tokenData.trim() === '') { return null; }

    switch (token) {
        case tokenType.LOGIN_TOKEN: //登入
            return await JWT_Decrypt(tokenData) as string | null;
        case tokenType.WEB_TOKEN:   //參數
            return await JWT_Decrypt(tokenData) as UserSet;
    }
    return null;
}



//AES加密
function AES_Encrypt(payload: string): string {
    const config = Deno.env;
    const ByteEncoder = new TextEncoder();
    const payloadBuf = ByteEncoder.encode(payload);
    const key = ByteEncoder.encode(config.get("AES_KEY"));
    const iv = ByteEncoder.encode(config.get("AES_IV"));

    const cipher = new Cbc(Aes, key, iv, Padding.PKCS7)
    const encrypted = cipher.encrypt(payloadBuf);

    return encodeBase64(encrypted);
}

//AES解密
function AES_Decrypt(payload: string): string {
    const config = Deno.env;
    const ByteEncoder = new TextEncoder();
    const payloadBuf: Uint8Array = decodeBase64(payload);
    const key: Uint8Array = ByteEncoder.encode(config.get("AES_KEY"));
    const iv: Uint8Array = ByteEncoder.encode(config.get("AES_IV"));

    const cipher = new Cbc(Aes, key, iv, Padding.PKCS7)
    const decrypted = cipher.decrypt(payloadBuf);

    return decrypted.toString();
}



export { JWT_Encrypt, JWT_Decrypt };
export { TokenCheck };
export { AES_Encrypt, AES_Decrypt };
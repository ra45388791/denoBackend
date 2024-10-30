//firebase
import { F_db } from "../code/firebase.ts";
import { query, where, orderBy, getDocs } from "@firebase/firestore";
import { Query } from "@firebase/firestore";

import { Request, Router } from "@oak/oak";
// import { deleteCookie, getCookies, getSetCookies, setCookie } from "https://deno.land/std@0.224.0/http/cookie.ts";
import { CreateRoomPath, ReSendcode, tokenType } from "../describe/enum/API_Enum.ts"
import { UserSet, reSend } from "../describe/enum/API_Type.ts";
import { JWT_Encrypt, TokenCheck } from "../Factory/parseData.ts";
import { createUserSet, createCookieSet, createReSend } from "../Factory/globalFunc.ts";


const create_room: Router = new Router();

/**
 * 使用者首次進入，驗證token並設定cookie
 */
create_room.get('/', async (record) => {
    const req: Request = record.request;
    const loginToken = await TokenCheck(req, tokenType.LOGIN_TOKEN) as string;
    const token = await TokenCheck(req, tokenType.WEB_TOKEN) as UserSet;

    //!tips：如果進來的是開過房而且還在玩的房主，跳確認視窗，確認要繼續嗎，繼續會把房主狀態清掉

    if (!token) {
        //產token
        const user: UserSet = createUserSet("MASTER", loginToken);
        //加密
        const tokenStr: string = await JWT_Encrypt(user);
        //設定cookie
        record.cookies.set(tokenType.WEB_TOKEN, tokenStr, createCookieSet())
    }
    console.info("create_room事件：setToken成功")

    record.response.body = createReSend(ReSendcode.Success, true, {});
});







/**
 * 取題型
 */
create_room.get(CreateRoomPath.getQuestion, async (record) => {
    const req: Request = record.request;
    const token = await TokenCheck(req, tokenType.WEB_TOKEN) as UserSet;

    //沒token時 回傳異常狀態
    if (!token) {
        record.response.body = createReSend(ReSendcode.Failed, false, {});
        return;
    }

    //查詢firebase 題庫資料回傳
    // const questions: Array<any> = await getQuestion("MODE", 0);
    const questions: Array<any> = await getQuestion("ALL");
    record.response.body = createReSend(ReSendcode.Success, true, questions);
});






interface webRoomSet {
    RoomRoundTotle: number,
    questions: string[],
}
/**
 * 建立房間
 */
create_room.get(CreateRoomPath.createRoom, async (record) => {
    //隨機題型或自訂題型(需丟參數)
    const createMode: "Randon" | "Customize" = "Customize";
});

export default create_room;



async function getQuestion(type: "ALL" | "MODE" | "ID", Values?: Number | string[]): Promise<Array<any>> {
    //查題目
    let citiesRef: Query;
    switch (type) {
        case "ALL":
            citiesRef = await query(F_db.question, orderBy("ID", "desc"));
            break;
        case "MODE":
            citiesRef = await query(F_db.question, where('Mode', '==', Values ?? 0), orderBy("ID", "desc"));
            break;
        case "ID":
            if (!Array.isArray(Values)) {
                console.error("參數 Values 不是String陣列");
                return [];
            };
            citiesRef = await query(F_db.question, where('ID', 'in', Values), orderBy("ID", "desc"));
            break;
    }
    //解析資料
    const select = await getDocs(citiesRef);
    return select.docs.map(doc => doc.data()) ?? [];
}
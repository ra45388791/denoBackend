import { TokenCheck } from '../Factory/parseData.ts';
import { UserSet, reSend } from '../describe/enum/API_Type.ts';
import { tokenType } from '../describe/enum/API_Enum.ts'
import { ReSendcode } from '../describe/enum/API_Enum.ts';
import { Router } from "@oak/oak";



const Check: Router = new Router();

Check.get('/userToken', async (req) => {
    const loginToken = await TokenCheck(req, tokenType.LOGIN_TOKEN) as string;    //會員id
    const token = await TokenCheck(req, tokenType.WEB_TOKEN) as UserSet;
    // USER_ID: string;
    // MEMBER_GROUP: member_Group;
    // MEMBER_ID: string;
    // ROOM_ID: string;
    //拿 Roomid 查 redis 房間設定
    if (token) {
        req.response.body = { code: ReSendcode.Success, status: true }

    } else {
        req.response.body = { code: ReSendcode.Failed, status: false }

    }
});


export default Check;
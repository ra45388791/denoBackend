//用於遊戲房的API

import { Router } from "@oak/oak";

// import express from 'express';
// import { R_GetRoom } from '@src/db/redis/redis';
// import { AES_Encrypt, JWT_Encrypt, TokenCheck } from '@src/Factory/parseData';

// import { DB_Room_Set } from '@src/describe/type/GameType';
// import { UserSet, reSend, tokenType } from '@src/describe/type/SetType';
// import { ID_Prefix, playerRoomPath, ReSendcode } from '@src/describe/enum/API_Path';
// import { RandomCode, createCookieSet, createUserSet } from '@src/Factory/globalFunc';
// import { join } from 'path';

const player_room_api: Router = new Router();

player_room_api.get("/", async (record) => {
    record.response.body = "player_roomtext";
})


export default player_room_api;




// const PlayerRoom = express.Router();

// /**
//  * 確認token是否合法
//  * 確認房間設定是否存在
//  * 確認存在時 回傳 @{ UserSet } 和 @{ DB_Room_Set }
//  * 通過時回傳true 可連接到websocket
//  */
// PlayerRoom.get(playerRoomPath.checkRoomSet, async (req, res) => {
//     //!20240722 房間設定直接給 不要用socket
//     const loginToken = TokenCheck(req, tokenType.LOGIN_TOKEN) as string;    //會員id
//     /** token :
//      * USER_ID: string;
//      * MEMBER_GROUP: member_Group;
//      * MEMBER_ID: string;
//      * ROOM_ID: string;
//      */
//     const token = TokenCheck(req, tokenType.WEB_TOKEN) as UserSet;


//     //拿 Roomid 查 redis 房間設定
//     if (!token) {
//         res.send({ code: ReSendcode.Failed, status: false } as reSend);
//         return;
//     }


//     const roomSet: DB_Room_Set | undefined = await R_GetRoom(token.ROOM_ID);
//     if (roomSet === undefined) {
//         res.send({ code: ReSendcode.Failed, status: false } as reSend);
//     } else {

//         //* 這邊不需要用 createUserSet，到這裡應該要有產好的 UserSet在token中
//         const userSet: UserSet = {
//             USER_ID: token.USER_ID,
//             MEMBER_GROUP: token.MEMBER_GROUP,
//             MEMBER_ID: roomSet.Member_ID ?? "",
//             ROOM_ID: roomSet.RoomID ?? "",
//         }

//         //回傳玩家組態檔、房間組態檔
//         res.send({
//             code: ReSendcode.Success,
//             status: true,
//             body: { UserSet: userSet, RoomSet: roomSet }
//         } as reSend
//         );

//     };





// });



// //player 專用加入房間
// PlayerRoom.post(playerRoomPath.PLAYER_JOIN_ROOM, async (req, res) => {
//     const loginToken = TokenCheck(req, tokenType.LOGIN_TOKEN) as string;
//     let join_id: string = req.body.joinid;

//     //拿 Roomid 查 redis 房間設定
//     if (join_id.length !== 5) { console.error("join_id 長度應為5：" + " " + join_id); return; }
//     join_id = ID_Prefix.JoinID + join_id;
//     const RoomSet: DB_Room_Set | undefined = await R_GetRoom(join_id);

//     if (!RoomSet) {
//         res.send({ code: ReSendcode.Failed, status: false } as reSend);
//     } else {

//         //1.創造 UserSet 物件
//         let user: UserSet = createUserSet("PLAYER", loginToken);
//         //2.設定RoomID
//         user.ROOM_ID = RoomSet.RoomID ?? "";
//         //3.將 UserSet 加密
//         const token: string = JWT_Encrypt(user);
//         //4.設定cookie
//         res.cookie(tokenType.WEB_TOKEN, token, createCookieSet());

//         res.send({ code: ReSendcode.Success, status: true } as reSend);
//     };

// });



// ////回傳完整ROOM SET物件?
// PlayerRoom.get(playerRoomPath.GET_ROOMSET, async (req, res) => {
//     //! 20240730 直接由checkRoomSet 給資料

//     /*
//     const loginToken = TokenCheck(req, tokenType.LOGIN_TOKEN) as string;
//     const token = TokenCheck(req, tokenType.WEB_TOKEN) as UserSet;


//     if (!token) {
//         res.send({ code: ReSendcode.Failed, status: false } as reSend);
//         return;
//     }

//     //拿 Roomid 查 redis 房間設定
//     const RoomSet: DB_Room_Set | undefined = await R_GetRoom(token.ROOM_ID, 'ROOMID');

//     if (RoomSet === undefined) {
//         res.send({ code: ReSendcode.Failed, status: false } as reSend);
//     } else {
//         res.send({ code: ReSendcode.Success, status: true, body: RoomSet } as reSend);

//     };
// */
// });


// export default PlayerRoom;
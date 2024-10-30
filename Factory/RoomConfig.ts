import { UserSet, tokenType, reSend, userSetPackage } from '../describe/type/SetType';

import { RandomCode, GetDate } from './globalFunc';

import { Question_Modes, DB_Room_Set, DB_JoinID_Set } from '@src/describe/type/GameType';
import { Timestamp } from "firebase/firestore";
import { RoomStage } from "../describe/enum/GameEnum";

//redis
import { Redis } from 'ioredis';
import { DB_Mod, redisHash } from '../describe/enum/redisEnum';
import { ID_Prefix } from '@src/describe/enum/API_Path';
import { R_GetRoom } from '@src/db/redis/redis';

class RoomConfig {
    private User_ID: string | undefined = undefined;
    private Member_ID: string | undefined = undefined;
    private Member_Group: 'MASTER' | 'PLAYER' | '' = ''
    private RoomID: string | undefined = undefined;
    private RoomRound: number | undefined = undefined;
    private RoomRoundTotle: number | undefined = undefined;
    private JoinID: string | undefined = undefined;
    private Question: string | undefined = undefined;
    private RoomStage: RoomStage | undefined = undefined;
    private CreateDate: Timestamp | string | undefined = undefined;
    private EndDate: Timestamp | string | undefined = undefined;

    constructor(token: UserSet) {
        //設定token
        this.updateToken(token);

        //如果沒有roomID就離開
        if (!this.RoomID?.trim()) { return; }

        //!如果有roomID 就拿room資料
    }

    /**
     * 取得token物件
     * @returns UserSet | undefined
     */

    public getToken(): UserSet | undefined {
        if (this.User_ID === undefined || this.Member_ID === undefined || this.RoomID === undefined) {
            console.error(this.RoomID, this.User_ID, this.Member_ID + ' 缺少資料 ')
            return undefined;
        }
        const result: UserSet = {
            USER_ID: this.User_ID,
            MEMBER_ID: this.Member_ID,
            MEMBER_GROUP: this.Member_Group,
            ROOM_ID: this.RoomID
        }
        return result
    }

    /**
     * 更新token
     * @param token cookie解密後的token
     */
    public updateToken(token: UserSet) {
        this.User_ID = token.USER_ID
        this.Member_ID = token.MEMBER_ID;
        this.Member_Group = token.MEMBER_GROUP;
        this.RoomID = token.ROOM_ID;
    }

    /**
     * 創立房間
     * 必須參數：題目串
     * 
     * @param {Question_Modes} Questions 題目串
     * @returns {Promise<boolean>} 
     */
    public async createRoom(Questions: Question_Modes): Promise<boolean> {

        if (Questions.length <= 0) {
            return false;
        }

        if (this.Member_Group !== "MASTER") {
            console.error(`使用者組別不允許此操作：${this.Member_Group}`);
            return false;
        }
        else if (this.RoomID === undefined || this.User_ID === undefined || this.Member_ID === undefined) {
            console.error(this.RoomID, this.User_ID, this.Member_ID + ' 缺少資料 ')
            return false;
        }

        //解析題目串
        const Q_ToString = Questions.map(
            (e, index) => {
                return {
                    ID: index,
                    Question: JSON.stringify(e)
                }
            }
        );

        //! 檢查id joinid是否用過
        let roomid: string = this.RoomID = `${ID_Prefix.RoomID}${RandomCode(24)}`
        let joinid: string = `${ID_Prefix.JoinID}${RandomCode(5)}`;

        const CreateDate: string = GetDate("string") as string;
        const EndDate: string = GetDate("string", 0, 0, 1) as string;




        //檢查是否存在合法啟用中的RoomID(存在就更新id)(限制10次)
        let RoomIDCheck: boolean = false;
        let CheckCount = 0;
        while (RoomIDCheck === false && CheckCount < 20) {
            RoomIDCheck = await R_GetRoom(roomid) === undefined ? true : false;
            //存在時更新ID
            if (RoomIDCheck === false) {
                roomid = this.RoomID = `${ID_Prefix.RoomID}${RandomCode(24)}`
                joinid = `${ID_Prefix.JoinID}${RandomCode(5)}`;
                CheckCount += 1;
            }
        }

        if (!RoomIDCheck) {
            console.error(`重試超過${CheckCount + 1}次，請重新操作。`);
            return false;
        }


        //檢查通過時
        this.RoomID = roomid
        this.JoinID = joinid


        //組資料
        const svRoomSet: DB_Room_Set = {
            RoomID: this.RoomID,
            User_ID: this.User_ID,
            Member_ID: this.Member_ID,
            RoomRound: 0,
            RoomRoundTotle: Q_ToString.length,
            JoinID: this.JoinID,
            Question: JSON.stringify(Q_ToString),
            RoomStage: RoomStage.create_waitingPlayers,
            CreateDate: CreateDate,
            EndDate: EndDate,   // today + 1天
        }

        const client = new Redis();
        client.on('error', err => { console.log('error：', err); return false });

        //! 檢查root id 和 join id 是否已經用過了
        //! 如果用過的話檢查是否還在有效期間內， 是 回上一部重產id、否 刪掉該房間

        //批次寫入
        // HASH : 房間設定
        // SET  : 房間ID
        const status = await new Promise<boolean>((res, rej) => {
            client.multi()
                .hset(`${redisHash.ROOM}:${svRoomSet.RoomID}`, svRoomSet)
                .sadd(`${redisHash.JOIN_ID}:${svRoomSet.JoinID}`, svRoomSet.RoomID as string)
                .exec((err, result) => {
                    if (result) {
                        res(true);
                    } else {
                        console.log('error：', err);
                        rej(false);
                    }
                });

        })

        if (status) {
            //成功
            console.log(`R_CreateRoom：success \nuserID : ${svRoomSet.User_ID} \nRoomID : ${svRoomSet.RoomID} \njoinID : ${svRoomSet.JoinID}`)
        } else {
            //!失敗
            console.log("R_CreateRoom：fail")
        }


        return status;
    }

}

export default RoomConfig
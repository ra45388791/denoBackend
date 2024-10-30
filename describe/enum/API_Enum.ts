
/**
 * GameRoom 狀態
 */
enum RoomStage {
    create_waitingPlayers,  //創好房間等待玩家階段
    play_waitingPlayer,     //開始後等待準備階段
    play_waitingGameStart,  //按下開始遊戲後等待遊戲開始
    play_gameStart,         //遊戲中
    play_ShowCount,         //秀成績階段
    ending_showCount,       //所有倫次結束後結算
    roomEnd,                //遊戲結束

}

/**
 * 創建房間
 */
enum CreateRoomPath {
    getQuestion = "/get_question",
    createRoom = "/create_room"
}

/**
 * 遊戲房 playerRoomPath
 */
enum playerRoomPath {
    checkRoomSet = "/check_room_set",
    GET_ROOMSET = '/getRoomSet',

    //MASTER 專用API事件

    //PLAYER 專用API事件
    PLAYER_JOIN_ROOM = '/playerJoinRoom',
}

/**
 * ID前綴
 */
enum ID_Prefix {
    RoomID = "playerRoom#",
    JoinID = "join#"

}

/**
 * 回傳封包狀態碼
 */
enum ReSendcode {
    Success,
    Failed,
}

//playerroom


/**
 * token名稱定義
 */
enum tokenType {
    LOGIN_TOKEN = "loginToken",
    WEB_TOKEN = "webToken",
}



export { CreateRoomPath, playerRoomPath }
export { RoomStage, ID_Prefix }
export { ReSendcode }

//playerroom
export { tokenType }
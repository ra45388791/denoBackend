import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts"; //env變數
await load({ export: true })
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Application, Cookies } from '@oak/oak'
import { Router } from '@oak/oak/router'
import { deleteCookie, getCookies, getSetCookies, setCookie } from "https://deno.land/std@0.224.0/http/cookie.ts";
//API
// import Check from './API/Check';
// import Login from './API/Login';
// import Manber from './API/Manber';
import create_room from './API/create_room.ts';
import player_room_api from "./API/player_room_api.ts";
import { ReSendcode } from "./describe/enum/API_Enum.ts";
import { createReSend } from "./Factory/globalFunc.ts";
// import PlayerRoom from './API/PlayerRoomApi.ts';




const HOST: string = Deno.env.get("HOST") || "localhost";
const PORT: string = Deno.env.get("PORT") || '5050';

//主體
const app = new Application()
//路由
const router = new Router();
//cookie


//cors
// app.use(oakCors());

//cors(要在路由之後)
app.use(oakCors({
    origin: ["http://127.0.0.1:5500", "https://127.0.0.1:5500", "http://localhost:5500", "https://localhost:5500", "https://testfromend.web.app", "https://testfromend.firebaseapp.com"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ["Cookie", "Content-Type", "Authorization", 'credentials']
    // allowedHeaders: ["Cookie", "Content-Type"]
}));


router.use("/createroom", create_room.routes(), create_room.allowedMethods());
router.use("/player_room_api", player_room_api.routes(), player_room_api.allowedMethods())

//主路由
app.use(router.routes(), router.allowedMethods());

router.get('/', async (req) => {
    console.log("啟動get")

    //測試用而已
    // const q = await query(F_db.question, where("Mode", "==", 0), orderBy("ID", "desc"));
    // const docs = await getDocs(q);
    // const results: Array<any> = docs.docs.map(doc => doc.data());
    // req.response.body = JSON.stringify(results);

    req.response.body = createReSend(ReSendcode.Success, true, { body: "server 啟動成功" });
    req.response.status = 200;
});
router.post('/', async (req) => {
    req.response.body = createReSend(ReSendcode.Success, true, { body: "server post成功" });
    req.response.status = 200;
});


console.log(`啟動! https://${HOST}:${PORT}`)

// 測試環境
// await app.listen({
//     port: Number(PORT),
//     hostname: HOST,
//     // secure: true,
//     // cert: Deno.readTextFileSync("./cert/certificate.crt"),
//     // key: Deno.readTextFileSync("./cert/private.key"),
// });


// deno deploy環境
await app.listen({ port: Number(PORT) });


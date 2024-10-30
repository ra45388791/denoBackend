import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts"; //env變數
await load({ export: true })
import { initializeApp } from "@firebase/app";
// import { initializeApp } from "npm:firebase/app";
import { getFirestore, collection, Firestore } from "@firebase/firestore";
import { CollectionReference } from "@firebase/firestore";

type F_DB = {
    room: CollectionReference
    question: CollectionReference
}
let firebaseApp: any;
let store: Firestore;
let F_db: F_DB;

const firebaseConfig: any = {
    apiKey: Deno.env.get('apiKey'),
    authDomain: Deno.env.get('authDomain'),
    projectId: Deno.env.get('projectId'),
    storageBucket: Deno.env.get('storageBucket'),
    messagingSenderId: Deno.env.get('messagingSenderId'),
    appId: Deno.env.get('appId')
}
try {

    //建立連接
    firebaseApp = initializeApp(firebaseConfig, "firebase");
    //建立服務(Store)
    store = getFirestore(firebaseApp);

    //建立資料庫
    // const room: CollectionReference = collection(store, "Room");
    // const question: CollectionReference = collection(store, 'question');

    F_db = {
        room: collection(store, "Room"),
        question: collection(store, 'question'),
    }

} catch (e) {
    console.error(e);
}

export { F_db }



// const a = async () => { await query(F_db.room, where('Mode', '==', Values ?? 0)) }


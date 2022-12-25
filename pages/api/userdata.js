
import {getAuth} from 'firebase-admin/auth'
import {getFirestore}from 'firebase-admin/firestore'
import { app } from "../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,token}=req.body;
    //verify token
    getAuth(app).verifyIdToken(token)
    .then(async(decoded)=>{
      if(decoded.uid==uid){
        //fetching user data;
        db.collection('users').doc(uid).get().then(snap=>{
          if(snap.exists){
            res.status(200).json({error:false,data:snap.data()});
          }
        }).catch(e=>{});
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{});
  }
}

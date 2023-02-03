import {getAuth} from 'firebase-admin/auth'
import {getFirestore,FieldValue}from 'firebase-admin/firestore'
import { app } from "../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,token,address,phone}=req.body;
    //verify token
    getAuth(app).verifyIdToken(token)
    .then(async(decoded)=>{
      if(decoded.uid==uid){
        //fetching user data;
        let userRef=db.collection('users').doc(uid);
        await userRef.update({
          address,phone,
        });
        res.status(200).json({error:false,data:null});
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{
      console.log(e);
    });
  }
}

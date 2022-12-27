import { async } from '@firebase/util';
import {getAuth} from 'firebase-admin/auth'
import {getFirestore,FieldValue}from 'firebase-admin/firestore'
import { app } from "../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,token,index=0}=req.body;
    //verify token
    getAuth(app).verifyIdToken(token)
    .then(async(decoded)=>{
      if(decoded.uid==uid){
        //fetching user data;
        let userRef=db.collection('users').doc(uid);
        userRef.get().then(async(snap)=>{
          if(snap.exists){
            if(index!=-1){
              //finding cart element to be removed
              let el=snap.data().cart[index];
              //remove element
              await userRef.update({
              cart:FieldValue.arrayRemove(el)
              });
          }else{
            //delete all elements
            await userRef.update({
              cart:[]
              });
          }
          }
        }).catch(e=>{});
        res.status(200).json({error:false,data:null});
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{
      console.log(e);
    });
  }
}

import {getFirestore}from 'firebase-admin/firestore'
import {getAuth}from 'firebase-admin/auth'
import { app } from "../../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,token,data}=req.body;
    db.collection('admin').doc(uid).get().then(snap=>{
      if(snap.exists){
        let admin=snap.data();
        getAuth(app).verifyIdToken(token).then(async(decoded)=>{
          if(decoded.uid==uid){
            //admin verified
            let p=db.collection('products').doc(data);
            db.collection('orders').where('productID','==',p).get().then(snap=>{
              if(snap.empty){
                p.delete().then(()=>{
                  res.status(200).json({error:false,data:null});
                })
              }
            });
      }}).catch(e=>{
        res.status(200).json({error:true,data:null});
      });
      }else{
        res.status(200).json({error:true,data:null});
      }
    });        
  }
}

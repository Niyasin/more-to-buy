import {getFirestore}from 'firebase-admin/firestore'
import {getAuth}from 'firebase-admin/auth'
import { app } from "../../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,token}=req.body;
    db.collection('admin').doc(uid).get().then(snap=>{
      if(snap.exists){
        let admin=snap.data();
        getAuth(app).verifyIdToken(token).then(async(decoded)=>{
          if(decoded.uid==uid){
            //admin verified
            db.collection('orders').orderBy('status','asc').get().then(snap=>{
              let data=[];
              snap.forEach(async(e)=>{
                let d=e.data();
                d.productID.get().then(s=>{
                  d.name=s.data().name;
                  d.id=e.id;
                  d.uid.get().then(u=>{
                    let U=u.data();
                    d.user={
                      username:U.username,
                      email:U.email,
                    } 
                    data.push(d);
                    if(data.length==snap.size){
                      res.status(200).json({error:false,data});
                    }                  
                  });
                });
              }
              );
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

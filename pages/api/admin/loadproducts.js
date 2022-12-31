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
            db.collection('products').get().then(sn=>{
              let data=[]; 
            sn.forEach(e=>{
              let D=e.data();
              data.push({
                id:e.id,
                name:D.name,
                prize:D.prize,
                image:D.images[0],
                orders:0,
                stock:0,
              });
            });
            res.status(200).json({error:false,data:data});
        }).catch(e=>{
          console.log(e);
          res.status(200).json({error:true,data:null});
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

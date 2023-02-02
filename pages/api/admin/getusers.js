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
            db.collection('users').get().then(u=>{
              let data=[];
              u.forEach(e=>{
                let userData=e.data();
                let d={
                  id:e.id,
                  username:userData.username,
                  email:userData.email,
                  phone:userData.phone,
                  address:userData.address,
                  activeOrders:userData.orders.length,
                };
                data.push(d);
              })
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

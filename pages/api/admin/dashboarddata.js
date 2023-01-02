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
            let data={
              orders:0,
              toDeliver:0,
              toShip:0,
              notifications:[],
              products:0,
            };
            db.collection('orders').get().then(snap=>{
              snap.forEach(async(e)=>{
                let d=e.data();
                if(d.status<2){data.orders++}
                if(d.status==0){data.toShip++;}
                if(d.status==1){data.toDeliver++;}
              });
              db.collection('products').get().then(products=>{
                products.forEach(e=>{
                  data.products++;
                  let d=e.data();
                  if(d.stock==0){
                    data.notifications.push(d.name);
                  }
                  if(data.products==products.size){
                    res.status(200).json({error:false,data});
                  }
                })
              });
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

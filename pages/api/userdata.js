
import { async } from '@firebase/util';
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
            let data=snap.data();
            let finish=0;
            //referencing cart array
            let cart=[];
            if(data.cart.length==0){finish++}
            data.cart.forEach(async (e,i)=>{
              let s= await db.collection('products').doc(e.productID).get()
                let d=s.data();
                cart.push({
                  productID:s.id,
                  name:d.name,
                  prize:d.prize,
                  count:e.count,
                  image:d.images[0],
                });
                if(i==data.cart.length-1){
                  data.cart=cart;
                  finish++;
                  if(finish==2){res.status(200).json({error:false,data:data})}
                }
            });
            // referencing orders array
            let orders=[];
            if(data.orders.length==0){finish++}
            data.orders.forEach(async (e,i)=>{
            let s= await e.get();
            let d=s.data();
            let p=await d.productID.get();
            orders.push({
              productID:d.id,
              name:p.data().name,
              prize:d.prize,
              count:d.count,
              status:d.status,
            });
            if(i==data.orders.length-1){
              data.orders=orders;
              finish++;
              if(finish==2){res.status(200).json({error:false,data:data})}
            }
            });
          if(finish==2){res.status(200).json({error:false,data:data})}
          }
        });
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{});
  }
}

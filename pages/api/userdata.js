
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
            //referencing cart array
            let cart=[];
             data.cart.forEach(async (e,i)=>{
              let s= await db.collection('products').doc(e.productID).get()
                let d=s.data();
                cart.push({
                  name:d.name,
                  prize:d.prize,
                  count:e.count,
                  image:d.images[0],
              });
              if(i==data.cart.length-1){
                data.cart=cart;
                res.status(200).json({error:false,data:data});
              }
            }).then(()=>{
            });
          }
        }).catch(e=>{});
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{});
  }
}

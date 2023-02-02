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
        let userRef=db.collection('users').doc(uid);
        userRef.get().then(snapshot=>{
          if(snapshot.exists){
            let userdata=snapshot.data();
            //reference cart array
            let data=[];
            userdata.wishlist.forEach(e=>{
              db.collection('products').doc(e).get().then((p)=>{
                let product =p.data();
                data.push({
                  id:p.id,
                  name:product.name,
                  prize:product.prize,
                  status:product.status,
                  image:product.images[0],
                });
                if(data.length==userdata.wishlist.length){
                  res.status(200).json({error:false,data:data});
                }
              }).catch(e=>{})
            });
         }   
        });
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{});
  }
}


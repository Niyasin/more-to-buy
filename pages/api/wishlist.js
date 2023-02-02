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
              e.get().then((product)=>{
                data.push({
                  id:product.id,
                  name:product.name,
                  prize:product.prize,
                  status:product.status,
                  image:product.images[0],
                });
              }).catch(e=>{})
            });
            res.status(200).json({error:false,data:data});
            
            
         }   
        });
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{});
  }
}


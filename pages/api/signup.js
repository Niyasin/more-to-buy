import {getAuth} from 'firebase-admin/auth'
import {getFirestore}from 'firebase-admin/firestore'
import { app } from "../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,username,token,email}=req.body;
    //verify token
    getAuth(app).verifyIdToken(token)
    .then(async(decoded)=>{
      if(decoded.uid==uid){
        //fetching user data;
        let userRef=db.collection('users').doc(uid);
        let usersnap=await userRef.get();
        if(usersnap.exists){
          res.status(200).json({error:false,data:null});
        }else{
          userRef.set({
            username:username,
            uid:uid,
            email:email,
            address:null,
            phone:null,
            orders:[],
            cart:[],
            wishlist:[],
          });
          res.status(200).json({error:false,data:null});
        }
      }
    });
  }
}

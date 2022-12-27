
import {getAuth} from 'firebase-admin/auth'
import {getFirestore,FieldValue}from 'firebase-admin/firestore'
import { app } from "../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,token,products=[],address,phone,payment}=req.body;
    //verify token
    getAuth(app).verifyIdToken(token)
    .then(async(decoded)=>{
      if(decoded.uid==uid){
        let user = db.collection('users').doc(uid);
        products.forEach(async ({productID,prize,count})=>{
          let data={
            count,prize,payment,address,phone,
            uid:user,
            productID:db.collection('products').doc(productID),
            status:0,
          }
          let r = await db.collection('orders').add(data);
          
          user.update({
              orders:FieldValue.arrayUnion(r),
            }).then(()=>{
              });
            })
          res.status(200).json({error:false,data:null});
        }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{});
  }
}

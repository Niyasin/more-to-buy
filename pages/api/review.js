import {getAuth} from 'firebase-admin/auth'
import {getFirestore,FieldValue}from 'firebase-admin/firestore'
import { app } from "../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,token,order,rating,review}=req.body;
    //verify token
    let auth=getAuth(app);
    auth.verifyIdToken(token)
    .then(async(decoded)=>{
      if(decoded.uid==uid){
        //fetching order data;
        let orderRef=db.collection('orders').doc(order);
        orderRef.get().then(ordersnap=>{
          if(ordersnap.exists){
            //fetching product data
            let productRef=ordersnap.data().productID;
            productRef.get().then(productsnap=>{
              if(productsnap.exists){
                let product=productsnap.data();
                //loading user data
                auth.getUser(uid).then(user=>{
                  //adding review to review array and updating rating value
                  productRef.update({
                  review:FieldValue.arrayUnion({
                    name:user.displayName,
                    rating,
                    text:review,
                  }),
                  rating:Math.round(100*((product.rating*product.review.length)+rating)/(product.review.length+1))/100,
                });

                //updating order status
                orderRef.update({
                  status:3,
                }).then(()=>{
                  //sending response;
                  res.status(200).json({error:false,data:null});
                });
              });
              }else{
                res.status(200).json({error:true,data:null});
              }
            });
          }else{
            res.status(200).json({error:true,data:null});
          }
        }).catch(e=>{})
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{
      
    });
  }
}

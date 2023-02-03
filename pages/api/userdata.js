
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
        let userRef=db.collection('users').doc(uid);
        userRef.get().then(snapshot=>{
          if(snapshot.exists){
            let userData=snapshot.data();

            //send response function
            let ordersFinished=false;
            let cartFinished=false;
            const sendResponse=()=>{
              if(cartFinished&&ordersFinished){
                res.status(200).json({error:false,data:{
                  ...userData,
                  cart,
                  orders,
                }});
              }
            }  



            //reference cart array
            let cart=[];
            if(cart.length==0){cartFinished=true;sendResponse();}
            userData.cart.forEach(async (e,i)=>{
              let productRef=db.collection('products').doc(e.productID);
              productRef.get().then((productsnap)=>{
                let product=productsnap.data();
                cart.push({
                  productID:productsnap.id,
                  name:product.name,
                  prize:product.prize,
                  count:e.count,
                  image:product.images[0],
                });
                if(i==userData.cart.length-1){
                  cartFinished=true;
                  sendResponse();
                }
              });
            });
            
            
            // prepare orders array
            let orders=[];
            db.collection('orders').where('uid','==',userRef).get().then(ordersnap=>{
              if(ordersnap.size==0){ordersFinished=true;sendResponse();}
              ordersnap.forEach(e=>{
                let order=e.data();
                order.productID.get().then((productsnap)=>{
                  let product=productsnap.data();
                  orders.push({
                    orderID:e.id,
                    productID:productsnap.id,
                    name:product.name,
                    prize:order.prize,
                    image:product.images[0],
                    count:order.count,
                    status:order.status,
                  });
                  if(orders.length==ordersnap.size){
                    ordersFinished=true;
                    sendResponse();
                  }
                });
              });
            });
          }
        
            
        });
      }else{
        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{});
  }
}


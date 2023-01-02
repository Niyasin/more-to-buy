
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
        let userRef = db.collection('users').doc(uid);
        let orderRef = db.collection('orders');
        
        //for each products
        products.forEach(async ({productID,prize,count},i)=>{
          let productRef =  db.collection('products').doc(productID);

          let data={
            count,prize,payment,address,phone,
            uid:userRef,
            productID:productRef,
            status:0,
          }

          //checking stock
          productRef.get().then((snapshot)=>{
            let product=snapshot.data();
            if(product.stock>=count){
              //if Available

              //add in orders
              orderRef.add(data).then(()=>{
                //update stock
                
                if(product.stock-count==0){ //if soldout

                  productRef.update({
                    stock:0,
                    status:false,
                  }).then(()=>{
                    if(i==products.length-1){
                      res.status(200).json({error:false,data:null});
                    }
                  });
                  
                }else{

                  productRef.update({
                    stock:FieldValue.increment(-count),
                  }).then(()=>{
                    if(i==products.length-1){
                      res.status(200).json({error:false,data:null});
                    }
                });
                
                }
              }).catch(e=>{res.status(200).json({error:true,data:null})});
            }else{
              //if not available send error
              res.status(200).json({error:true,data:null});
            }
          });  
        });

      }else{

        res.status(200).json({error:true,data:null});
      }
    }).catch(e=>{});
  }
}

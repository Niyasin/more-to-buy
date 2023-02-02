import {getFirestore}from 'firebase-admin/firestore'
import { app } from "../../firebase/server";
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='GET'){
        db.collection('products').get().then(snap=>{
            let data=[];
            snap.forEach(e=>{
              let D=e.data();
              if(D.status){
                data.push({
                  id:e.id,
                  name:D.name,
                  prize:D.prize,
                  image:D.images[0],
                });
              }
            })
            res.status(200).json({error:false,data:data}); 
        }).catch(e=>{
          console.log(e);
          res.status(200).json({error:true,data:null});
        });
  }
}

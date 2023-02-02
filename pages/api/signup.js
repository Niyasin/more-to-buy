import { collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {initFireBase} from '../../firebase/client';
const app=initFireBase();
const db=getFirestore(app);
export default async function handler(req, res) {
  if(req.method=='POST'){
    let {uid,username,email}=req.body;
    //fetching user collection for user
    let ref = doc(db,'users',uid)
    let snap = await getDoc(ref);
    if(snap.exists()){
    }else{
      //creating new user record
      let users=collection(db,'users');
      await setDoc(doc(users,uid),{
        username:username,
        uid:uid,
        email:email,
        address:null,
        phone:null,
        orders:[],
        cart:[],
        wishlist:[],
      });
    }
    res.status(200).json(req.body);
  }
}

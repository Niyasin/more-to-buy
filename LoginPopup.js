import N from './styles/LoginPopup.module.css';
import { useEffect, useState } from 'react';
import {initFireBase} from './firebase/client';
import {GoogleAuthProvider,signInWithPopup,getAuth} from 'firebase/auth'

  //firebase
  const app=initFireBase();
  const provider=new GoogleAuthProvider();
  const auth = getAuth(app);

  //functions
  const signInGoogle= async ()=>{
    try{
      const result=await signInWithPopup(auth,provider);
      setUser({
        username:result.user.displayName,
        displayname:result.user.displayName,
        profilepic:result.user.photoURL,
        email:result.user.email,
        uid:result.user.uid,
      });
      let xhr=new XMLHttpRequest();
      xhr.open('POST','/api/signup');
      xhr.setRequestHeader('Content-Type','application/json');
      xhr.send(JSON.stringify({
        username:result.user.displayName,
        profilepic:result.user.photoURL,
        email:result.user.email,
        uid:result.user.uid,
      }));
    }catch(e){}
  }
const LoginPopup=(prop)=>{
    const [email,setEmail]=useState(null);
    const [password,setPassword]=useState(null);
    return(
        <div className={N.wrap}>
        <div className={N.container}>
            <svg 
            className={N.iconButton}
            onClick={prop.toggle}
            width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="2" d="m7 7 10 10M7 17 17 7"/></svg>
            <h1>Login</h1>
            <input placeholder='Email' type="email" onChange={e=>{setEmail(e.target.value)}}/>
            <input placeholder='Password' type="password" onChange={e=>{setPassword(e.target.value)}}/>
            
            <div className={N.button}>
            Submit
            </div>
            OR
            <div className={N.button} onClick={()=>{signInGoogle().then(prop.toggle)}}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/><path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/></svg>
            Continue With Google
            </div>

            <div className={N.button}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#3B5998" fill-rule="evenodd" d="M9.945 22v-8.834H7V9.485h2.945V6.54c0-3.043 1.926-4.54 4.64-4.54 1.3 0 2.418.097 2.744.14v3.18h-1.883c-1.476 0-1.82.703-1.82 1.732v2.433h3.68l-.736 3.68h-2.944L13.685 22"/></svg>
            Continue With Facebook
            </div>

        </div>
        </div>
    );
}
export default LoginPopup;
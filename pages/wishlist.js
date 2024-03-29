import Head from 'next/head'
import { useEffect, useState } from 'react';
import wishlist from '../styles/Wishlist.module.css';
import Nav from '../Nav.js';
import LoginPopup from '../LoginPopup';
import {initFireBase} from '../firebase/client';
import {GoogleAuthProvider,signInWithPopup,getAuth} from 'firebase/auth'

export default function Home() {

  //states
  const [user,setUser]=useState(null);
  const [items,setItems]=useState([]);
  
  
  //firebase
  const app=initFireBase();
  const provider=new GoogleAuthProvider();
  const auth = getAuth(app);

  const signout=async ()=>{ 
    await auth.signOut();
  }


  //effects
  useEffect(()=>{
    //auto login
    auth.onAuthStateChanged(user=>{
      if(user){
        setUser({
          username:auth.currentUser.displayName,
          displayname:auth.currentUser.displayName,
          profilepic:auth.currentUser.photoURL,
          email:auth.currentUser.email,
          uid:auth.currentUser.uid,
        });
      }else{
        setUser(null);
      }
    });
  },[]);
  useEffect(()=>{
    if(user){loadData();}
  },[user]);

  const loadData=async ()=>{
    if(user){
        let token=await auth.currentUser.getIdToken();
        let xhr =new XMLHttpRequest();
        xhr.open('POST','/api/wishlist');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({
            uid:user.uid,
            token:token,
        }));
        xhr.onload=()=>{
            let d=JSON.parse(xhr.responseText);
            if(!d.error){
                setItems(d.data);
                
            }
        }
  }  
}
const dropFromWishlist=async (id)=>{
  if(user){
    let token=await auth.currentUser.getIdToken();
    let xhr = new XMLHttpRequest();
    xhr.open('POST','/api/dropfromwishlist');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
      uid:user.uid,
      token:token,
      productID:id,
    }));
    xhr.onload=()=>{
      let d=JSON.parse(xhr.responseText);
      if(!d.error){
        loadData();
      }
    }
  }
}
  return (
    <>{user?
      <div className={wishlist.container}>
      <Head>
        <title>More To Buy</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Nav user={user}/>
      <div className={wishlist.header}>
        <h2>Wishlist</h2>
        {user?<>
        <img className={wishlist.profilepic} src={user.profilepic}/>
        <div className={wishlist.dropdown}>
          <h2>▿ {user.username}</h2>
          <div>
            <h2 onClick={()=>{window.location='/dashboard'}}>Dashboard</h2>
            <h2 onClick={()=>{window.location='/wishlist'}}>Wishlist</h2>
            <h2 onClick={()=>{window.location='/dashboard'}}>Cart</h2>
            <h2 onClick={()=>{window.location='/dashboard'}}>Orders</h2>
            <h2 onClick={signout}>Logout</h2>
          </div>
        </div>
        </>:
        <div className='button' onClick={toggleLoginPopup}>Login</div>
        }
      </div>
      <div className={wishlist.products}>
        {items.map(p=>{
          return(
            <Item item={p} dropFromWishlist={dropFromWishlist}/>
          )
        })}
      </div>
      </div>
      :
      <LoginPopup/>
  }</>
  );
}

const Item =({item,dropFromWishlist})=>{
  return(
    <div className='item'>
      <span className={wishlist.btn} onClick={()=>{dropFromWishlist(item.id)}}>🗙</span>
      <img src={item.image} onClick={()=>{window.location='/'+item.id}}/>
      <h2>{item.name}</h2>
      <h3>{item.prize} USD</h3>
    </div>
  )
}


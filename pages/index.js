import Head from 'next/head'
import { useEffect, useState } from 'react';
import home from '../styles/Home.module.css';
import Nav from '../Nav.js';
import LoginPopup from '../LoginPopup';
import {initFireBase} from '../firebase/client';
import {collection,getDocs,getFirestore} from 'firebase/firestore';
import {GoogleAuthProvider,signInWithPopup,getAuth} from 'firebase/auth'

export default function Home() {

  //states
  const [user,setUser]=useState(null);
  const [items,setItems]=useState([]);
  
  
  //firebase
  const app=initFireBase();
  const db =getFirestore(app);
  const provider=new GoogleAuthProvider();
  const auth = getAuth(app);
  
  //login Popup
  const [lgPopup,setLgPopup]=useState(false);
  const toggleLoginPopup=()=>{
    lgPopup?setLgPopup(false):setLgPopup(true);
  }

  const signout=async ()=>{ 
    await auth.signOut();
  }
  const loadProducts=async()=>{
    let xhr=new XMLHttpRequest();
    xhr.open('GET','/api/products');
    xhr.onload=()=>{
      let data=JSON.parse(xhr.responseText);
      if(!data.error){
        setItems(data.data);
      }
    }
    xhr.send();
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

    loadProducts();
  },[]);

  return (
    <div className={home.container}>
      <Head>
        <title>More To Buy</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      {lgPopup?<LoginPopup toggle={toggleLoginPopup}/>:<></>}
      <Nav user={user} signout={signout} login={toggleLoginPopup}/>
      <div className={home.header}>
        <input type="text" className={home.input} placeholder='Search'/>
        <div className='button' onClick={()=>{}}>Search</div>
        {user?
        <img className={home.profilepic} src={user.profilepic}/>
        :
        <div className='button' onClick={toggleLoginPopup}>Login</div>
        }
      </div>
      <div className={home.products}>
        {items.map(p=>{
          return(
            <Item item={p}/>
          )
        })}
      </div>
      
    </div>
  );
}

const Item =({item})=>{
  return(
    <div className='item' onClick={()=>{window.location='/'+item.id}}>
      <img src={item.image}/>
      <h2>{item.name}</h2>
      <h3>${item.prize}</h3>
    </div>
  )
}

const Slider =()=>{
  const [value,setValue]=useState(10);
  return(
    <div className='horizontal'>
      <input type='range'step={100} min={10} max={1000} onChange={e=>{setValue(e.target.value)}}/>
      <h3>${value}</h3>
    </div>
  )
}

const TagSelector =({tags,name})=>{
  const [selected,setSelected]=useState([]);
  return(
  <div className='filter'>
    <div className='horizontal'>
    <h1>{name}</h1>
    <div className='iconButton' onClick={()=>{setSelected([])}}>
      {selected.length?<svg viewBox="0 0 24 24"><path fill="none" stroke="#666" stroke-width="3" d="m3 3 18 18M3 21 21 3"/></svg>:''}
    </div>
    </div>
  <div className='tags'>
    {tags.map(t=>{
      let c;
      if(selected.includes(t)){
        c='tag selectedTag'
      }else{
        c='tag';
      }
      return(
        <div
        className={c} 
        onClick={()=>{
            let i=selected.indexOf(t);
            if(i!=-1){
              setSelected(selected.filter(e=>{return(e!=t)}));
            }else{
              setSelected(selected.concat(t));
            }
          }}
          >{t}</div>  
          )
        })}
  </div>
  </div>
  );
  }

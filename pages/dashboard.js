import { useState ,useEffect} from 'react';
import DB from '../styles/Dashboard.module.css';
import Nav from '../Nav.js';
import {initFireBase} from '../firebase/client';
import {collection,getDocs,getFirestore} from 'firebase/firestore';
import {GoogleAuthProvider,signInWithPopup,getIdToken,getAuth} from 'firebase/auth'
export default function Dashboard(){
    const [user,setUser]=useState(null);
    const [data,setData]=useState({
        username:null,
        email:null,
        phone:null,
        image:null,
        address:null,
        orderCount:0,
        cart:[],
    });
    //functions
    const signout=async ()=>{ 
        await auth.signOut();
        window.location='/'
    }

    const loadData=async ()=>{
        if(user){
            let token=await auth.currentUser.getIdToken();
            let xhr =new XMLHttpRequest();
            xhr.open('POST','/api/userdata');
            xhr.setRequestHeader('Content-Type','application/json');
            xhr.send(JSON.stringify({
                uid:user.uid,
                token:token,
            }));
            xhr.onload=()=>{
                let d=JSON.parse(xhr.responseText);
                if(!d.error){
                    setData(d.data);
                }
            }
        }  
    }

  //firebase
  const app=initFireBase();
  const db =getFirestore(app);
  const provider=new GoogleAuthProvider();
  const auth = getAuth(app);


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
        loadData();
      },[user]);
    return(
        <>
        {user?
        <div className={DB.container}>
            <div className={DB.box}> 
            <div className='horizontal'>
            <img src={user.profilepic}/>
            <h1>{user.username}</h1>
            </div>
            <p>{user.email}</p>
            </div>

            <div className={DB.box}> 
            <div className='horizontal'>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-width="2" d="M12 22s-8-6-8-12c0-5 4-8 8-8s8 3 8 8c0 6-8 12-8 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
            <h1>Address</h1>
            </div>
            <p>{data.address}</p>
            </div>
            
            <div className={DB.box}> 
            <div className='horizontal'>
            <svg  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"stroke-width="2" ><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>
            <h1>Status</h1>
            </div>
            <p>{data.orderCount} Active Orders</p>
            </div>

            <div className={DB.box}> 
            <div className={DB.boxHeader}>
                <div className='horizontal'>
                    <svg  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"stroke-width="2" ><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>
                    <h1>Cart</h1>
                </div>
                <div className='horizontal'>
                    <div className='button'>Buy</div>
                    <div className='button'>Clear</div>
                </div> 
            </div> 
            <div className='horizontal'>
            </div>
            <div className={DB.cartList}> 
            {data.cart.map((item,i)=>{
                return(
                    <CartItem {...item}/>
                    );
                })}
                </div>

            </div>
            <Nav user={user} signout={signout} />
        </div>
        :<>
        </>}
        </>
    );
}
const CartItem=({name,prize,image})=>{
    return(
        <div className={DB.cartItem}>
            <img src={image}/>
            <h1>{name}</h1>
            <h3>{prize}</h3>
            <div className='button'>Buy Now</div>
            <div className='button'>Delete</div>
        </div>
    );
}
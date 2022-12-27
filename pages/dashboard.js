import { useState ,useEffect} from 'react';
import DB from '../styles/Dashboard.module.css';
import Nav from '../Nav.js';
import {initFireBase} from '../firebase/client';
import {collection,getDocs,getFirestore} from 'firebase/firestore';
import {GoogleAuthProvider,signInWithPopup,getIdToken,getAuth} from 'firebase/auth'
import LoginPopup from '../LoginPopup';
import OrderPopup from '../OrderPopup';
export default function Dashboard(){
    const [user,setUser]=useState(null);
    const [total,setTotal]=useState(0);
    const [order,setOrder]=useState(false);
    const [data,setData]=useState({
        username:null,
        email:null,
        phone:null,
        image:null,
        address:null,
        cart:[],
        orders:[],
    });
    //functions
    const signout=async ()=>{ 
        await auth.signOut();
        window.location='/'
    }
    const dropFromCart=async (index)=>{
        if(user){
          let token=await auth.currentUser.getIdToken();
          let xhr = new XMLHttpRequest();
          xhr.open('POST','/api/dropfromcart');
          xhr.setRequestHeader('Content-Type','application/json');
          xhr.send(JSON.stringify({
            uid:user.uid,
            token:token,
            index,
          }));
          xhr.onload=()=>{
            let d=JSON.parse(xhr.responseText);
            if(!d.error){
                if(index!=-1){
                    let dt=data.cart;
                    dt.splice(index,1);
                    setData({...data,cart:dt});
                }else{
                    setData({...data,cart:[]});
                }
            }
          }
        }
      }
      useEffect(()=>{},[data.address])
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
                    setData({...d.data,token});
                    console.log(d.data.cart);
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

      useEffect(()=>{
        let t=0;
        data.cart.forEach(e=>{
            t+=e.prize*e.count;
        });
        setTotal(t);
      },[data]);


    return(
        <>
        {user?
        <div className={DB.container}>
            {order && data.cart.length>0?<OrderPopup user={user} data={data} item={order} setOrder={setOrder}/>:<></>}
            <div className={DB.box}> 
            <div className='horizontal'>
            <img src={user.profilepic}/>
            <h1>{user.username}</h1>
            </div>
            <p>{user.email}</p>
            </div>

            <div className={DB.box}> 
            <div className='horizontal'>
            <svg viewBox="0 0 24 24"><path strokeWidth="2" d="M12 22s-8-6-8-12c0-5 4-8 8-8s8 3 8 8c0 6-8 12-8 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
            <h1>Address</h1>
            </div>
            <p>{data.address}</p>
            </div>
            
            <div className={DB.box}> 
            <div className='horizontal'>
            <svg  viewBox="0 0 24 24" strokeWidth="2" ><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>
            <h1>Status</h1>
            </div>
            <p>{data.orders.length} Active Orders</p>
            {data.orders.map((order)=>{
                return(
                    <div className={DB.order}>
                        <div className='horizontal'>
                            <h4>{order.name}</h4>
                            <h3>${order.prize*order.count}</h3>
                        </div>
                        {order.status==0?<p>Order Confirmed</p>:
                        order.status==1?<p>Item Shipped</p>:
                        order.status==2?<p>Deliverd, Waiting for Review</p>:
                        order.status==3?<p>Completed</p>:<></>
                        }
                    </div>
                );
            })}
            </div>

            <div className={DB.box}> 
            <div className={DB.boxHeader}>
                <div className='horizontal'>
                    <svg  viewBox="0 0 24 24" strokeWidth="2" ><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>
                    <h1>Cart</h1>
                </div>
                <div className='horizontal'>
                    <h2>${total}</h2>
                    <div className='button' onClick={()=>{setOrder(data.cart)}}>Buy</div>
                    <div className='button' onClick={()=>{dropFromCart(-1)}}>Clear</div>
                </div> 
            </div> 
            <div className='horizontal'>
            </div>
            <div className={DB.cartList}> 
            {data.cart.map((item,i)=>{
                return(
                    <CartItem {...item} key={i}  
                    remove={()=>{
                        dropFromCart(i);
                    }}
                    setOrder={()=>{
                        setOrder([item]);
                    }}
                    changeCount={(c)=>{
                        let d=data.cart;
                        d[i].count=c;
                        setData((d)={
                            ...data,
                            cart:d,
                        });
                    }}/>
                    );
                })}
                </div>

            </div>
            <Nav user={user} signout={signout} />
        </div>
        :<>
        <LoginPopup toggle={()=>{window.location='/'}}/>
        </>}
        </>
    );
}
const CartItem=({name,prize,image,changeCount,remove,setOrder})=>{
    const [num,setNum]=useState(1);
    useEffect(()=>{
        changeCount(num);
    },[num])
    return(
        <div className={DB.cartItem}>
            <img src={image}/>
            <h1>{name}</h1>
            <h3>${prize}</h3>
            <NumInput num={num} setNum={setNum}/>
            <div className='button' onClick={setOrder}>Buy Now</div>
            <div className='button' onClick={remove}>Delete</div>
        </div>
    );
}

const NumInput=(prop)=>{
    return(
        <div className={DB.numberInput}>
            <div onClick={()=>{prop.num>1?prop.setNum(prop.num-1):0}}>-</div>
            <div>{prop.num}</div>
            <div onClick={()=>{prop.setNum(prop.num+1)}}>+</div>
        </div>
    )
}
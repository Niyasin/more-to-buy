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
    const [edit,setEdit]=useState(false);
    const [review,setReview]=useState(false);
    const [rating,setRating]=useState(0);
    const [reviewText,setReviewText]=useState('');
    const [address,setAddress]=useState(null);
    const [phone,setPhone]=useState(null);
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
      useEffect(()=>{setAddress(data.address);setPhone(data.phone)},[data]);
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


    const editContact=async ()=>{
        if(user && address.length && phone.length){
            let token=await auth.currentUser.getIdToken();
            let xhr =new XMLHttpRequest();
            xhr.open('POST','/api/editcontact');
            xhr.setRequestHeader('Content-Type','application/json');
            xhr.send(JSON.stringify({
                uid:user.uid,
                token:token,
                address,
                phone,
            }));
            xhr.onload=()=>{
                let d=JSON.parse(xhr.responseText);
                if(!d.error){
                    setEdit(false);
                    loadData();
                }
            }
        }  
    }

    const sendReview=async ()=>{
        if(user && address.length && phone.length){
            let token=await auth.currentUser.getIdToken();
            let xhr =new XMLHttpRequest();
            xhr.open('POST','/api/review');
            xhr.setRequestHeader('Content-Type','application/json');
            xhr.send(JSON.stringify({
                uid:user.uid,
                token:token,
                order:review.orderID,
                review:reviewText || '',
                rating:rating || 5,
            }));
            xhr.onload=()=>{
                let d=JSON.parse(xhr.responseText);
                if(!d.error){
                    setReview(false);
                    loadData();
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
        {review?<div className={DB.editWrap}>
            <div className={DB.ratingPopup}>
                <div>
                    <img src={review.image}/>
                    <h2>{review.name}</h2>
                    <h3>{review.prize} USD</h3>
                </div>
                <div>
                    <h2>Rating And Review</h2>
                    <Rating value={rating} setValue={setRating}/>
                    <textarea rows={8} placeholder='Review' defaultValue={reviewText} spellCheck={false} onChange={(e)=>{setReviewText(e.target.value)}}/>
                    <div className='horizontal'>
                        <div className='button' onClick={sendReview}>Confirm</div>
                        <div className='button' onClick={()=>{setReviewText(null);setRating(null);setReview(false);}}>Cancel</div>
                    </div>
                </div>
            </div>
        </div>:<></>}

        {edit?<div className={DB.editWrap}>
            <div className={DB.box}>
            <div className='horizontal'>
                <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    <h2>Edit</h2>
                </div>
                <h4>Phone</h4>
                <input type="tel" placeholder='Phone' defaultValue={data.phone} onChange={(e)=>{setPhone(e.target.value)}}/>
                <h4>Address</h4>
                <textarea rows={3} placeholder='Address' defaultValue={data.address} spellCheck={false} onChange={(e)=>{setAddress(e.target.value)}}/>
                <div className='horizontal'>
                    <div className='button' onClick={editContact}>Confirm</div>
                    <div className='button' onClick={()=>{setAddress(null);setPhone(null);setEdit(false);}}>Cancel</div>
                </div>
            </div>
        </div>:<></>}
    
        {user?
        <div className={DB.container}>
            {order && data.cart.length>0?<OrderPopup user={user} data={data} item={order} setOrder={setOrder} setEdit={setEdit}/>:<></>}

            <div className={DB.box}> 
                <div className='horizontal wide'>
                    <img src={user.profilepic}/>
                    <div>
                        <h2>{user.username}</h2>
                        <p>{user.email}</p>
                        <div className='button' onClick={signout}>Logout</div>
                    </div>
                </div>
            </div>

            <div className={DB.box}> 
                <div className='horizontal'>
                    <svg viewBox="0 0 24 24"><path strokeWidth="2" d="M12 22s-8-6-8-12c0-5 4-8 8-8s8 3 8 8c0 6-8 12-8 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
                    <h2>Contact</h2>
                </div>
                <div>
                    <p>Address : {data.address}</p>
                    <p>Phone : {data.phone}</p>
                    <div className='button' onClick={()=>{setEdit(true)}}>Edit</div>
                </div>
            </div>
            
            <div className={DB.box}>
            <div className='horizontal'>
                <svg  viewBox="0 0 24 24" strokeWidth="2" ><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>
                <h1>Status</h1>
            </div>
            <p>{data.orders.filter(e=>{if(e.status<3){return true}else{return false}}).length} Active Orders</p>
            <div className={DB.cartList}>
                {data.orders.map((order)=>{
                    return(<>
                        {order.status<3?
                            <div className={DB.order} onClick={()=>{if(order.status==2){setReview(order);}}}>
                                <img src={order.image}/>
                                <div>
                                
                                        <h4>{order.name}</h4>
                                        <h3>{order.prize*order.count} USD</h3>
                                    
                                    {order.status==0?<p>Order Confirmed</p>:
                                    order.status==1?<p>Item Shipped</p>:
                                    order.status==2?<p>Deliverd, Waiting for Review</p>:
                                    order.status==3?<p>Completed</p>:<></>
                                    }
                                </div>
                            </div>
                        :<></>}
                        </>
                    );
                })}
            </div>
            </div>

            <div className={DB.box}> 
            <div className={DB.boxHeader}>
                <div className='horizontal'>
                <svg viewBox="0 0 24 24"  fill="none" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    <h1>Cart</h1>
                </div>
                <div className='horizontal'>
                    <h3>{total} USD</h3>
                    <div className='button' onClick={()=>{setOrder(data.cart)}}>Buy</div>
                    <div className='button' onClick={()=>{dropFromCart(-1)}}>Clear</div>
                </div> 
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
            <div>
            <h2>{name}</h2>
            <h3>{prize} USD</h3>

            </div>
            <NumInput num={num} setNum={setNum}/>
            <div className='horizontal'>
                <div className='button' onClick={setOrder}>Buy Now</div>
                <div className='button' onClick={remove}>Delete</div>
            </div>
        </div>
    );
}

const NumInput=(prop)=>{
    return(
        <div className={DB.numberInput} onWheel={(e)=>{e.deltaY<0?prop.setNum(prop.num+1):(prop.num>1?prop.setNum(prop.num-1):0);}}>
            <div onClick={()=>{prop.num>1?prop.setNum(prop.num-1):0}}>-</div>
            <div>{prop.num}</div>
            <div onClick={()=>{prop.setNum(prop.num+1)}}>+</div>
        </div>
    )
}

const Rating=({value=0,setValue})=>{
    const [color,setColor]=useState('#fff');
    useEffect(()=>{
        if(value<3){setColor('#F48225')}
        else if(value<5){setColor('#FFCC01')}
        else{setColor('#5EBA7D')}
    },[value]);
    return(
    <div className={DB.rating}>
    <h4>{value}</h4>
    {[1,2,3,4,5].map((e)=>{
        return(
    <svg onClick={()=>{setValue(e)}} fill={value>e-1?color:'#fff'} viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        )
    })}
    </div>
    )
}
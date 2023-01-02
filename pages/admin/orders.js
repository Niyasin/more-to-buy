import { useState ,useEffect} from 'react';
import DB from '../../styles/Admin.module.css';
import Nav from './Nav.js';
import {initFireBase} from '../../firebase/client';
import { getAuth } from 'firebase/auth';
import { getStorage,uploadBytes,ref, getDownloadURL } from 'firebase/storage';
export default function Dashboard(){
    const [user,setUser]=useState(null);
    const[orders,setOrders]=useState([]);
    const[selected,setSelected]=useState(false);
    const[filter,setFilter]=useState({shipped:false,ordered:true,delivered:false});
    const app=initFireBase();
    const auth = getAuth(app);
    const storage =getStorage(app);

    useEffect(()=>{
        auth.onAuthStateChanged(u=>{
            setUser(u);
        });
    },[]);

    useEffect(()=>{
        if(user){
            loadOrders();
        }
    },[user]);
    
    const loadOrders=()=>{
        let xhr=new XMLHttpRequest();
        xhr.open('POST','/api/admin/getorders');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({
            uid:auth.currentUser.uid,
            token:auth.currentUser.accessToken,
        }));
        xhr.onload=()=>{
            let res=JSON.parse(xhr.responseText);
            if(!res.error){
                setOrders(res.data);
            }
        }
    }

    const updateStatus=()=>{
        let xhr=new XMLHttpRequest();
        xhr.open('POST','/api/admin/updateorder');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({
            uid:auth.currentUser.uid,
            token:auth.currentUser.accessToken,
            data:selected.id,
        }));
        xhr.onload=()=>{
            let res=JSON.parse(xhr.responseText);
            if(!res.error){
                loadOrders();
            }
        }
    }

    return(
        <div className={DB.container}>
            <div className={DB.box}>
                {selected?<>
                    <h1>{selected.name}</h1>
                    <div className='horizontal wide'>
                    <h1>{selected.count}</h1>
                    <h3>${selected.prize}</h3>
                    <h1>{selected.status==0?'Order Confirmed':
                        selected.state==1?'Shipped':
                        selected.state==2?'Delivered':
                        selected.status==3?'Waiting For Review':''
                        }</h1>
                    </div>
                    <p><b>User : </b>{selected.user.username}</p>
                    <p><b>Address : </b>{selected.address}</p>
                    <p><b>Phone : </b>{selected.phone}</p>
                    <p><b>Email : </b>{selected.user.email}</p>
                    <p><b>payment : </b>{selected.payment?'Paid Online':'Cash On Delivary'}</p>
                    <div className='horizontal wide'>
                    <div className='button' onClick={selected.status<2?updateStatus:()=>{}}>
                    {selected.status==0?'Confirm Shiping':
                        selected.status==1?'Confirm Delivary':'View Review'
                    }
                    </div>
                    
                    </div>
                
                </>:<></>}
            </div>
            <div className={DB.box}>
                <h1>Orders</h1>
                <div className='horizontal wide'>
                    <p><input type='checkbox' onChange={(e)=>{setFilter({...filter,orderd:e.target.checked})}} defaultChecked={true}/>Ordered</p>
                    <p><input type='checkbox' onChange={(e)=>{setFilter({...filter,shipped:e.target.checked})}}/>Shipped</p>
                    <p><input type='checkbox' onChange={(e)=>{setFilter({...filter,delivered:e.target.checked})}}/>Delivered</p>
                </div>
            <div className={DB.list}>
            {orders.map((e,i)=>{
                if((e.status==0 && filter.ordered) || (e.status==1 && filter.shipped) || (e.status>=2 && filter.delivered)){
                    return(
                        <div className={DB.listItem} key={i} onClick={()=>{setSelected(e)}}>
                        <h4>{e.name} ({e.count})</h4>
                        <p>{e.phone}</p>
                        <p>{e.status==0?'Order Confirmed':
                        e.status==1?'Shipped':
                        e.status==2?'Delivered':
                        e.status==3?'Waiting For Review':''
                        }</p>
                    </div>
                    )
                }
                })}
                </div>
            </div>
            <Nav user={user} />
        </div>
    
    );
}
const Switch=({state,set})=>{
    return(
        <div className={state?'switch on':'switch off'} onClick={()=>{state?set(false):set(true)}}>
            <div className={state?'on':'off'}>
                
            </div>
        </div>
    )
}
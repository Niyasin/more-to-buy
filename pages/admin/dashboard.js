import { useState ,useEffect} from 'react';
import DB from '../../styles/Admin.module.css';
import {initFireBase} from '../../firebase/client';
import { getAuth } from 'firebase/auth';
import Nav from './Nav.js';
export default function Dashboard(){
    const [user,setUser]=useState(null);
    const [data,setData]=useState({
        orders:0,
        toDeliver:0,
        toShip:0,
        notifications:[],
        products:0,
    });
    const app=initFireBase();
    const auth = getAuth(app);
    //functions
    const loadData=(id)=>{
        let xhr=new XMLHttpRequest();
        xhr.open('POST','/api/admin/dashboarddata');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({
            uid:auth.currentUser.uid,
            token:auth.currentUser.accessToken,
        }));
        xhr.onload=()=>{
            let res=JSON.parse(xhr.responseText);
            if(!res.error){
                setData(res.data);
            }
        }
    }
    useEffect(()=>{
        auth.onAuthStateChanged(a=>{
            if(auth.currentUser){
                loadData();
            }
        })
    },[])
    return(
        
        <div className={DB.container}>
            <div className={DB.box}>
                <h1>Dashboard</h1>
                <div className='horizontal wide evenly'>
                <Chart value={data.orders?Math.floor((data.orders-data.toShip)*100/(data.orders)):100} label="Shipped"/>
                <Chart value={data.orders?Math.floor((data.orders-data.toDeliver)*100/(data.orders)):100} label="Delivered"/>
                </div>
                <div className='horizontal wide evenly'>
                <div className={DB.wrap}>
                    <span className>{data.orders}</span>
                    <p>ORDERS</p>
                </div>
                <div className={DB.wrap}>
                    <span className>{data.products}</span>
                    <p>PRODUCTS</p>
                </div>
                </div>
               
                              

            </div>

            <div className={DB.box}>
                <div className='horizontal'>
                <h1>Notifications</h1>
                <div className='button' onClick={()=>{setData({...data,notifications:[]})}}>Clear</div>
                </div>
                    {data.notifications.map((e)=>{
                        return(
                            <div className={DB.notification}>
                                {e} - Itme Out Of Stock ! 
                            </div>     
                        )
                    })}
            </div>
             
            

            <Nav user={user} />
        </div>
    
    );
}

const Chart = ({value,label})=>{
    return(
      <div className={DB.chart} style={{background:`conic-gradient(#2dbb97 0deg ${value*3.6}deg,#eee 0deg)`}}>
        <div><h1>{value}%</h1><p>{label}</p></div>
      </div>
    )
}
  
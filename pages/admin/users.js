import { useState ,useEffect} from 'react';
import style from '../../styles/Users.module.css';
import Nav from './Nav.js';
import {initFireBase} from '../../firebase/client';
import { getAuth } from 'firebase/auth';
export default function Dashboard(){
    const app=initFireBase();
    const auth = getAuth(app);
    const [user,setUser]=useState(null);
    const [data,setData]=useState([]);
    //functions
    
    const loadData=()=>{
        let xhr=new XMLHttpRequest();
        xhr.open('POST','/api/admin/getusers');
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
        if(user){
            loadData();
        }
    },[user]);

    useEffect(()=>{
        auth.onAuthStateChanged(u=>{
            setUser(u);
        });
    },[]);

    return(
        
        <div className={style.container}>
            <div className={style.box}>
                 <table className={style.table}>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Active Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((e)=>{
                        return(
                            <tr>
                            <td>{e.id}</td>
                            <td>{e.username}</td>
                            <td>{e.email}</td>
                            <td>{e.address}</td>
                            <td>{e.phone}</td>
                            <td>{e.activeOrders}</td>        
                        </tr>
                        )
                    })}
                    </tbody>
                </table>  


            </div>
            <Nav user={user} />
        </div>
    
    );
}
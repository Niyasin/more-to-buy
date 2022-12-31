import { useState ,useEffect} from 'react';
import DB from '../../styles/Dashboard.module.css';
import Nav from './Nav.js';
export default function Dashboard(){
    const [user,setUser]=useState(null);
    const [total,setTotal]=useState(0);
    const [order,setOrder]=useState(false);
    const [data,setData]=useState(null);
    //functions
    

    return(
        
        <div className={DB.container}>
            <div className={DB.box}> 

            </div>

            <div className={DB.box}> 
            
            </div>
            
            <div className={DB.box}> 
            
            </div>

            <div className={DB.box}> 
            

            </div>
            <Nav user={user} />
        </div>
    
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
            <div className='button'>Buy Now</div>
            <div className='button' >Delete</div>
        </div>
    );
}
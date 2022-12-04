import { useState } from 'react';
import DB from '../styles/Dashboard.module.css';
export default function Dashboard(){
    const [data,setData]=useState({
        username:'Username',
        email:'user@gmail.com',
        phone:'+1 8566779944',
        address:'Do nostrud anim nostrud sint consectetur',
        orderCount:0,
        cart:[
            { name:'ProductName', prize:'$50', image:'./sample.png', status:true,},
            { name:'ProductName', prize:'$500', image:'./sample.png', status:true,},
        ],
    });
    return(
        <div className={DB.container}>
            
            <div className={DB.box}> 
            <div className='horizontal'>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.845 21.662C8.152 21.662 5 21.087 5 18.787c0-2.301 3.133-4.425 6.845-4.425 3.691 0 6.844 2.103 6.844 4.404 0 2.3-3.133 2.896-6.845 2.896Zm-.008-10.488a4.386 4.386 0 1 0 0-8.774A4.388 4.388 0 0 0 7.45 6.787a4.37 4.37 0 0 0 4.356 4.387h.031Z" clip-rule="evenodd" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h1>{data.username}</h1>
            </div>
            <p>{data.email}</p>
            <p>{data.phone}</p>
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

            <div className={DB.sidePanel}>
            </div>
        </div>
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
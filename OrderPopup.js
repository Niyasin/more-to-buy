import { useState ,useEffect} from 'react';
import DB from './styles/OrderPopup.module.css';
export default function OrderPopup({item=[],data,setOrder,delivery,user}){
    const [total,setTotal]=useState(0);
    const [cart,setCart]=useState(item);
    const [payment,setPayment]=useState(0);
    //effects
    useEffect(()=>{
        setCart(item);
    },[item]);

    useEffect(()=>{
        let t=0;
        cart.forEach(e=>{
            t+=e.prize*e.count;
        })
        setTotal(t);
    },[cart]);

    const placeOrder= async()=>{
        if(data.address && data.phone){
            let xhr = new XMLHttpRequest();
            xhr.open('POST','/api/placeorder');
            xhr.setRequestHeader('Content-Type','application/json');
            let d={
                uid:user.uid,
                token:data.token,
                payment,
                products:cart,
                address:data.address,
                phone:data.phone,
            }
            xhr.send(JSON.stringify(d));
            xhr.onload=()=>{
                let d=JSON.parse(xhr.responseText);
                if(!d.error){
                    window.location='/dashboard';
                }
            }
        }else{
            //addAddress;
        }
    }
    return(
        <div className={DB.wrap}>
        <div className={DB.container}>
            <div className={DB.box}>
                
            <div className={DB.boxHeader}>
                <div className='horizontal'>
                    <svg  viewBox="0 0 24 24" strokeWidth="2" ><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>
                    <h1>Confirm Order</h1>
                </div>
                <div className='horizontal'>
                    <h2>${total}</h2>
                </div> 
            </div> 

            <div className={DB.cartList}> 
            {cart.map((item,i)=>{
                return(
                    <CartItem {...item} key={i}
                    changeCount={(c)=>{
                        let d=[...cart];
                        d[i].count=c;
                        setCart(d);
                    }}/>
                    );
                })}
                </div>
            </div>
            <div className={DB.box}>
            <div className='horizontal  wide'>
            <h4>Address</h4>
            <div className='button'>Edit</div>
            </div>
            <p>
            <div className='horizontal  wide'>
            <svg viewBox="0 0 24 24" ><path strokeWidth="2" d="M12 22s-8-6-8-12c0-5 4-8 8-8s8 3 8 8c0 6-8 12-8 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
            <p>{data.address}</p>
            </div>
            <div className='horizontal  wide'>
            <svg viewBox="0 0 24 24"><path d="M20.489 20.011a4.273 4.273 0 0 1-3.241 1.489h-.116A15.042 15.042 0 0 1 2.5 6.868 4.28 4.28 0 0 1 4 3.494a4.028 4.028 0 0 1 3.349-.931 3.549 3.549 0 0 1 .474.119 1.492 1.492 0 0 1 1 1.191l.67 4.254a1.515 1.515 0 0 1-.541 1.412 3.608 3.608 0 0 1-.262.193.538.538 0 0 0-.215.666 9.857 9.857 0 0 0 5.125 5.127.542.542 0 0 0 .671-.222c.047-.068.1-.135.146-.2a1.513 1.513 0 0 1 1.431-.547l4.332.721a1.473 1.473 0 0 1 1.186 1.033c.027.1.052.207.074.332a4.072 4.072 0 0 1-.951 3.369Z" /></svg>
            <p>{data.phone}</p>
            </div>
            </p>
            <h4>Payment Method</h4>
            <p>     
            <p>
                <input type='radio' name='method' value={0} defaultChecked={true} onChange={e=>{setPayment(e.target.value)}}/>
                Cash on delivary
            </p>
            <p>
                <input type='radio' name='method' value={1} onChange={e=>{setPayment(e.target.value)}}/>
                Pay now
            </p>
            </p>
            <h4>Delivary</h4>
            <p>

            <p>{cart.length} Items</p>
            <p>Total : ${total}</p>
            <p>Delivary Expected On {delivery}</p>
            </p>

            <div className='horizontal wide'>
                    <div className='button' onClick={placeOrder}>Proceed</div>
                    <div className='button' onClick={()=>{setOrder(false)}}>Cancel</div>
            </div>
            </div>
        </div>
        </div>
    );
}
const CartItem=({name,prize,image,count,changeCount})=>{
    const [num,setNum]=useState(count);
    useEffect(()=>{
        changeCount(num);
    },[num])
    return(
        <div className={DB.cartItem}>
            <img src={image}/>
            <h1>{name}</h1>
            <h3>${prize}</h3>
            <NumInput num={num} setNum={setNum}/>
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
import { useState ,useEffect} from 'react';
import DB from '../../styles/Admin.module.css';
import Nav from './Nav.js';
import {initFireBase} from '../../firebase/client';
import { getAuth } from 'firebase/auth';
import { getStorage,uploadBytes,ref, getDownloadURL } from 'firebase/storage';
export default function Dashboard(){
    const [user,setUser]=useState(null);
    const[products,setProducts]=useState([]);
    const[addMode,setAddMode]=useState(true);
    const[imgURL,setImgURL]=useState([]);
    const[data,setData]=useState({
        name:null,
        prize:null,
        stock:null,
        details:null,
        images:[],
    });

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
            loadProducts();
        }
    },[user]);
    const addProduct= async()=>{
        let url=[];
        data.images.forEach((e,i)=>{
        let S=ref(storage,'img/'+e.name);
        uploadBytes(S,e).then(snap=>{
            getDownloadURL(S).then(u=>{
                url.push(u);
                if(url.length==data.images.length){
                    let xhr=new XMLHttpRequest();
                    xhr.open('POST','/api/admin/addproduct');
                    xhr.setRequestHeader('Content-Type','application/json');
                    xhr.send(JSON.stringify({
                    uid:auth.currentUser.uid,
                    token:auth.currentUser.accessToken,
                    data:{
                        name:data.name,
                        prize:data.prize,
                        description:data.details,
                        stock:Number(data.stock),
                        images:url,
                    }
                }))
                xhr.onload=()=>{
                let res=JSON.parse(xhr.responseText);
                if(!res.error){
                    loadProducts();
                }
            }      
                }
            })
        })
    });
    }
    
    const loadProducts=()=>{
        let xhr=new XMLHttpRequest();
        xhr.open('POST','/api/admin/loadproducts');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({
            uid:auth.currentUser.uid,
            token:auth.currentUser.accessToken,
        }));
        xhr.onload=()=>{
            let res=JSON.parse(xhr.responseText);
            if(!res.error){
                setProducts(res.data);
            }
        }
    }
    const addImage=()=>{
        let IN=document.createElement('input');
        let File=null;
        IN.type='file';
        IN.onchange=()=>{
            if(IN.files[0].type.substring(0,5)=='image'){
                setData({
                    ...data,
                    images:[...data.images,IN.files[0]]
                });

                let FR=new FileReader();
                FR.onloadend=()=>{
                    setImgURL([...imgURL,FR.result]);
                }
                FR.readAsDataURL(IN.files[0]);
            
            }
        }
        IN.click();
    }
    return(
        
        <div className={DB.container}>
            <div className={DB.box}>
                {addMode?<>
                <div className='horizontal  wide'>
                    <h1>Add Product</h1>
                </div>
                <input placeholder='Name' onChange={(e)=>{setData({...data,name:e.target.value})}}/>
                <input placeholder='Price' onChange={(e)=>{setData({...data,prize:e.target.value})}}/>
                <input placeholder='Stock' onChange={(e)=>{setData({...data,stock:e.target.value})}}/>
                <textarea placeholder='Details' onChange={(e)=>{setData({...data,details:e.target.value})}}></textarea>
                <div className={DB.galleryItems}>
                {imgURL.map((e,i)=>{
                    return(
                        <img src={e} key={i}/>
                    )
                })
                }
                {data.images.length<5?
                <div onClick={addImage}>
                    <svg viewBox="0 0 24 24"><path d="M12 18V6m-6 6h12"/></svg>
                </div>
                :''}
                </div>    
                <div className='horizontal'>
                <div className='button' onClick={addProduct}>Confirm</div>
                <div className='button' onClick={()=>{
                    setData({
                        name:null,
                        prize:null,
                        stock:null,
                        details:null,
                        images:[],
                        });
                    setAddMode(false);
                    setImgURL([]);
                    }}>Cancel</div>
                </div>            
                </>:<>
                
                </>}
            </div>
            <div className={DB.box}>
                <div className='horizontal wide'>
                <h1>Products</h1>
                <div className='button' onClick={()=>{setAddMode(true)}}>Add</div>
                </div>
            <div className={DB.list}>
            {products.map((e,i)=>{
                return(
                    <div className={DB.listItem} key={i}>
                        <img src={e.image}/>
                        <h4>{e.name}</h4>
                        <h3>${e.prize}</h3>
                        <p>
                            {e.orders} Orders<br/>
                            {e.stock} in Stock
                        </p>
                    </div>
                    )
                })}
                </div>
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
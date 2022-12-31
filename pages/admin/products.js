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
    const[selected,setSelected]=useState(false);
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
    const update=()=>{
        if(Object.keys(data).length){

            let xhr=new XMLHttpRequest();
            xhr.open('POST','/api/admin/updateproduct');
            xhr.setRequestHeader('Content-Type','application/json');
            xhr.send(JSON.stringify({
                uid:auth.currentUser.uid,
                token:auth.currentUser.accessToken,
                data:{...data,id:selected.id},
            }));
            xhr.onload=()=>{
                let res=JSON.parse(xhr.responseText);
                if(!res.error){
                    loadProduct(selected.id);
                    loadProducts();
                }
            }
        }
    }
    const loadProduct=(id)=>{
        let xhr=new XMLHttpRequest();
        xhr.open('POST','/api/admin/getdata');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({
            uid:auth.currentUser.uid,
            token:auth.currentUser.accessToken,
            data:id,
        }));
        xhr.onload=()=>{
            let res=JSON.parse(xhr.responseText);
            if(!res.error){
                setAddMode(false);
                setData({});
                setSelected(res.data);
            }
        }
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
                {selected?<>
                    <div className='horizontal  wide'>
                    <h1>{selected.name}</h1>
                </div>
                <input placeholder='Name' onChange={(e)=>{setData({...data,name:e.target.value})}} defaultValue={selected.name}/>
                <input placeholder='Price' onChange={(e)=>{setData({...data,prize:e.target.value})}} defaultValue={selected.prize}/>
                <input placeholder='Stock' onChange={(e)=>{setData({...data,stock:e.target.value})}} defaultValue={selected.stock}/>
                <textarea placeholder='Details' onChange={(e)=>{setData({...data,details:e.target.value})}} defaultValue={selected.description}></textarea>
                <div className={DB.galleryItems}>
                {selected.images.map((e,i)=>{
                    return(
                        <img src={e} key={i}/>
                    )
                })
                }
                </div>    
                <div className='horizontal'>
                <div className='button' onClick={update}>Update</div>
                <div className='button' onClick={()=>{loadProduct(selected.id)}}>Cancel</div>
                </div>
                </>:<></>}
                
                </>}
            </div>
            <div className={DB.box}>
                <div className='horizontal wide'>
                <h1>Products</h1>
                <div className='button' onClick={()=>{
                    setAddMode(true);
                    setSelected(null);
                    setData({
                        name:null,
                        prize:null,
                        stock:null,
                        details:null,
                        images:[],
                        });
                    }}>Add</div>
                </div>
            <div className={DB.list}>
            {products.map((e,i)=>{
                return(
                    <div className={DB.listItem} key={i} onClick={()=>{loadProduct(e.id)}}>
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
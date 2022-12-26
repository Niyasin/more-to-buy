import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import Loading from '../Loading';
import { initFireBase} from "../firebase/client";
import { getAuth } from "firebase/auth";
import I from'../styles/Item.module.css';
import Nav from "../Nav";
export default function Item (){
    const router = useRouter();
    const { id }=router.query;
    const [user,setUser]=useState(null);
    const [data,setData]=useState(null);
    const [selectedImage,setSelectedImages]=useState(0);
    const app=initFireBase();
    const db = getFirestore(app);
    const auth=getAuth(app);
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

    const signout=async ()=>{ 
        await auth.signOut();
    }

    const addToCart=async ()=>{
      if(user){
        let token=await auth.currentUser.getIdToken();
        let xhr = new XMLHttpRequest();
        xhr.open('POST','/api/addtocart');
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({
          uid:user.uid,
          token:token,
          productID:id,
          count:1,
        }));
        xhr.onload=()=>{
          let d=JSON.parse(xhr.responseText);
          if(!d.error){
            window.location='/dashboard';
          }
        }
      }else{
        window.location='/dashboard';
      }
    }

    const loadData=async()=>{
        try{
            if(id){
                let ref=doc(db,'products',id);
                let snap= await getDoc(ref);
                console.log(snap.data());
                if(snap.exists){
                    setData(snap.data());
                }
            } 
        }catch(e){}
    }
    useEffect(()=>{
        loadData();
    },[id]);
return(<>
    {data?
    <div className={I.container}>
        <Nav user={user} signout={signout}/>
        <div className={I.gallery}>
            <img className={I.preview} src={data.images[selectedImage]}/>
            <div className={I.galleryItems}>
                {data.images.map((i,id)=>{
                    return(
                        <img src={i} id={id} onClick={()=>{setSelectedImages(id)}} style={selectedImage==id?{border:"2px solid #000"}:{}}/>
                    )
                })}
            </div>
        </div>
        <div className={I.details}>
            <h1>{data.name}</h1>
            <h3>${data.prize}</h3>
            <p>{data.description}</p>
            <div className={I.reting}>
                <h4>Rating</h4>
                <Rating value={data.rating}/>
            </div>
            <div className="horizontal">
            <div className="button" onClick={addToCart}>Add To Cart</div>
            <div className="button">Buy Now</div>
            </div>
            <div className={I.reviewContainer}>
                <h4>Review</h4>
                {data.review.map((r)=>{
                    return(
                        <Review data={r}/>
                )
                })}
            </div>
        </div>
    </div>
    :<>
    <Loading/>
    </>}
    </>
)
}
const Review =({data})=>{
    return(
        <div className={I.review}>
            <h4>{data.name}</h4>
            <p>{data.text}</p>
        </div>
    )
}
const Rating=({value})=>{
    return(
        
        <div className="horizontal">
            <h4>{value}</h4>
            <svg viewBox='0 0 881 130' fill='#eee' width="200px" className="ratingStars">
    <clipPath id='Clip'>
      <rect width={value*(881/5)} height={130} />
    </clipPath>
    <g id='stars'>
      <g transform='matrix(1,0,0,1,-634.728,-382.568)'>
        <path d='M702.68,382.568L718.721,431.938L770.632,431.938L728.635,462.45L744.677,511.82L702.68,481.308L660.683,511.82L676.724,462.45L634.728,431.938L686.639,431.938L702.68,382.568Z' />
      </g>
      <g transform='matrix(1,0,0,1,-447.914,-382.568)'>
        <path d='M702.68,382.568L718.721,431.938L770.632,431.938L728.635,462.45L744.677,511.82L702.68,481.308L660.683,511.82L676.724,462.45L634.728,431.938L686.639,431.938L702.68,382.568Z' />
      </g>
      <g transform='matrix(1,0,0,1,-261.961,-382.568)'>
        <path d='M702.68,382.568L718.721,431.938L770.632,431.938L728.635,462.45L744.677,511.82L702.68,481.308L660.683,511.82L676.724,462.45L634.728,431.938L686.639,431.938L702.68,382.568Z' />
      </g>
      <g transform='matrix(1,0,0,1,-76.0238,-382.568)'>
        <path d='M702.68,382.568L718.721,431.938L770.632,431.938L728.635,462.45L744.677,511.82L702.68,481.308L660.683,511.82L676.724,462.45L634.728,431.938L686.639,431.938L702.68,382.568Z' />
      </g>
      <g transform='matrix(1,0,0,1,109.853,-382.568)'>
        <path d='M702.68,382.568L718.721,431.938L770.632,431.938L728.635,462.45L744.677,511.82L702.68,481.308L660.683,511.82L676.724,462.45L634.728,431.938L686.639,431.938L702.68,382.568Z' />
      </g>
    </g>
    <use clipPath='url(#Clip)' href='#stars' fill='rgb(255,216,0)' />
  </svg>

        </div>
    )
}

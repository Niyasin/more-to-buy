import { useRouter } from "next/router"
import { useState } from "react";

export default function Item (){
    const router=useRouter();
    const {id}=router.query;
    const [data,setData]=useState(
        {
            name:'Product Name',
            prize:'50',
            offers:'12%',
            rating:4.5,
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    );
    
    const [images,setImages]=useState(['../sample.png','../sample.png','../sample.png','../sample.png','../sample.png']);
    const [selectedImage,setSelectedImages]=useState('../sample.png');
return(
    <div className='itemContainer'>
        <div className="gallery">
            <img className="preview" src={selectedImage}/>
            <div className="galleryItems">
                {images.map(i=>{
                    return(
                        <img src={i}/>
                    )
                })}
            </div>
        </div>
        <div className="details">
            <h1>{data.name}</h1>
            <h3>${data.prize}</h3>
            <p>{data.description}</p>
            <h1>Rating</h1>
            <div className="horizontal">
                <h4>{data.rating}</h4>
            </div>
            <div className="horizontal">
            <div className="button">Add To Cart</div>
            <div className="button">Buy Now</div>
            </div>
        </div>
    </div>
)
}
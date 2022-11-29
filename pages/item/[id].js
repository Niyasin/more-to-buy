import { useRouter } from "next/router"
import { useState } from "react";

export default function Item (){
    const router=useRouter();
    const {id}=router.query;
    const [images,setImages]=useState(['../sample.png','../sample.png','../sample.png','../sample.png','../sample.png','../sample.png','../sample.png']);
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
        <div className="details"></div>
    </div>
)
}
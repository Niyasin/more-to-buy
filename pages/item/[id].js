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
            rating:3,
            images:['../images/1.png','../images/2.png','../images/3.png','../images/4.png','../images/5.png'],
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            review:[
                {
                    name:'username',
                    rating:3,
                    text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
                },
                {
                    name:'username',
                    rating:2,
                    text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
                },
            ],
        }
    );
    
    const [selectedImage,setSelectedImages]=useState(0);
return(
    <div className='itemContainer'>
        <div className="gallery">
            <img className="preview" src={data.images[selectedImage]}/>
            <div className="galleryItems">
                {data.images.map((i,id)=>{
                    return(
                        <img src={i} id={id} onClick={()=>{setSelectedImages(id)}} style={selectedImage==id?{border:"2px solid #000"}:{}}/>
                    )
                })}
            </div>
        </div>
        <div className="details">
            <h1>{data.name}</h1>
            <h3>${data.prize}</h3>
            <p>{data.description}</p>
            <div className="rating">
                <h4>Rating</h4>
                <Rating value={data.rating}/>
            </div>
            <div className="horizontal">
            <div className="button">Add To Cart</div>
            <div className="button">Buy Now</div>
            </div>
            <div className="reviewContainer">
                <h4>Review</h4>
                {data.review.map((r)=>{
                    return(
                        <Review data={r}/>
                )
                })}
            </div>
        </div>
    </div>
)
}
const Review =({data})=>{
    return(
        <div className="review">
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
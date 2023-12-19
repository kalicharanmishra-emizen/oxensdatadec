import React from 'react'
import Rating from '../../public/images/rating-full.svg';
import RatingHalf from '../../public/images/rating-half.svg';
import RatingBlank from '../../public/images/rating-blank.svg';
import redStar from '../../public/images/redStar.svg'
import Image from 'next/image'
export default function RatingStar({rating}) {
    const style ={
            "margin":"0 5px",
            "padding":" 0 8px",
            "display":"inline-block",
            "background": "#2f6f68",
            "borderRadius": "4px",
            "fontSize": "16px",
            "fontWeight": "600",
            "color": "#fff"
    }
    return (
        <>
            <div style={style}>
                {rating} &#9733;            
            </div>
        </>
    )
    
}

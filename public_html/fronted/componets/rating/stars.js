import React from 'react'
import Image from 'next/image'
import Rating from '../../public/images/rating-full.svg';
import RatingHalf from '../../public/images/rating-half.svg';
import RatingBlank from '../../public/images/rating-blank.svg';

const Stars = ({data}) => {
  return (
    <>
      <Image src={ data >= 1 ? Rating : RatingBlank } alt="Rating"/>
      <Image src={ data > 1 ? data < 2 ? RatingHalf : Rating : RatingBlank } alt="Rating"/>
      <Image src={ data > 2 ? data < 3 ? RatingHalf : Rating : RatingBlank } alt="Rating"/>
      <Image src={ data > 3 ? data < 4 ? RatingHalf : Rating : RatingBlank } alt="Rating"/>
      <Image src={ data > 4 ? data < 5 ? RatingHalf : Rating : RatingBlank } alt="Rating"/>
    </>
  )
}

export default Stars
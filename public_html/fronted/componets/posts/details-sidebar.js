import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import styles from "../../styles/detailsSidebar.module.css";
import DiscountIcon from '../../public/images/discount-icon.svg';

export default function DetailsSidebar(props) { 
  const [selectedCat, setSelectedCat] = useState(null)
  useEffect(() => {
    if (props.filter.length!=0) {
      setSelectedCat(props.filter[0]._id)
    }
  }, [props.filter])
  const filterBtn=()=>{
    document.body.classList.add('filter-open')
  }
  const closefilter=()=>{
    document.body.classList.remove('filter-open')
  }
  const handelClick = (e) => {
    setSelectedCat(e.currentTarget.getAttribute('value'))
  }
  useEffect(() => {
    if(selectedCat){
      props.getSelectedCat(selectedCat)
    }
  }, [selectedCat])
  
  return (   
    <>
    <div className={`${styles.sidebar}`}>
      <span onClick={filterBtn} className={`${styles.filterBtn}`}>Filter</span>
      <div className="sideNav">
        <span onClick={closefilter} className="closefilter"></span>
        <ul>
        {
          props.filter.map(data=>(
            <li key={data._id} onClick={handelClick} value={data._id}><span role="button" ><a>{data.title}<span>({data.total})</span></a></span></li>
          ))
        }
         {/* <li><Link href="#" ><a>Gourmet Pizza<span>(8)</span><Image src={DiscountIcon} /></a></Link></li> */}
        </ul>
      </div>
    </div>
    </>
  )
}
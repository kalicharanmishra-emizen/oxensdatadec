import {Row, Col} from 'reactstrap'
import React, {useEffect, useState} from "react";
import Image from 'next/image';
import styles from "../../styles/payment-details.module.css";
import alignIconUp from '../../public/images/alignIcon.svg';
import alignIconDown from '../../public/images/alignIconDown.svg';
import QuantityBtn from '../quantityBtn';
export default function OrderSummary({cartData,storeDetail,getPayClick}) {
  const [isActive, setActive] = useState(false);
  const [discount,setDiscount] = useState(0.00);
  const ToggleClass = () => {
    setActive(!isActive); 
  };
  const getCustomeTypeToString = (data) => {
    return (
      data.map((cus,key)=>(
        <span key={key} className={styles.verSingal}>
          <span>{cus.title} :</span>
          {
            cus.variants.map(vare=>(
              vare.title+', '
            ))
          }
        </span>
      ))
    )
  }
  useEffect(()=>{
    if(
      !storeDetail.isLoading && 
      Object.keys(storeDetail.data.discount).length!=0 && 
      (
        (
          storeDetail.data.discount.discountType==0 && 
          storeDetail.data.discount.discountValue > 0
        ) 
        || 
        (
          storeDetail.data.discount.discountType==1 && 
          storeDetail.data.discount.maxDiscount > 0
        )
      )
    ){
      let tempDiscount = storeDetail.data.discount.maxDiscount
      if (storeDetail.data.discount.discountType==0) {
        tempDiscount = (cartData.totalAmount * storeDetail.data.discount.discountValue)/100
        if (storeDetail.data.discount.maxDiscount > 0 && tempDiscount > storeDetail.data.discount.maxDiscount) {
          tempDiscount = storeDetail.data.discount.maxDiscount
        }  
      }
      setDiscount(tempDiscount.toFixed(2))
    }
  },[storeDetail,cartData])
  const continuePay = () =>{
    getPayClick()
  }
  return (
    <>
    <div className={`${styles.delivery}`}>
      <div className={`${styles.orderItem}`}>
        <span>Order From</span>
        <h6>{!storeDetail.isLoading?storeDetail.data.title:''}</h6>
        <p>{!storeDetail.isLoading?storeDetail.data.location.address:''}</p>
      </div>
      <div className={`${styles.deliveryInfo}`}>
        <h6>{cartData.totalQuantity} Items in your Bag <span onClick={ToggleClass}>Delivery <span className='alignIcon'><Image src={isActive ? alignIconUp : alignIconDown} alt="Align icon" /></span></span></h6>
      </div> 
      <div className={isActive ? "itemShow" : 'itemHide'}>
        <div className={`${styles.itemDetailsBlock}`} className="itemDetailsBlock">
        {
          Object.keys(cartData.orderItems).map(list=>(
            Object.keys(cartData.orderItems[list].selectedGroup).map(group=>(
              <div className={`${styles.itemDetails}`} key={group}>
                <Row>
                  <Col sm="8" className='col-8'>
                    <h6>{cartData.orderItems[list].menuitem.title}</h6>
                    {/* <span className={`${styles.itemPrice}`}>
                      £{cartData.orderItems[list].selectedGroup[group].price}
                    </span> */}
                    <p className={`${styles.variables}`}>
                      {
                        getCustomeTypeToString(cartData.orderItems[list].selectedGroup[group].group)
                      }
                    </p>
                  </Col>
                  <Col sm="4" className='col-4'>
                    <span className={`${styles.morePrice}`}>
                      £{cartData.orderItems[list].selectedGroup[group].price}
                    </span>
                    <span className={`${styles.qutyBtn}`}>
                      <QuantityBtn
                        defvalue={cartData.orderItems[list].selectedGroup[group].quantity}
                        grpCus={true}
                        groupId={group}
                        itemId={list}
                        getQuantity={()=>{ }}
                      />
                    </span>
                  </Col>
                </Row>
              </div>
            ))
          ))
        }
        </div> 
      </div>    
      <div className={`${styles.subtotal}`}>
        <ul>
          <li>Subtotal <span>£{cartData.totalAmount}</span></li>
          <li>Discount on MRP <span className={`${styles.mrp}`}>-£{discount}</span></li>
          {/* <li><strong>order fee</strong> <Image src={about} alt="about"/> <span>£5.50</span></li>
          <li>Delivery charges <span>£2</span></li>
          <li><strong className={`${styles.serviceFree}`}>Service Fee</strong> <Image src={about} alt="about"/> <span>£5.50</span></li>
          <li>Tax and Charges <span>£4.99</span></li> */}
          {/* <li>Tip <span className={`${styles.tip}`}><span className={`${styles.currency}`}>&#163;</span><Input type="text" className={`${styles.formCantrol}`} placeholder="" onChange={tipChange} /> </span></li> */}
        </ul>
        {/* <div className={`${styles.request}`}>
          <Input type="search" className={`${styles.formCantrol}`} placeholder="Any request for your food (optional)" /> 
        </div> */}
        <div className={`${styles.totalInfo}`}>
          <h4>Grand Total <span>£{(cartData.totalAmount - discount).toFixed(2)}</span></h4>
        </div>
        <div className={`${styles.btnBlock}`}>
          <span role="button" onClick={continuePay}><a>Continue to Pay</a></span>
        </div>
      </div>
    </div>
    </>
  )
}

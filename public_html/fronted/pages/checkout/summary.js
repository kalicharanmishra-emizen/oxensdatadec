import { Container, Row, Col, Input,Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import IinnerLayout from "../../layouts/linnerlayout"
import React, {useEffect, useState} from "react";
import Image from 'next/image';
import Link from 'next/link';
import styles from "../../styles/summary.module.css";
import payment1 from '../../public/images/payment1.png';
import about from '../../public/images/about.svg';
import alignIcon from '../../public/images/alignIcon.svg';
import successfull from '../../public/images/successfull-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreDetail } from '../../reducers/storeSlice';
import { manageCartData, unSetApiFail, unSetApiSucc } from '../../reducers/mainSlice';
import { useRouter } from 'next/router';
import { getAddress } from '../../reducers/addressSlice';
import nProgress from 'nprogress';
import { getAllOrderCharge, placeOrder } from '../../reducers/orderSlice';
import { calculateDistance, callApi } from '../../Helper/helper';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkoutform from '../../componets/stripe/checkoutform';

function CheckoutSummary() {  

  const dispatch = useDispatch()
  const router = useRouter()
  const [selectAddress,setSelectAddress] = useState({})
  const [placeorderData,setPlaceorderData] = useState({})
  const [selectPickupTime,setSelectPickupTime] = useState({
    date:"",
    time:''
  })
  const [geoDistance,setGeoDistance] = useState({
    distance:0.00,
    duration:0.00
  });
  const [comment,setComment]= useState(null)
  const [tip, setTip] = useState(0)
  const [modal, setModal] = useState(false);
  const [totalCharge, setTotalCharge] = useState({
    grandTotal:0.00,
    serviceCharge:0.00,
    taxCharge:0.00,
    deliveryCharge:0.00
  })
  const [itemDropDown, setItemDropDown] = useState(false);
  const cartData = useSelector(state => state.mainSlice.cart)
  const charge = useSelector(state => state.orderSlice.charge)
  const storeDetail = useSelector(state=>state.storeSlice.storeDetail)
  const myAddress = useSelector(state => state.addressSlice.list)
  const apiFail = useSelector(state=>state.mainSlice.failed)
  const apiSuccess = useSelector(state=>state.mainSlice.success)
  const getOrderDetails = useSelector(state=>state.orderSlice.placeOrderData)
  const stripePromise = loadStripe("pk_test_51LUz69IxF8jtskmya0yfVeN5Sp7mGhcFtuYcw4MKtmlZAjfXjVy6e2X3daS5V34QtOJGmtUjRtIlXSBPe64V61G500GVMxVA3Z");
  const [paymentModal, setPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const getGeoDistance = async () =>{
    if(Object.keys(selectAddress).length!=0){
      let distance = await calculateDistance(
        {
          lat:Number(storeDetail.data.location.late),
          lng:Number(storeDetail.data.location.lng)
        },
        {
          lat:Number(selectAddress.lat),
          lng:Number(selectAddress.lng)
        }
      )
      setGeoDistance(distance)
    }
  }
  const manageItemDropDown = () => {
    setItemDropDown(!itemDropDown); 
  };
  const tipChange = (e) => {
    if (e.target.value.match(/^[0-9]*$/) && e.target.value!= '') {
      setTip(e.target.value)
    }else{
      setTip(0)
    }
  }
  const handelComment = (e) =>{
    setComment(e.target.value)
  }
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
  const submitOrder= async ()=>{
    if ((cartData.orderType==0 && Object.keys(selectAddress).length!=0) || ((cartData.orderType==1 && selectPickupTime.date!='' && selectPickupTime.time!=''))) {
      nProgress.start()
      let orderProduct = []
      Object.keys(cartData.orderItems).map(list=>{
        Object.keys(cartData.orderItems[list]['selectedGroup']).map(group=>{
          /* manage customize's and varient's */
          let customize = []
          cartData.orderItems[list]['selectedGroup'][group]['group'].map(cus=>{
            /* set Customize varients */
            let customizeVarient = []
            cus.variants.map(ver=>{
              customizeVarient.push({
                id:ver._id,
                title:ver.title
              })
            })
            customize.push({
              id:cus._id,
              title:cus.title,
              variants:customizeVarient
            })
          })
          orderProduct.push({
            id:cartData.orderItems[list].menuitem._id,
            title:cartData.orderItems[list].menuitem.title,
            age_res:cartData.orderItems[list].menuitem.age_res,
            customize:customize,
            quantity:cartData.orderItems[list]['selectedGroup'][group].quantity,
            price:cartData.orderItems[list]['selectedGroup'][group].price
          })
        })
      })
      let finalOrderSumery={
        storeId:cartData.storeId,
        deliveryAddress:selectAddress,
        pickupData:selectPickupTime,
        type:cartData.orderType,
        totalQuantity:cartData.totalQuantity,
        totalMrp:cartData.totalAmount,
        servicePrice:totalCharge.serviceCharge,
        discountPrice:totalCharge.discount,
        deliveryPrice:totalCharge.deliveryCharge,
        totalPrice:totalCharge.grandTotal - tip,
        taxCharge:totalCharge.taxCharge,
        tip:tip,
        comment:comment,
        product:orderProduct
      }
      dispatch(placeOrder(finalOrderSumery))
      // makePayment()
    }else {
      Swal.fire({
        icon: 'error',
        title: cartData.orderType?'Please select pickup time':'Please select delivery address',
        timer: 1000,
        showConfirmButton: false,
      })
    }
  }
// stripe -------------
  const modalPopup = () => setPaymentModal(!paymentModal);

  const makePayment = async (data) => {
    try {
      setPaymentModal(!paymentModal)
      // const data = await callApi("post", "/order/create-payment-intent", getOrderDetails)
      if (data) {
        setClientSecret(data.clientSecret)
      } 
      setModal(modal)
      // paymentConfirm(data)
    } catch (error) {
        console.log("payment error",error);
        // return
    }
  }

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  const paymentConfirm = async () => {
      // await callApi("post", "/order/create-payment-intent", {_id:getOrderDetails.orderid})
      setModal(!modal)
  } 

  const calculateCharges = () => {
    let tempTaxCharge = 0.00;
    let tempServiceCharge = 0.00;
    let tempDeliveryCharge = 0.00;
    let tempDiscountCharge = 0.00;
    if (Object.keys(cartData.orderItems).length==0 && localStorage.getItem('cart') && Object.keys(JSON.parse(localStorage.getItem('cart')).orderItems).length!=0 ) {
        dispatch(manageCartData())
    }
    if(cartData.storeId && storeDetail.isLoading){
      dispatch(getStoreDetail({storeId:cartData.storeId}))
    }
    if (Object.keys(charge).length!=0) {
      // celculate service charge
      tempServiceCharge = (cartData.totalAmount * charge.serviceFee)/100
      if (tempServiceCharge > charge.maxServiceFee) {
        tempServiceCharge = charge.maxServiceFee
      } 
      // calculate tax
      if (charge.taxPay != 0) {
        tempTaxCharge = (cartData.totalAmount * charge.taxPay)/100
      }

      // calculate delivery charge when order type is delivery
      if (cartData.orderType==0) {
        tempDeliveryCharge = (((geoDistance.distance - charge.fixLimitDeliveryDistance)/charge.deliveryExtraFeeUnit) * charge.deliveryExtraFee) + charge.minDeliveryCharge
        if (tempDeliveryCharge < charge.minDeliveryCharge) {
          tempDeliveryCharge = charge.minDeliveryCharge
        }
      }
      // calculate discount price
      if(!storeDetail.isLoading && 
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
      ) {
        tempDiscountCharge = storeDetail.data.discount.maxDiscount
        if (storeDetail.data.discount.discountType==0) {
          tempDiscountCharge = (cartData.totalAmount * storeDetail.data.discount.discountValue)/100
          if (storeDetail.data.discount.maxDiscount > 0 && tempDiscountCharge > storeDetail.data.discount.maxDiscount) {
            tempDiscountCharge = storeDetail.data.discount.maxDiscount
          }  
        }
      }
      // if(!storeDetail.isLoading && Object.keys(storeDetail.data.discount).length!=0 && storeDetail.data.discount.discountValue > 0){
      //   tempDiscountCharge = (cartData.totalAmount * storeDetail.data.discount.discountValue)/100
      //   if (storeDetail.data.discount.maxDiscount > 0 && tempDiscountCharge > storeDetail.data.discount.maxDiscount) {
      //     tempDiscountCharge = storeDetail.data.discount.maxDiscount
      //   }
      // }
    }
    setTotalCharge({
      grandTotal:Number(((cartData.totalAmount + Number(tip) + tempServiceCharge + tempDeliveryCharge) - tempDiscountCharge).toFixed(2)), // remove tex filed after tempDeliveryCharge + tempTaxCharge
      discount:tempDiscountCharge.toFixed(2),
      serviceCharge:tempServiceCharge.toFixed(2),
      deliveryCharge:tempDeliveryCharge.toFixed(2),
      taxCharge:tempTaxCharge.toFixed(2)
    })  
    // setGrandTotal(cartData.totalAmount+Number(tip))
    console.log("data", {
      "tempServiceCharge":tempServiceCharge,  
      "tempDeliveryCharge":tempDeliveryCharge,  
      "tempTaxCharge":tempTaxCharge,
      "tempDiscountCharge":tempDiscountCharge,
      "cartData.totalAmount":cartData.totalAmount
    });
  }
 
  useEffect(() => {
    let cart = localStorage.getItem('cart')
    if (!(cart!=null && Object.keys(JSON.parse(cart).orderItems).length!=0 )) {
      router.back()
    }
    dispatch(getAllOrderCharge({storeId:cartData?.storeId}))
  }, [])
  // Get selected pickup time
  useEffect(()=>{
    if (router.query.datetime!= undefined && router.query.datetime!='') {
      let bufferJson = Buffer.from(router.query.datetime,'base64').toString('ascii')
      try {
        setSelectPickupTime(JSON.parse(bufferJson))
      } catch (e) {}
    }
  },[router.query.datetime])
  // calulate All charges
  
  useEffect(() => {
    calculateCharges()
  }, [tip,cartData,charge,geoDistance,storeDetail])
  // Get selected address form url and set to state
  useEffect(() => {
    if (cartData.orderType==0) {
      if (myAddress.isLoading) {
        dispatch(getAddress())
      }else{
        if (router.query.address!=undefined && router.query.address!='' && !storeDetail.isLoading) {
          let seleAdd = myAddress.data.find(temp=>temp._id==router.query.address)
          setSelectAddress(seleAdd?seleAdd:{})
          getGeoDistance()
        }
      }  
    }
  }, [cartData,myAddress,router.query.address,storeDetail,selectAddress])

  useEffect(()=>{
    if (Object.keys(getOrderDetails).length) {
      // makePayment()
    }
  },[getOrderDetails])

  useEffect(() => {
    if (apiFail) {
      if(apiFail.statusCode >= 400 && apiFail.statusCode <= 500){
          nProgress.done()
          dispatch(unSetApiFail())
          alert(apiFail.message)
      }
    }
    if(apiSuccess){
      if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode <= 300){
        nProgress.done()
        makePayment(apiSuccess.data)
        dispatch(unSetApiSucc())
        let cartData = {
          orderItems:{},
          orderType:0,
          storeId:null,
          totalQuantity:0,
          totalAmount:0.00
        }
        localStorage.setItem('cart',JSON.stringify(cartData))
        dispatch(manageCartData())
        // setModal(!modal)
      }
    }
  }, [apiFail,apiSuccess]);

  return (
    <>
      <section className={`${styles.detailBanner}`}>
        <Container>
          <div className={`${styles.detailBlock}`}>
            <button className='bdrBtn' onClick={()=>{
              router.back()
            }}>Edit</button>
          </div>
        </Container>
      </section>

      <section className={`${styles.orderDetails}`}>
        <Container>              
          <Row>
            <Col lg="8">
              <Row>
                <Col md="12">
                  {
                    cartData.orderType==0
                      ? <div className={`${styles.selactAddress}`}>
                          <h6>Delivery Address</h6>
                          <span className={`${styles.addressInfo}`}>
                          {
                            selectAddress
                              ? <div>
                                  <h6>{selectAddress.tag}</h6>
                                  <p>{selectAddress.address} </p>
                                </div>
                              : null
                          }
                          </span>
                        </div>
                      :  <div className={`${styles.selactAddress}`}>
                          <h6>Pickup Time</h6>
                          <span className={`${styles.addressInfo}`}>
                            <p><b>Date</b> : {selectPickupTime.date}</p>
                            <p><b>Time</b> : {selectPickupTime.time} </p>
                          </span>
                        </div>
                  }
                </Col>
                {/* <Col md="4">
                  <h6>Payment Method</h6>
                  <span className={`${styles.selactPayment}`}>
                      <Image src={payment1} alt="payment1" />
                      <p>Stripe</p>
                  </span>
                </Col> */}
              </Row>
            </Col>
            <Col lg="4">
              <div className={`${styles.paymentBlock}`}>
                <h6>Summary</h6>
                <div className={`${styles.delivery}`}>
                  <div className={`${styles.orderItem}`}>
                    <span>Order From</span>
                    <h6>{!storeDetail.isLoading?storeDetail.data.title:''}</h6>
                    <p>{!storeDetail.isLoading?storeDetail.data.location.address:''}</p>
                  </div>
                  <div className={`${styles.deliveryInfo}`}>
                      <h6>{cartData.totalQuantity} Items in your Bag <span onClick={manageItemDropDown}>Delivery <span className='alignIcon'>
                        <Image src={alignIcon} alt="Align icon" /></span></span>
                      </h6>
                  </div> 
                  <div className={itemDropDown ? "itemShow" : 'itemHide'}>
                    <div className={`${styles.itemDetailsBlock} itemDetailsBlock`}>
                      {
                        Object.keys(cartData.orderItems).map(list=>(
                          Object.keys(cartData.orderItems[list].selectedGroup).map(group=>(                  
                            <div className={`${styles.itemDetails}`} key={group}>
                              <Row>
                                <Col sm="8" className='col-8'>
                                  <h6>{cartData.orderItems[list].menuitem.title}</h6>
                                  <p className={`${styles.variables}`}>
                                    {
                                      getCustomeTypeToString(cartData.orderItems[list].selectedGroup[group].group)
                                    }
                                  </p>
                                </Col>
                                <Col sm="4" className='col-4'>
                                  <div className={`${styles.signalItemQty}`}>
                                    <span>
                                      £{cartData.orderItems[list].selectedGroup[group].price}
                                    </span>
                                    <p>
                                      QTY : {cartData.orderItems[list].selectedGroup[group].quantity}
                                    </p>
                                  </div>
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
                      <li>
                        Subtotal <span>£{cartData.totalAmount}</span>
                      </li>
                      <li>
                        Discount on MRP <span className={`${styles.mrp}`}>-£{totalCharge.discount}</span>
                      </li>
                      <li>
                        <strong>Small order fee</strong> 
                        <Image src={about} alt="about"/> <span>£0.00</span>
                      </li>
                      <li>
                        Delivery charges <span>£{totalCharge.deliveryCharge}</span>
                      </li>
                      <li>
                        <strong className={`${styles.serviceFree}`}>Service Fee</strong> 
                        <Image src={about} alt="about"/> <span>£{totalCharge.serviceCharge}</span>
                      </li>
                      {/* <li>
                        Tax and Charges <span>£{totalCharge.taxCharge}</span>
                      </li> */}
                      <li>
                        Tip 
                        <span className={`${styles.tip}`}><span className={`${styles.currency}`}>&#163;</span>
                          <Input 
                            type="text" 
                            className={`${styles.formCantrol}`} 
                            placeholder=""
                            onChange={tipChange} 
                          /> 
                        </span>
                      </li>
                    </ul>
                    <div className={`${styles.request}`}>
                      <Input type="text" onChange={handelComment} className={`${styles.formCantrol}`} placeholder="Any request for your food (optional)" /> 
                    </div>
                    <div className={`${styles.totalInfo}`}>
                      <h4>Grand Total <span>£{totalCharge.grandTotal}</span></h4>
                    </div>
                    <div className={`${styles.btnBlock}`}>
                      <span role='button'><a onClick={submitOrder}>Continue to Pay</a></span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Modal isOpen={modal} className={`${styles.ModalPayment} modal_background` }>
        <ModalBody className={`${styles.modalBody}`}>
          <div className={`${styles.ImgBlock}`}>
            <Image src={successfull} alt="Successful" />
          </div>
          <h6>Payment Successful</h6>
          <p>Your Order has been Successful</p>
        </ModalBody>
        <ModalFooter className={`${styles.modalFooter}`}>
          <Col>
            <Row className="align-items-center">           
              <Col sm="12">
                <span role="button" 
                  onClick={()=>router.push({
                    pathname:'/store',
                    query:{
                      area:selectAddress.area,
                      lat:selectAddress.lat,
                      lng:selectAddress.lng,
                    }
                })}>
                <a className={`${styles.themeBtn}`}>Explore More</a></span>
              </Col>
            </Row>
          </Col>
        </ModalFooter>
      </Modal>
      <Modal isOpen={paymentModal} id={`${styles.stripeModelDesign}`} className={`${styles.paymentModal} modal_background` }>
        <ModalBody className={`${styles.modalBody}`}>
            {/* <span className={`${styles.closeButton}`} onClick={modalPopup}>CLOSE</span> */}
            {clientSecret && (
              <Elements  options={options} stripe={stripePromise}>
                <Checkoutform  paymentConfirm={paymentConfirm} userData={getOrderDetails}/>
              </Elements>
            )}
        </ModalBody>
      </Modal>
    </>
  )
}
CheckoutSummary.layout = IinnerLayout
export default CheckoutSummary
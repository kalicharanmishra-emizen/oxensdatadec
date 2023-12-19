import { Container, Row, Col, Input,Form ,FormGroup ,Button , Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import IinnerLayout from "../../layouts/linnerlayout";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from "../../styles/payment-details.module.css";
import successfull from '../../public/images/successfull-icon.svg';
import Image from 'next/image'
import star from '../../public/images/star.svg';
import greendot from '../../public/images/greendot.svg';
import dowenload from "../../public/dowenload.svg";
import Dirver from '../../public/images/Dirver.png';
import about from '../../public/images/about.svg';
import { getAuthUser } from '../../reducers/authSlice';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrderDetail } from '../../reducers/orderSlice';
import moment from 'moment';
import StoreRating from '../../componets/Model/rating/StoreRating';
import DriverRating from '../../componets/Model/rating/DriverRating';
import { emoji, paymentStatusColor, paymentStatusText } from '../../Helper/helper';
import Stars from '../../componets/rating/stars';
function Details({socket}) {  
    const router = useRouter()
    const dispatch = useDispatch()
    const {detail} = router.query
    const [modal, setModal] = useState(false);
    const [restoReview, setRestoReviewPopup] = useState(false);
    const [dirverModal, setDirverPopup] = useState(false);
    const orderDetail = useSelector(state => state.orderSlice.orderDetail)
    const [modelSelectData,setModelSelectData] = useState({})
    
    const handelRatingModel = (type, item={}) => {
      setModelSelectData(item)
      if (type === "order") {
        setRestoReviewPopup(!restoReview)
      }else{
        setDirverPopup(!dirverModal)
      }
    };

    const updateStatus = (id) => {
      if (id)  {
        document.getElementById(id).remove();
      }
    }

    const toggle = () => setModal(!modal);
    // const restoReviewPopup = () => {
    //   setRestoReviewPopup(!restoReview)
    // };
    // const dirverPopup = () => setDirverPopup(!dirverModal);

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

    useEffect(() => {
      if(!localStorage.getItem('auth-user-token')){
        router.push('/')
      }else{
        dispatch(getAuthUser())
      }
    }, [])
    useEffect(() => {
      if (detail!=undefined) {
        dispatch(getMyOrderDetail({orderId:detail}))
      }
    }, [detail])
    useEffect(()=>{
      socket.on('orderStatus',data=>{
        dispatch(getMyOrderDetail({orderId:data._id}))
      })
    },[socket])
    
    return (
      <>
          <section className={`${styles.MyOrderDetails}`}>
              <Container>
                <div className={`${styles.orderDetails}`}>
                  <h3>Order Details</h3>
                  <div className={`${styles.orderBox}`}>
                    {
                      orderDetail.isLoading ?
                        <p>Loading...</p>
                      :
                        Object.keys(orderDetail.data).length==0 ?
                          <p>No data found</p>
                        :
                        <>
                          <Row className={`${styles.intesBox}`}>
                            <Col lg="9">
                              <div className={`${styles.ukRestaurant}`}>
                                <div className={`${styles.imgBlock}`}>
                                  <img src={orderDetail.data.storeDetail.image} alt="Store Image"/>
                                </div>
                                <div className={`${styles.orderWrap}`}>
                                  <h4>{orderDetail.data.storeDetail.name}</h4>
                                  <p> <b>Order Type :</b> {orderDetail.data.type?"Pickup":"Delivery"} </p>
                                  <p> Address : {orderDetail.data.storeDetail.address} </p>
                                </div>
                              </div>
                            </Col>
                            <Col lg="3">
                              <ul className={`${styles.review}`}>
                                { 
                                  orderDetail.data.status > 0 && orderDetail?.data?.userPDF !== null 
                                    ? <li> Dowenload invoice 
                                        <a href={orderDetail?.data?.userPDF} target="_blank" rel="noopener noreferrer" style={{color:"#525f7f", marginLeft: "10px" }}>
                                          <Image src={dowenload} width="15px" height="15px" alt="dowenload"/>
                                        </a>
                                      </li> 
                                    : "" 
                                }
                                { 
                                  orderDetail.data.status > 5 && orderDetail.data.status != 8 && !orderDetail.data.storeReview 
                                    ? <li id={orderDetail?.data?._id} onClick={()=>handelRatingModel("order",orderDetail.data )}> 
                                        <Image src={star} alt="star"/> Rate &amp; Review Restaurant   
                                      </li> 
                                    : "" 
                                }
                                {   
                                  orderDetail.data.type === 0  && (orderDetail.data.status > 5 && orderDetail.data.status != 8 && !orderDetail.data.driverReview) 
                                    ?  <li id={orderDetail?.data?._id + "driver"} onClick={()=>handelRatingModel("driver", orderDetail.data)}>
                                        <Image src={star} alt="star"/> Rate your Driver
                                      </li> 
                                    : "" 
                                }
                              </ul>
                            </Col>
                            <h4>Your Order</h4>
                          </Row>
                          <Row>
                            <Col lg="8">
                              {
                                orderDetail.data.orderProduct.map(list=>(
                                  <div className={`${styles.productDetails}`} key={list._id}>
                                    <div className={`${styles.imgBlock}`}>
                                      <Image src={greendot} alt="greendot"/>
                                    </div>
                                    <div className={`${styles.orderWrap}`}>
                                      <h4>
                                        {list.title}
                                        {/* <span className={`${styles.Undelivered}`}>Undelivered</span> */}
                                      </h4>
                                      <p>{getCustomeTypeToString(list.customize)}</p>
                                      <h6><span className={`${styles.towbox}`}>{list.quantity}</span>
                                      <span className={`${styles.Price}`}>X</span> <span className={`${styles.Price}`}>£{(list.price / list.quantity).toFixed(2)}</span> 
                                        <span className={`${styles.rightPrice}`}>£{list.price.toFixed(2)}</span></h6>
                                    </div>
                                  </div>
                                ))
                              }
                              <Row>
                                <Col lg="8">
                                  <div className={`${styles.orderId}`}>
                                    <ul>
                                      <li>Order ID : <span>#{orderDetail.data.orderNumber}</span></li>
                                      <li>Ordered on : <span>{moment(orderDetail.data.createdAt).format('LLL')}</span></li>
                                      {
                                        orderDetail.data.type==0
                                          ? <li>Delivered To : <span>{orderDetail.data.deliveryAddress.address}</span></li>  
                                          : <li>Pickup At : 
                                              <span>
                                                <ul>
                                                  <li>
                                                    <b>Date:-</b> {orderDetail?.data?.pickupData?.date}
                                                  </li>
                                                  <li>
                                                    <b>Time:-</b> {orderDetail?.data?.pickupData?.time}
                                                  </li>
                                                </ul>
                                              </span>
                                            </li>
                                      }
                                      {
                                        orderDetail.data.status == 6
                                          ? <li>Delivered on : <span>{moment(orderDetail.data.deliveryDate).format('LLL')}</span></li>
                                          : null
                                      }
                                      {
                                        orderDetail.data.status == 7
                                          ? <li>Cancelled on : <span>{moment(orderDetail.data.deliveryDate).format('LLL')}</span></li>
                                          : null
                                      }
                                      {
                                        orderDetail.data.callStatus == true
                                          ? <li>Driver Number : <a href={"tel:"+orderDetail.data.twillioPhoneNumber}>{orderDetail.data.twillioPhoneNumber}</a><span> NOTE: Call can only be connected with your registered mobile number.</span></li>
                                          : null
                                      }
                                    </ul>
                                  </div>
                                </Col>
                                <Col lg="4">
                                  <div className={`${styles.orderId}`}>
                                    <ul>
                                      <li>Payment mode : <span className={`${styles.onlines}`}>online</span></li>
                                      <li>Payment status : <span style={{color:paymentStatusColor(orderDetail?.data?.paymentStatus)}} >{paymentStatusText(orderDetail?.data?.paymentStatus)}</span></li>
                                      {/* <li>Payment status : <span className={`${styles.onlines}`}>{orderDetail?.data?.paymentStatus === 0 ? "processing" : "success"}</span></li> */}
                                      <li>Delivery Code : <span style={{color:"black", fontWidth:"900"}}>{orderDetail.data.userCode}</span></li>
                                    </ul>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <h5>{ orderDetail.data.reviewdetails.length !== 0 ?  "Order Review Details" : ""}</h5>
                                <Col lg="12">
                                  <div className={`${styles.orderId}`}>
                                      {
                                        orderDetail.data.reviewdetails.map((item) => (
                                          <ul key={item._id}>
                                            <h6>{item.type === "driver" ? "Driver Review" : "Order Review"}</h6>
                                            <li>Review by : <span >{item.name}</span></li>
                                            <li>Rating : <span >{ item.type === "driver" ? <Stars data={item.rateType}/> : <Image src={emoji(item.rateType)} width="20" height="20" alt="rateType" />}</span></li>
                                            <li>{item.description ? "description :":""} <span>{item.description}</span></li>
                                          </ul>
                                         ))
                                      }
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            {/* summery */}
                            <Col lg="4">
                              <div className={`${styles.delivery}`}>
                                <div className={`${styles.deliveryInfo}`}>
                                  <h6>{orderDetail.data.totalQuantity} Items in your Bag</h6>
                                  </div>
                                  <div className={`${styles.subtotal}`}>
                                    <ul>
                                      <li>Subtotal <span>£{orderDetail.data.totalMrp}</span></li>
                                      <li>Delivery charges <span>£{orderDetail.data.deliveryPrice}</span></li>
                                      <li>Discount on MRP <span className={`${styles.mrp}`}>- £{orderDetail.data.discountPrice}</span></li>
                                      <li><strong className={`${styles.serviceFree}`}>Service Fee</strong> <Image src={about} alt="about"/> <span>£{orderDetail.data.servicePrice}</span></li>
                                      {/* <li>Tax and Charges <span>£{orderDetail.data.taxCharge}</span></li> */}
                                      <li>Tip <span>£{orderDetail.data.tip}</span></li>
                                    </ul>
                                  <div className={`${styles.request}`}>
                                  <span className={`${styles.formCantrol}`}>
                                    {orderDetail.data.comment}
                                  </span> 
                                  </div>
                                  <div className={`${styles.totalInfo}`}>
                                  <h4>Grand Total <span>£{Number(orderDetail?.data?.totalPrice) + Number(orderDetail.data.tip) }</span></h4>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </>
                    }
                  </div>
                </div>
              </Container>
          </section>

          <StoreRating 
            isOpen={restoReview}
            selectData={modelSelectData}
            restoReviewPopup={handelRatingModel}
            updateStatus={updateStatus}
          />

          <DriverRating
             isOpen={dirverModal}
             selectData={modelSelectData}
             dirverPopup1={handelRatingModel}
             updateStatus={updateStatus}
            //  driverDetails={myOrderList?.data?.docs?.driverDetail ?? ""}
          />   
      </>
  )
}
Details.layout = IinnerLayout
export default Details
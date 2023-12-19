import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, CardFooter} from 'reactstrap'
import IinnerLayout from "../../layouts/linnerlayout"
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import styles from "../../styles/my-order.module.css";
import FileUpload from '../../public/images/file-upload.svg';
import GreenStar from '../../public/images/green-star.svg';
import checkMark from '../../public/images/checkMark.svg';
import Tracking from '../../componets/Model/Tracking';
import StatusTrack from '../../componets/order/statusTrack'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser } from '../../reducers/authSlice';
import { getMyOrderList } from '../../reducers/orderSlice';
import moment from 'moment';
import { storeUserReview } from '../../reducers/reviewSlice';
import { Formik } from 'formik';
import * as yup from 'yup'
import StoreRating from '../../componets/Model/rating/StoreRating';
import DriverRating from '../../componets/Model/rating/DriverRating';
import Help from '../../componets/Model/rating/Help';
import PaginationClient from '../../componets/Pagination/PaginationClient';
import PaginationServer from '../../componets/Pagination/PaginationServer';

function Index({socket}) {  
  const router = useRouter()
  const dispatch = useDispatch()
  const [track, setTrack] = useState(false);
  const [help, helpPopup] = useState(false);
  // const [help, helpPopup1] = useState(false);
  const [restoReview, restoReviewPopup] = useState(false);
  const [dirverModal, dirverPopup1] = useState(false);
  const [trackingOrder,setTrackingOrder] = useState({})
  const trackingOrderRef = useRef(trackingOrder)
  const [modelSelectData,setModelSelectData] = useState({})
  const myOrderList = useSelector(state=>state.orderSlice.myOrderList)

  // pagination start 
  const [loader, setLoader] = useState(true)
  const [currentItem, setCurrentItem] = useState([])
  const [paginationData, setPaginationData] = useState(null)
  const [currentOffset, setCurrentOffset] = useState(1)
  // useEffect(() => {
  //     dispatch(getMyOrderList(1))
  // }, [])
  useEffect(()=>{
      if (!myOrderList.isLoading) {
          setCurrentItem(myOrderList.data.docs)
          setPaginationData({
              totalDocs: myOrderList.data.totalDocs,
              limit: myOrderList.data.limit,
              page: myOrderList.data.page,
              totalPages: myOrderList.data.totalPages,
              hasPrevPage: myOrderList.data.hasPrevPage,
              hasNextPage: myOrderList.data.hasNextPage,
              prevPage: myOrderList.data.prevPage,
              nextPage: myOrderList.data.nextPage
          })
          setLoader(false)
      }
  },[myOrderList])
  const pageChange=(data)=>{
      setLoader(true)
      dispatch(getMyOrderList(data))
  }
  // pagination end 


  const trackModal = (e) => {
    let id = e.target.id
    if (id=='' || id==undefined) {
      trackingOrderRef.current={}
      setTrackingOrder({})
    }else{
      let tempData = myOrderList.data.docs.find(temp=>temp._id==id)
      trackingOrderRef.current=tempData
      setTrackingOrder(tempData)
    }
    setTrack(!track);
  }
  const helpPopupModel = (list) => {
    helpPopup(!help)
    console.log("list", list);
    setModelSelectData(list)

  };
  // const dirverPopup = () => dirverPopup1(!dirverModal);
  const handelRatingModel = (type, item={}) => {
    setModelSelectData(item)
    if (type === "order") {
      restoReviewPopup(!restoReview)
    }else{
      dirverPopup1(!dirverModal)
    }
  };

  const updateStatus = (id) => {
    if (id) {
      document.getElementById(id).remove();
    }
  }

  useEffect(() => {
    if(!localStorage.getItem('auth-user-token')){
      router.push('/')
    }else{
      dispatch(getAuthUser())
      dispatch(getMyOrderList())
    }
  }, [])
  useEffect(()=>{
    socket.on('orderStatus',data=>{
      if(Object.keys(trackingOrderRef.current).length!=0){
        if(trackingOrderRef.current._id==data.orderData._id){
          setTrackingOrder(data.orderData)
        }
      }
      dispatch(getMyOrderList())
    })
  },[socket])

  console.log("modelSelectData", modelSelectData);
  return (
    <>
        <section className={`${styles.myOrder}`}>
          <Container>
            <div className={`${styles.orderWrap}`}>
              <h3>My Order</h3>
              {
                myOrderList.isLoading?
                  <p>Loading....</p>
                :
                  myOrderList?.data?.totalDocs==0?
                    <p style={{textAlign:"center"}}>No data Found</p>
                  : 
                    myOrderList.data.docs.map((list, index) => (
                      // ${styles.delivered}
                      // ${styles.cancelItem}`}
                      <div className={`${styles.orderItem}`} key={list._id}>
                        <Row>
                          <Col lg="12">
                            <div className={`${styles.imgBlock}`}>
                              <img src={list.storeDetail.image} alt="store Image" />
                              {/* <Image src={order1} alt="Item" /> */}
                            </div>
                            <div className={`${styles.itemContent}`}>
                              <div className={`${styles.leftInfo}`}>
                                <h6>{list.storeDetail.name}</h6>
                                <p><span>Order Type :</span> {list.type?"Pickup":"Delivery"}</p>
                                <p><span>Address :</span> {list.storeDetail.address}</p>
                                <span><span>Order #{list.orderNumber}</span><span className="mx-1">{moment(list.createdAt).format('LLL')}</span></span>
                                <span className={`${styles.orderID}`}><span>Delivery Code:</span> {list.userCode}</span>
                              </div>
                              <div className={`${styles.rightInfo}`}>
                                {
                                  list.status == 6 
                                    ? <span>Delivered on : { moment(list.deliveryDate).format('LLL') } <Image src={checkMark} alt="checkMark" /></span>
                                    : list.status == 7 
                                      ? <span><span className={`${styles.Cancel}`}>Cancelled</span> on { moment(list.deliveryDate).format('LLL') } 
                                         <Image src={checkMark} alt="checkMark" />
                                        </span>
                                      : null
                                }
                                { 
                                  list.status > 5 && list.status != 8 && !list.storeReview 
                                    ? <span role="button"  id={list._id}><a onClick={()=>handelRatingModel('order',list)}>
                                        <Image src={GreenStar}/>Rate &amp; Review Restaurant </a>
                                        </span> 
                                    : ""
                                }
                                { 
                                  list.type === 0  && (list.status > 5 && list.status != 8 && !list.driverReview)  
                                    ? <span role="button" id={list._id + "driver"}><a onClick={()=>handelRatingModel("driver",list)}>
                                        <Image src={GreenStar}/>Rate &amp; your Driver </a>
                                      </span> 
                                    : "" 
                                }
                                {/* <span className={`${styles.rated}`}>Rated <span><Image src={star} width="12" alt="star" />4.2</span></span> */}
                              </div>
                            </div>
                            {/* Tracking status start*/}
                              <div className={`trackOrderpopup ${styles.trackInfo}`}>
                                <StatusTrack
                                  type={list.type}
                                  status={list.status}
                                  driver={{
                                      status:false,
                                      detail:{}
                                  }}
                                />
                              </div>
                            {/* Tracking status end*/}

                            <div className={`${styles.itemFooter}`}>
                              <Row className="align-items-center">
                                <Col className="col-6">
                                  <div className={`${styles.btnBlock}`}>
                                    {
                                      list.status < 6 && list.type==0 
                                        ? <span role="button"><a id={list._id} onClick={trackModal} className={`${styles.oxensBtnstyleTwo}`}>Track order</a></span>
                                        : <span role="button"><a onClick={() => helpPopupModel(list)} className={`${styles.oxensBtnstyleTwo}`}>Help</a></span>
                                    }
                                    <Link href={`/myOrder/${list._id}`}><a className={`${styles.oxensBtn}`}>Details</a></Link>
                                  </div>
                                </Col>
                                <Col className="col-6">
                                  <div className={`${styles.totalPad}`}>
                                    <p className="p-0">Total Paid : <span>£{Number(list?.totalPrice) + Number(list?.tip)}</span></p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))
              }
              {
                myOrderList?.data?.totalDocs === 0 ? "" :
                  (paginationData)
                    ? <div className="d-flex justify-content-end">
                        <PaginationServer 
                          data={paginationData}
                          pagFun={pageChange}
                        />
                      </div>
                    : null        
              }
            </div>
              
          </Container>
      

        </section>
        {/* track order */}
          <Tracking
            modal={track}
            toggle={trackModal}
            trackingOrder={trackingOrder}
            socket={socket}
          />
          
        {/* Help */}
          <Help 
            isOpen={help}
            selectData={modelSelectData}
            helpPopup={helpPopupModel}
         />
          {/* <Modal isOpen={help} toggle={helpPopup} className={`${styles.helpPopup}`}>
            <ModalHeader className={`${styles.modalHeader}`}>Help</ModalHeader>
            <span className={`${styles.closeButton}`} onClick={helpPopup}></span>
            <ModalBody className={`${styles.modalBody}`}>
              <div className={`${styles.helpPopupWrap}`}>
                <span className={`${styles.helpTitle}`}>Order ID : <span>#5269002470</span></span>
                <Form>
                  <FormGroup>
                    <Input id="exampleSelect" name="select" type="select">
                      <option>Reason</option>
                      <option>Reason</option>
                      <option>Reason</option>
                      <option>Reason</option>
                      <option>Reason</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Input id="exampleText" name="text" type="textarea" placeholder="Description" />
                  </FormGroup>
                  <FormGroup>
                    <div className={`${styles.fileSelector}`}>
                      <Label for="fileSelector">
                        <span>Upload your Image</span>
                        <span className={`${styles.fileIcon}`}><Image src={FileUpload} alt="File" /></span>
                        <Input id="fileSelector" type="file"  />
                      </Label>
                    </div>
                  </FormGroup>
                  <div className={`${styles.btnBlock}`}>
                    <Button type="submit" className={`${styles.oxensBtn}`}>Send</Button>
                  </div>
                </Form>
              </div>          
            </ModalBody>
          </Modal> */}

        {/* restro review */}
         <StoreRating 
            isOpen={restoReview}
            selectData={modelSelectData}
            restoReviewPopup={handelRatingModel}
            updateStatus={updateStatus}
         />

        {/* restro review driver */}
          <DriverRating
             isOpen={dirverModal}
             selectData={modelSelectData}
             dirverPopup1={handelRatingModel}
             driverDetails={myOrderList?.data?.docs?.driverDetail ?? ""}
             updateStatus={updateStatus}
          />       
    </>
  )
}
Index.layout = IinnerLayout
export default Index
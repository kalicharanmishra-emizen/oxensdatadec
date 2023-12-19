import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col} from 'reactstrap';
import IinnerLayout from "../../layouts/linnerlayout";
import ItemsList from '../../componets/order/items-list';
import styles from "../../styles/payment-details.module.css";
import OrderSummary from '../../componets/order/order-summary';
import { manageCartData } from '../../reducers/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreDetail } from '../../reducers/storeSlice';
import moment from 'moment';
function Details() {
    const router = useRouter()
    const dispatch = useDispatch()
    const cartData = useSelector(state => state.mainSlice.cart)
    const storeDetail = useSelector(state=>state.storeSlice.storeDetail)
    const [selectAddress,setSelectAddress]= useState(null)
    const [selectPickuptime,setSelectPickupTime] = useState({
      date:'',
      time:''
    })
    const getSelectAddress = (value)=>{
      setSelectAddress(value)
    }
    const getSelectPickupTime = (value)=>{
      setSelectPickupTime(value)
    }
    const getPayClick = () => {
        if ((cartData.orderType === 0 && selectAddress) || (cartData.orderType === 1 && selectPickuptime.date !== '' && selectPickuptime.time !== '')) {
          if (cartData.orderType === 0) {
            router.push({
              pathname:'/checkout/summary',
              query:{
                address:selectAddress,
              }
            })
          }else{
            router.push({
              pathname:'/checkout/summary',
              query:{
                datetime:Buffer.from(JSON.stringify(selectPickuptime)).toString('base64'),
              }
            })
          }
        }else{
          Swal.fire({
            icon: 'error',
            title: cartData.orderType?'Please select pickup time':'Please select delivery address',
            timer: 1000,
            showConfirmButton: false,
          })
        }
    }
    useEffect(() => {
      let cart = localStorage.getItem('cart')
      if (!(cart!=null && Object.keys(JSON.parse(cart).orderItems).length!=0 )) {
        router.back()
      }
    }, [])
    useEffect(()=>{
      if(cartData.storeId && storeDetail.isLoading){
        dispatch(getStoreDetail({storeId:cartData.storeId}))
      }
      if (Object.keys(cartData.orderItems).length==0 && localStorage.getItem('cart') && Object.keys(JSON.parse(localStorage.getItem('cart')).orderItems).length!=0 ) {
        dispatch(manageCartData())
      }
    },[cartData])
    return (
      <>
          <section className={`${styles.detailBanner}`}>
            <Container>
              {/* <Row className="justify-content-center">
                <Col xl="2" lg="3" md="4" sm="6" className="col-6">
                 <div className={`${styles.detailTitle}`}>
                    <span className={`${styles.active}`} >Order Details</span> 
                  </div> 
                </Col>
                <Col xl="2" lg="3" md="4" sm="6" className="col-6">
                 <div className={`${styles.detailTitle}`}>
                    <span>Payment Details</span> 
                  </div> 
                </Col>
              </Row> */}
              <div className={`${styles.detailBlock}`}>
                <Link href={`/store/${cartData?.storeId}`}><a className='bdrBtn'>Back to Restaurant</a></Link>
              </div>
            </Container>
          </section>

          <section className={`${styles.orderDetails}`}>
            <Container>              
              <Row>
                <Col lg="8">
                  <ItemsList
                    getSelectAddress={getSelectAddress}
                    getSelectPickupTime={getSelectPickupTime}
                    storeDetail={storeDetail}
                    cartData={cartData}
                  />
                </Col>
                <Col lg="4">
                  <OrderSummary
                    cartData={cartData}
                    storeDetail={storeDetail}
                    getPayClick={getPayClick}
                  />
                </Col>
              </Row>
            </Container>
          </section>
      </>
  )
}
Details.layout = IinnerLayout
export default Details
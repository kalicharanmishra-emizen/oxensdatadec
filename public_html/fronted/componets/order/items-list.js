import { Row, Col, Label, Input} from 'reactstrap'
import React, {useEffect, useState} from "react";
import Image from 'next/image';
import styles from "../../styles/payment-details.module.css";
import payment1 from '../../public/images/payment1.png';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress } from '../../reducers/addressSlice';
import Location from '../Model/location';
import { calculateMultitpleDistance } from '../../Helper/helper';
import { getAllOrderCharge } from '../../reducers/orderSlice';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
export default function ItemsList({getSelectAddress,getSelectPickupTime,storeDetail,cartData}) {
    const dispatch = useDispatch()
    const myAddress = useSelector(state => state.addressSlice.list)
    const [locationModal, setLocationModal] = useState(false);
    const [destinations,setDestinations] = useState([]); 
    const [geoDistance,setGeoDistance] = useState([]); 
    const [pickupDate, setPickupDate] = useState({
      date:'',
      time:''
    })
    const charge = useSelector(state => state.orderSlice.charge)
    
    const getGeoDistance = async () =>{
      let distance = await calculateMultitpleDistance(
        {
          lat:Number(storeDetail.data.location.late||0),
          lng:Number(storeDetail.data.location.lng||0)
        },
      destinations)
      setGeoDistance(distance)
    }
    const handelPickupTimeChange = () =>{
      getSelectPickupTime(pickupDate)
    }
    const handelAddressChange = (e)=>{
      // console.log('value',e.target.value);
      getSelectAddress(e.target.value)
    }
    const handelLocation = () => {
      document.body.classList=''
      setLocationModal(!locationModal)
    }
    const timeFilter = (time) =>{
        let timeFormat = moment(time).format("HH:mm")
        return ((new Date().getTime() < new Date(time).getTime()) && (moment(timeFormat,"HH:mm").isBetween(moment(storeDetail?.data?.timing?.time_data?.open,'HH:mm'),moment(storeDetail?.data?.timing?.time_data?.close,'HH:mm'))) )
    }
    useEffect(()=>{
      dispatch(getAllOrderCharge({storeId:cartData?.storeId}))
    },[])
    useEffect(() => {
      if (!cartData.orderType) {   
        // get and set user address when order type is deivery
        if (myAddress.isLoading) {
          dispatch(getAddress())
        }else{
          let destinationArray = []
          myAddress.data.forEach(list=>{
            destinationArray.push({
              lat:Number(list.lat||0),
              lng:Number(list.lng||0)
            })
          })
          setDestinations(destinationArray)
        } 
      }
    }, [myAddress,cartData])
    useEffect(() => {
      if (destinations.length!==0 && !storeDetail.isLoading) {  
        getGeoDistance()
      }
    }, [destinations,storeDetail])
    console.log("pickupDate",pickupDate);
  return (
    <>
      <div className={`${styles.odrDetail}`}>
        <div className={`${styles.addTitle}`}>
          {
            cartData?.orderType?
              <h4>Pickup Date and Time</h4>
            :
              <>
                <h4>Delivery Address</h4>
                <button className='bdrBtn' onClick={handelLocation}>Add New Address</button>
              </>
          }
        </div>
        <div className={`${styles.addBlock}`}>
          {
            cartData.orderType && !storeDetail.isLoading?
            <div className='row'>
              <div className='col-md-4'>
                <ReactDatePicker
                  selected={pickupDate.date!=''?new Date(pickupDate.date):''}
                  minDate={new Date()}
                  timeIntervals={60}
                  onChange={(date) => {
                    pickupDate.date = moment(date).format('L')
                    setPickupDate({...pickupDate})
                    handelPickupTimeChange()
                  }}
                  inline
                />
              </div>
              <div className='col-md-2 timeContainer'>
                <ReactDatePicker
                  inline
                  className='d-block'
                  selected={pickupDate?.time !== '' ? moment(pickupDate?.time,'HH:mm')._d : ''}
                  // timeClassName={()=>'d-block'}
                  onChange={(date) => {
                    pickupDate.time = moment(date).format("HH:mm")
                    setPickupDate({...pickupDate})
                    handelPickupTimeChange()
                  } }
                  showTimeSelect
                  showTimeSelectOnly
                  filterTime={timeFilter}
                  timeIntervals={60}
                  timeCaption="Pickup Time"
                  dateFormat="HH:mm"
                />
              </div>
            </div>
            :
            <Row>
              {
                myAddress.isLoading || geoDistance.length==0?
                  <p>Loading....</p>
                :
                  myAddress.data.map((list,key)=>(
                    <Col xl="6" key={list._id}>
                      <div className={`${styles.addBox}`}>
                        {
                          ( geoDistance[key]==0 || geoDistance[key] > charge.deliveryDistance)
                            ? // onChange={handelAddressChange}
                              <Input type='radio'  disabled value={list._id} name="address" id={`address_${list._id}`} />
                            : 
                              <Input type='radio' onChange={handelAddressChange} value={list._id} name="address" id={`address_${list._id}`} />
                        }
                        
                        <Label htmlFor={`address_${list._id}`}>
                          <h6>{list.tag}</h6>
                          <span>
                            {list.address}
                          </span>                  
                        </Label>                
                      </div>
                    </Col>
                  //   <Col xl="6">
                  //   <div className={`${styles.addBox}`}>
                  //     <Input type='radio' disabled  name="Radio" id="address3" />
                  //     <Label htmlFor="address3">
                  //       <h6>Address-3</h6>
                  //       <span>70 US, Located Inside Walmart, Carson City, United States</span>
                  //     </Label>
                  //   </div>
                  // </Col>
                  ))
              }
            </Row>
          }
          
        </div>
        {/* <div className={`${styles.paymentMethod}`}>
          <h6>Payment Method</h6>
          <ul>
            <li>
              <Input type='radio' id="payment" name="payment" defaultChecked value="stripe" />
              <Label htmlFor='payment'>
                <Image src={payment1} alt="Method" />
                <span className={`${styles.customRadio}`}></span>
                <p>Stripe</p>
              </Label>
            </li>
          </ul>
        </div> */}
      </div>
      <Location
        isOpen={locationModal}
        handelLocation={handelLocation}
        locationData={
          {
              location:{
                  address:"",
                  area:'',
                  lat:"",
                  lng:""
              },
              tag:"Home"
          }
        }
      />
    </>
  )
}

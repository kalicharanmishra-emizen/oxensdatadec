import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap'
import StoreLayout from "../../layouts/Store"
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, { useEffect, useState } from 'react';
import styles from "../../styles/store-detail.module.css";
import QuantityBtn from '../../componets/quantityBtn'
import DetailsSidebar from '../../componets/posts/details-sidebar'
import RatingStar from '../../componets/rating/ratingStar'
import infoIcon from '../../public/images/info-icon.svg';
import likeIcon from '../../public/images/likeIcon.svg';
import phoneIcon from '../../public/images/phoneIcon.svg';
import { useDispatch, useSelector } from 'react-redux'
import Nprogress from 'nprogress'
import { getStoreDetail,getStoreItems,setFilterStoreItems, storeRatingList } from '../../reducers/storeSlice'
import Cart from '../../componets/Model/Cart'
import RemoveItem from '../../componets/Model/RemoveItem'
import { manageCartData } from '../../reducers/mainSlice'
import { badgesColor, badgesText, calculateDistance } from '../../Helper/helper'
import moment from 'moment'
function Details() {
  const router = useRouter()
  const dispatch = useDispatch()
  const {storeId} = router.query
  const storeDetail = useSelector(state => state.storeSlice.storeDetail)
  const storeRationg = useSelector(state => state.storeSlice.storeRating)
  const storeItems = useSelector(state => state.storeSlice.storeItems)
  const cart = useSelector(state => state.mainSlice.cart)
  const [nextPage, setNextPage] = useState(null)
  const [nextPageReview, setNextPageeview] = useState(null)
  const [itemId, setItemId] = useState(null)
  const [cartItem, setCartItem] = useState(null)
  const [selectedCat, setSelectedCat] = useState(null)
  const [selectedCatTitle, setSelectedCatTitle] = useState('')
  const [cartModal, setCartModal] = useState(false);
  const [cartRemoveModal, setCartRemoveModal] = useState(false);
  const [hygienicModal, setHygienicModal] = useState(false);
  const [astimateTime, setAstimateTime] = useState(0)
  const [bannerImage, setBannerImage] = useState(
    {
      main:[process.env.BASE_URL+'/images/placeholder-banner.png'],
      other:[]
    }
  )
  const [storeTiming, setStoreTiming] = useState(
    {
      open:'0.00',
      close:'0.00'
    }
  )
  {console.log("storeDetail", storeDetail)}
  {console.log("storeRationg", storeRationg)}
  {console.log("storeItems", storeItems)}
  {console.log("cart", cart)}
  // const [tempCart, setTempCart] = useState(cart)
  /* add non custome item to cart */
  const addItemToCart = (item) => {
      let cart = localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):{
          orderItems:{},
          storeId:storeId,
          orderType:0,
          totalQuantity:0,
          totalAmount:0.00,
      }
      let itemPrice = Number(item.price)
      let latestGroup = cart.orderItems[item._id]?cart.orderItems[item._id].latestGroup : []
      let selectedGroup = cart.orderItems[item._id]?cart.orderItems[item._id].selectedGroup : {}
      /* Find and create a selected group start */
          let selectedGroupRaw=[]
          let groupKey=item._id
          selectedGroup[groupKey]={
              group:selectedGroupRaw,
              quantity:selectedGroup[groupKey]?selectedGroup[groupKey].quantity+1:1,
              price:selectedGroup[groupKey]?selectedGroup[groupKey].price+itemPrice:itemPrice
          }
          latestGroup=selectedGroupRaw
      /* Find and create a selected group end */
      /* set cart data to a spacific format start*/   
          cart.orderItems[item._id]= {
              menuitem:item,
              selectedGroup:selectedGroup,
              latestGroup:latestGroup,
              itemQuantity:cart.orderItems[item._id]?cart.orderItems[item._id].itemQuantity+1:1,
              itemPrice:cart.orderItems[item._id]?cart.orderItems[item._id].itemPrice+itemPrice:itemPrice
          }
          if (!cart.storeId) {
            cart.storeId = storeId
          }
          cart.totalQuantity+=1
          cart.totalAmount+=itemPrice
          localStorage.setItem('cart',JSON.stringify(cart))
          dispatch(manageCartData())
      /* set cart data to a spacific format end*/
  }
  const handelOrderType = (e) =>{
    let cart = localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):{
      orderItems:{},
      storeId:storeId,
      orderType:0,
      totalQuantity:0,
      totalAmount:0.00,
    }
    cart.orderType = Number(e?.target?.value ? e?.target?.value : 0)
    localStorage.setItem('cart',JSON.stringify(cart))
    dispatch(manageCartData())
  }
  const cartToggle = (e) => {
    let selectItem = null
    if (e !== undefined) {      
      let item = e.currentTarget.getAttribute('item')
      selectItem = storeItems.doc.find(data => data._id == item)
    }
    if (selectItem!=undefined) {
      if (cart.storeId && storeId!=cart.storeId) {
        Swal.fire({
          icon: 'info',
          html:`Your cart has existing items from other store. Do you want to clear it and add items from ${storeDetail.data?storeDetail.data.title:''}?`,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          scrollbarPadding:false,
          closeOnConfirm: true,
          customClass:{
            actions:'cartConfirmAction',
            confirmButton: 'ageInfoBtn',
            cancelButton: 'ageInfoBtn',
            htmlContainer:'ageInfoHtmlContainer',
            title:"cartConfirnHeader"
        }}).then(result=>{
            if (result.isConfirmed) {
                localStorage.removeItem('cart')
                dispatch(manageCartData())
                if (selectItem.age_res) {
                  Swal.fire({
                    icon: 'info',
                    html:`You mush be of 18+ age for ordering this product.<br>Are you 18 or above?`,
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    scrollbarPadding:false,
                    closeOnConfirm: true,
                    customClass:{
                      actions:'cartConfirmAction',
                      confirmButton: 'ageInfoBtn',
                      cancelButton: 'ageInfoBtn',
                      htmlContainer:'ageInfoHtmlContainer',
                      title:"cartConfirnHeader"
                  }}).then(result=>{
                      if (result.isConfirmed) {
                        if (selectItem.is_customize) {
                          setCartItem(selectItem)
                          setCartModal(!cartModal)
                        }else{
                          addItemToCart(selectItem)
                        }
                      }
                  })
                }else{
                  if (selectItem.is_customize) {
                    setCartItem(selectItem)
                    setCartModal(!cartModal)
                  }else{
                    addItemToCart(selectItem)
                  }
                }
            }
        })
      }else{
        if (selectItem.age_res) {
          Swal.fire({
            icon: 'info',
            html:`You mush be of 18+ age for ordering this product.<br>Are you 18 or above?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            scrollbarPadding:false,
            closeOnConfirm: true,
            customClass:{
              actions:'cartConfirmAction',
              confirmButton: 'ageInfoBtn',
              cancelButton: 'ageInfoBtn',
              htmlContainer:'ageInfoHtmlContainer',
              title:"cartConfirnHeader"
          }}).then(result=>{
              if (result.isConfirmed) {
                if (selectItem.is_customize) {
                  setCartItem(selectItem)
                  setCartModal(!cartModal)
                }else{
                  addItemToCart(selectItem)
                }
              }
          })
        }else{
          if (selectItem.is_customize) {
            setCartItem(selectItem)
            setCartModal(!cartModal)
          }else{
            addItemToCart(selectItem)
          }
        }
      }
    }else{
      setCartItem(null)
      setCartModal(!cartModal)
    }
  }
  const cartRemoveToggle=()=>{
    setItemId(null)
    setCartRemoveModal(!cartRemoveModal)
  }
  const hygienicToggle = () => setHygienicModal(!hygienicModal);
  const getSelectedCat = (value) => {
    let tempCat = storeDetail.data.filter.find(list=>list._id==value)
    // Nprogress.start()
    dispatch(setFilterStoreItems({storeId:storeId,catId:value}))
    setSelectedCat(tempCat._id)
    setSelectedCatTitle(tempCat.title)
  }
  const loadItems = (type=null) =>{
    if (type === "review") {
      if (storeRationg.paginate.nextPage) {
        dispatch(storeRatingList({storeId:storeId,catId:selectedCat},storeRationg.paginate.nextPage,true))
      }
    }else{
      if (storeItems.paginate.nextPage) {
        dispatch(getStoreItems({storeId:storeId,catId:selectedCat},storeItems.paginate.nextPage))
      }
    }
  }
  const getQuantity = (data) =>{
    if (data.newPopUp) {
      let selectItem = storeItems.doc.find(list => list._id == data.itemId)
      setCartItem(selectItem!=undefined?selectItem:null)
      setCartModal(!cartModal)
    }else if(data.removePopUp) {
      setItemId(data.itemId)
      setCartRemoveModal(!cartRemoveModal)
    }
  }
  const calculateDefaultPrice = (data) =>{
    let price = Number(data.price)
    /* get and calulate none dependent price start */
      let noneDepCus = data.customize.filter(temp=>!temp.is_dependent)
      noneDepCus.map(tempCus=>{
        tempCus.variants.map(tempVar=>{
          if (tempVar.isDefault) {
            price+=Number(tempVar.price)
          }
        })
      })
    /* get and calulate none dependent price end */
    /* get and calulate dependent price start */
    let depCus = data.customize.filter(temp=>temp.is_dependent)
      depCus.map(tempCus=>{
        let dependentCustome = data.customize.find(dataCus=>dataCus._id==tempCus.dependent_with)
        let defaultSelectedVarID = dependentCustome.variants.find(defVar=>defVar.isDefault==true)
        if (defaultSelectedVarID != undefined) {
            tempCus.variants.map(tempVar=>{
              if (tempVar.isDefault) {
                let temPrice = tempVar.dependent_price.find(temp=>temp.varientId == defaultSelectedVarID._id)
                if (temPrice != undefined ) {
                  price+=Number(temPrice.price)
                }  
              }
            })
        }
      })
    /* get and calulate dependent price end */
    return price
  }

  const calculateAstimateTime = async () =>{
    let selectedAddress = localStorage.selectAddress?JSON.parse(localStorage.selectAddress):null
    // ?area=Vidyadhar+Nagar&lat=26.963119&lng=75.790362
    
    let geoDistance = await calculateDistance(
      {
        lat : storeDetail.data.location.late,
        lng : storeDetail.data.location.lng
      },
      {
        lat : selectedAddress?selectedAddress.lat:router.query.lat||0,
        lng : selectedAddress?selectedAddress.lng:router.query.lng||0
      })
      // convert second to min
      let tempTime = Math.ceil(geoDistance.duration/60)
      if (tempTime > 0) {
        tempTime =  tempTime + Number(storeDetail.data.pre_time)
      } else {
        tempTime = 'NaN'
      }
      setAstimateTime(tempTime)
  }

  useEffect(() => {
    if(storeId!==undefined){
      Nprogress.start()
      dispatch(getStoreDetail({storeId}))
      dispatch(storeRatingList({storeId}))
    }
  }, [storeId])

  useEffect(() => {
    if (!storeDetail.isLoading && storeDetail.data) {
      /* set banner image start */
        let mainImg = storeDetail.data.store_image.find(data=>{
          return data._id== 'main'
        })
        if (mainImg !== undefined) {
          bannerImage.main = mainImg.image 
        }
        let otherImage = storeDetail.data.store_image.find(data=>{
          return data._id== 'other'
        })
        if (otherImage !== undefined) {
          bannerImage.other = otherImage.image
        }
        setBannerImage({...bannerImage})
      /* set banner image end */
      /* set timing start */
        if (storeDetail.data.timing && 'time_data' in storeDetail.data.timing) {
          storeTiming.open =  storeDetail.data.timing.time_data.open!= ''?storeDetail.data.timing.time_data.open:'0.00'
          storeTiming.close = storeDetail.data.timing.time_data.close!=''?storeDetail.data.timing.time_data.close:'0.00'
          setStoreTiming({...storeTiming})
        }
      /* set timing end */
      /* calculate delevery time start */
        calculateAstimateTime()
      /* calculate delevery time end */
      Nprogress.done()
    }
  }, [storeDetail])

  return (        
      <>
        <section className={`${styles.detailBanner}`}>
          <Container fluid={true} className="p-0">
            <Row className="m-0">
              <Col lg="7" className="p-0">
                <div className={`${styles.bannerImgae}`} style={{backgroundImage: `url('${bannerImage.main[0]}')`}}>
                  {
                    (
                      storeDetail.data 
                        && Object.keys(storeDetail.data.discount).length != 0 
                          && (
                              (
                                storeDetail.data.discount.discountType == 0 
                                  && storeDetail.data.discount.discountValue > 0
                              ) || (
                                storeDetail.data.discount.discountType==1 
                                  && storeDetail.data.discount.maxDiscount > 0
                              )
                            )
                    )?
                      <div className={`${styles.tableWrap}`}>
                        <div className={`${styles.alignWrap}`}>
                          {
                            storeDetail.data.discount.discountType == 0 
                              ? <span className={`${styles.offPrice}`}>
                                  <h6>{storeDetail.data.discount.discountValue}% Off</h6>
                                  {
                                    storeDetail.data.discount.maxDiscount > 0 
                                      ? <p>Off upto £{storeDetail.data.discount.maxDiscount}</p>
                                      : ""
                                  }
                                </span>
                              : <span className={`${styles.offPrice}`}>
                                  <h6>Flat £{storeDetail.data.discount.maxDiscount} Off</h6>
                                </span>
                          }
                        </div>
                      </div>
                    : ""
                  }
                </div>
              </Col>
              <Col lg="5" className="p-0">
                <Row className={`${styles.innerRow}`}>
                  {
                    [...Array(4)].map((x, i) =>
                      <Col lg="6" sm="3" key={i} className="p-0 col-3">
                        <div className={`${styles.bannerImgae}`} 
                          style={
                              {
                                backgroundImage: `url('${bannerImage.other[i] !== undefined
                                  ? bannerImage.other[i]
                                  : process.env.BASE_URL+'/images/placeholder-banner.png'}')`
                              }
                          }>
                        </div>
                      </Col>
                    )
                  }
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <section className={`${styles.listingSection}`}>
          <Container fluid={true}>
            <Row>
              <Col xl="2" lg="3" className={`${styles.sidebarCol}`}>
                <DetailsSidebar
                  filter={storeDetail.data?storeDetail.data.filter:[]}
                  getSelectedCat={getSelectedCat}
                />
              </Col>
              <Col xl="10" lg="9" className={`${styles.rightCol}`}>
                <div className={`${styles.restoInfo}`}>
                  <Row>
                    <Col sm="8">
                      <div className={`${styles.restoTitle}`}>
                        <h5>{storeDetail.data?storeDetail.data.title:''}</h5>
                        <p>{storeDetail.data?storeDetail.data.location.address:''}</p>
                        <span role="button">
                          <a onClick={hygienicToggle} className={`${styles.infoLink}`}>
                            <Image src={infoIcon}/> Info : <span className={`${styles.info}`}>
                              Hygiene rating, Allergens, Notes</span>
                          </a>
                        </span>
                      </div>
                    </Col>
                    <Col sm="4">
                      <div className={`${styles.infoRight}`}>
                        <div className={`${styles.restoRating}`}>
                          <RatingStar
                            rating={storeDetail.data?storeDetail.data.rating.avg:0} 
                          />
                          <span className={`${styles.totleRating}`}>({storeDetail.data?storeDetail.data.rating.count:0}) Reviews</span>
                        </div>
                        <div className={`${styles.btnBlock}`}>
                        <Form>
                          <FormGroup className={`${styles.btnradio}`}>
                            <Label check >              
                                <Input 
                                  type="radio" 
                                  name="radio1" 
                                  value={0}
                                  onChange={handelOrderType} 
                                  className={`${styles.checkInput}`} 
                                  defaultChecked={cart.orderType==0?true:false}
                                  // checked={ true ? true:false}
                                />
                                <span className={`${styles.radioBtn}`}>
                                  <span className={`${styles.radiotext}`}>Delivery</span>
                                </span>
                            </Label>
                            <Label check>
                                <Input 
                                  type="radio" 
                                  name="radio1" 
                                  value={1}
                                  onChange={handelOrderType} 
                                  className={`${styles.checkInput}`} 
                                  defaultChecked={cart.orderType==1?true:false}
                                  // checked={false?true:false}
                                />
                                <span className={`${styles.radioBtn}`}>
                                  <span className={`${styles.radiotext}`}>Pickup</span>
                                </span>
                            </Label>
                          </FormGroup>
                        </Form>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className={`${styles.restobottomInfo}`}>
                    <Row>
                      <Col sm="4">
                        <p>Opening Times : <span>{storeTiming.open} - {storeTiming.close}</span></p>
                      </Col>
                      <Col sm="4" className="text-md-center text-left">
                        <p>Min Order : <span>£{storeDetail.data?storeDetail.data.minimum_amount:'0'}</span></p>
                      </Col>
                      <Col sm="4" className="text-right">
                        <p>Delivery in : <span>{astimateTime} mins</span></p>
                      </Col>
                    </Row>
                  </div>
                </div>
                {/* item section start */}
                <div className={`${styles.restoMainInfo}`}>
                  <h4>{selectedCatTitle}</h4>
                  {storeItems.doc.map(list=>(
                    <div key={list._id} className={`${styles.singalItem}`}>
                        <Row className={`justify-content-between ${!list?.status ? styles.dissabledBox : ""}`}>  {/* style={{ filter: !list?.status ? "grayscale(100%)" : "" }} */}
                          <Col lg="8" sm="10" className={styles.itemcard}>
                            <div 
                              className={`${styles.imgBlock} `} 
                              style={{backgroundImage: `url('${list.image}')`}}
                            />
                            <div className={`${styles.itemInfo}`}>
                              <h6>{list.title}</h6>
                              <p>
                                {list.description}
                                {/* <Link href="#0"><a>More</a></Link> */}
                              </p>                          
                              {/* <span className={`${styles.itemPrice}`}>£{list.price}</span> */}
                              <span className={`${styles.itemPrice}`}>
                                £{list.is_customize?calculateDefaultPrice(list):list.price}
                              </span>
                              { 
                                list?.badge != 0 
                                  ? <span className={styles.itemCardBadge} style={{ background: !list?.status ? "rgb(191, 191, 191)" : badgesColor(list.badge) }}>{badgesText(list.badge)}</span> 
                                  : ""
                              }
                            </div>
                          </Col>
                          <Col lg="2" sm="2">
                            <div className={`${styles.addBtnBlock}`}>
                              { 
                                list?.status 
                                  ? cart && cart.orderItems[list._id]
                                    ? (list.is_customize)
                                      ? <QuantityBtn
                                          defvalue={cart.orderItems[list._id].itemQuantity}
                                          askCus={true}
                                          itemId={list._id}
                                          getQuantity={getQuantity}
                                        />  
                                      : <QuantityBtn
                                          defvalue={cart.orderItems[list._id].itemQuantity}
                                          grpCus={true}
                                          groupId={list._id}
                                          itemId={list._id}
                                          getQuantity={()=>{ }}
                                        />
                                    : <span role="button"><a onClick={cartToggle} item={list._id}>Add</a></span>
                                  : ""
                              }
                              {
                                list.is_customize
                                  ? <span className={`${styles.addBtnBlockSpan}`}>Customizable</span>
                                  : ""
                              }
                            </div>
                          </Col>
                        </Row>
                    </div>
                  ))}
                  {
                    storeItems.paginate.nextPage
                      ? <div className={`${styles.btnBlock}`}>
                          <span role="button" onClick={loadItems}><a className={`${styles.oxensBtn}`}>Load More</a></span>
                        </div>
                      : ''
                  }
                </div>  
                {/* item section end */}
                {/* review section start */}
                <div className={`${styles.customerReview}`}>
                  <h3>Customer Reviews <span> { storeRationg.doc ? storeRationg.doc.length : 0 } </span></h3>
                  {
                    storeRationg 
                      ? storeRationg.doc.map((list) => (
                          <>
                            <div key={list._id} className={`${styles.reviewWrap}`}>
                            <h5>
                              <RatingStar rating={list.rateType} />
                              {list.userDetail.name }
                            </h5>
                            <span className={`${styles.reviewDate}`}>{moment(list?.createdAt).format('ll')}</span>
                            <p>{list.description}</p> 
                          </div>
                          </>
                        ))  
                      : ""
                  }
                  {/* <div className={`${styles.reviewWrap}`}>
                    <h5>
                          <RatingStar
                            rating={3} 
                          />
                      Esther Howard
                    </h5>
                    <span className={`${styles.reviewDate}`}>Aug 2021</span>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the nothe1500s, to when an unknown printer took a galley of type and scrambled it to make a type. that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.</p>
                  </div> */}
                  {/* <div className={`${styles.btnBlock}`}>
                    <Link href="#0"><a className={`${styles.oxensBtn}`}>Load More</a></Link>
                  </div> */}
                  { 
                    storeRationg.paginate.next
                      ? <div className={`${styles.btnBlock}`}>
                          <span role="button" onClick={()=>loadItems("review")}><a className={`${styles.oxensBtn}`}>Load More</a></span>
                        </div>
                      : ''
                  }
                </div>  
                
                {/* review section end */}            
              </Col>
            </Row>
          </Container>
        </section>
        {/* model section start */}
          <Cart
            isOpen={cartModal}
            toggle={cartToggle}
            item={cartItem}
            storeId={storeId}
          />
          {/* item remove model */}
          <RemoveItem
            isOpen={cartRemoveModal}
            toggle={cartRemoveToggle}
            itemId={itemId}
            storeId={storeId}
          />
           <Modal isOpen={hygienicModal} toggle={hygienicToggle} className={`${styles.ModalCustomInfo}`}>
              <ModalHeader className={`${styles.modalHeader}`}>Info</ModalHeader>
              <span className={`${styles.closeButton}`} onClick={hygienicToggle}></span>
              <ModalBody className={`${styles.modalBody}`}>
                <h6>Hygiene Rating</h6>
                <p>Lorem Ipsum is simply dummy text of  printing and typesetting industry Ipsum the industry&apos;s standard dummy text ever since the when an printer took specimen book.</p>
                <span className={`${styles.ratingLink}`}>
                  <Link href="#0">
                    <a><Image src={likeIcon} alt="likeIcon" />View Hygiene Rating</a>
                  </Link>
                </span>
                <h6>Help with Allergens </h6>
                <p>Lorem Ipsum is standard dummy text ever since the when an unknown printer dummy text ever since the when an unknown printer.</p>
                <span className={`${styles.contactLink}`}> 
                  <Image src={phoneIcon} alt="phoneIcon" />Contact Restaurant 
                  <Link href="tel:441865270000" ><a href='tel:441865270000' >+44 1865 270000</a></Link> 
                </span>
                <h6>Restaurant notes</h6>
                <p>Lorem Ipsum is simply dummy text of  printing and typesetting industry Ipsum  the industry&apos;s standard dummy text ever since the when and it printer took  specimen Printing industry Lorem Ipsum Is the simple text of Typesettings book remaining essentially unchanged, It was popularised in the with and the release of Letraset sheets containing Lorem Ipsum passages, and more with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              </ModalBody>
              <ModalFooter className={`${styles.modalFooter}`}>
                <Col>
                  <Row className="align-items-center">           
                    <Col sm="12">
                      <Link href="#0"  ><a onClick={hygienicToggle} className={`${styles.themeBtn}`}>Close</a></Link>
                    </Col>
                  </Row>
                </Col>
              </ModalFooter>
           </Modal>      
        {/* model section end */}      
    </>
  )
}
Details.layout = StoreLayout
export default Details
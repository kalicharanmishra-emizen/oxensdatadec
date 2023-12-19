import Vendor from 'layouts/Vendor'
import { useEffect, useState } from "react";
import UserHeader from 'components/Headers/UserHeader';
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Input, CardHeader, Col, Container, Row, Button} from "reactstrap";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import nProgress from "nprogress";
import DetailsSidebar from '../../components/posts/details-sidebar';
import { getStoreDetail,setFilterStoreItems} from '../../reducers/storeSlice'
import  "../../styles/store-detail.css";
import { badgesColor, badgesText } from '../../Helper/helper';
import { getAllOrderCharge, manageCartData, placeOrder } from '../../reducers/mainSlice'
import QuantityBtn from '../../components/quantityBtn';
import Cart from '../../components/Model/Cart';
import RemoveItem from '../../components/Model/RemoveItem';
import PosUserComponent from "../../components/searchPOSuser/posUserComponent"

const index = () => {
  const dispatch = useDispatch()

  const storeItems = useSelector(state => state.storeSlice.storeItems)
  const storeDetail = useSelector(state => state.storeSlice.storeDetail)
  const cart = useSelector(state => state.mainSlice.cart)
  const allCharges = useSelector(state => state.mainSlice.charge)
  const apiFail = useSelector(state=>state.mainSlice.failed)
  const apiSuccess = useSelector(state=>state.mainSlice.success)

  const [transectionIdPOS, setTransectionIdPOS] = useState(null)
  const [transectionIdError, setTransectionIdError] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [selectUser, setSelectUser] = useState(null)
  const [tip, setTip] = useState(0)
  const [itemId, setItemId] = useState(null);
  const [cartItem, setCartItem] = useState(null);
  const [cartModal, setCartModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [cartRemoveModal, setCartRemoveModal] = useState(false);
  const [selectedCatTitle, setSelectedCatTitle] = useState('');
  const [paymentMode, setPaymentMode] = useState(0) // 0 => COD, 1 => wallet, 2 => other
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

  const [charge, setCharge] = useState({
    subTotal:0.00,
    discount:0.00,
    taxCharge:0.00,
    grandTotal:0.00
  })

  // start cart function =========

    const addItemToCart = (item) => {
      let cart = localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):{
          orderItems:{},
          storeId:storeDetail?.data?._id,
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
            cart.storeId = storeDetail?.data?._id
          }
          cart.totalQuantity+=1
          cart.totalAmount+=itemPrice
          localStorage.setItem('cart',JSON.stringify(cart))
          dispatch(manageCartData())
      /* set cart data to a spacific format end*/
    }

    const cartToggle = (e) => {
      let selectItem = null
      if (e !== undefined) {      
        let item = e.currentTarget.getAttribute('item')
        selectItem = storeItems.doc.find( data => data._id == item )
      }
      if (selectItem!=undefined) {
        if (cart.storeDetail?.data?._id && storeId!=cart.storeDetail?.data?._id) {
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

    const getSelectedCat = (value) => {
      let tempCat = storeDetail.data.filter.find( list => list._id == value )
      // Nprogress.start()
      dispatch(setFilterStoreItems({catId:value}))
      setSelectedCat(tempCat._id)
      setSelectedCatTitle(tempCat.title)
      console.log("template", tempCat);
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

  // end cart function =========

  // add to cart start **************

    const getCustomeTypeToString = (data) => {
      console.log("data", data)
      let returnString =''
        data.map(cus => {
          returnString += cus.title + '|'
          cus.variants.map( vare => {
              returnString += vare.title + ','
          })
        })
      return returnString
    }   
    
  // add to cart end **************

  // all charges or calculation start ============= 

    const tipChange = (e) => {
      if (e.target.value.match(/^[0-9]*$/) && e.target.value!= '') {
        setTip(e.target.value)
      }else{
        setTip(0)
      }
    }

    const submitOrder= async ()=>{
      if (true) {
        // nProgress.start()
        let orderProduct = []
        Object.keys(cart.orderItems).map(list=>{
          Object.keys(cart.orderItems[list]['selectedGroup']).map(group=>{
            /* manage customize's and varient's */
            let customize = []
            cart.orderItems[list]['selectedGroup'][group]['group'].map(cus=>{
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
              id:cart.orderItems[list].menuitem._id,
              title:cart.orderItems[list].menuitem.title,
              age_res:cart.orderItems[list].menuitem.age_res,
              customize:customize,
              quantity:cart.orderItems[list]['selectedGroup'][group].quantity,
              price:cart.orderItems[list]['selectedGroup'][group].price
            })
          })
        })

        let finalOrderSumery = {
          userId:selectUser?.key,
          storeId:storeDetail ? storeDetail?.data?._id : "",
          paymentMode:paymentMode ? paymentMode : 0,
          deliveryAddress:storeDetail ? storeDetail?.data?.location : {},
          pickupData:[],
          type:1,
          orderType:1,
          totalQuantity:cart.totalQuantity,
          totalMrp:cart.totalAmount,
          servicePrice:0.00,
          discountPrice:charge.discount,
          deliveryPrice:0.00,
          totalPrice:charge.grandTotal - tip,
          taxCharge:charge.taxCharge,
          tip:tip ? tip : 0,
          comment:"",
          product:orderProduct,
          paymentStatus:1,
          status:1,
          transectionIdPOS:transectionIdPOS
        }
        setIsReset(true)
        setTransectionIdPOS("")
        setPaymentMode(0)
        dispatch(placeOrder(finalOrderSumery))
        console.log("finalOrderSumery obj", finalOrderSumery);
      }
    }

    const calculateCharges = () => {
      let tempTaxCharge = 0.00;
      let tempServiceCharge = 0.00;
      let tempDiscountCharge = 0.00;
      if (Object.keys(cart.orderItems).length==0 && localStorage.getItem('cart') && Object.keys(JSON.parse(localStorage.getItem('cart')).orderItems).length!=0 ) {
          dispatch(manageCartData())
      }
      if(cart.storeId && storeDetail.isLoading){
        dispatch(getStoreDetail({storeId:cart.storeId}))
      }
      if (Object.keys(charge).length!=0) {
        // celculate service charge
        tempServiceCharge = (cart.totalAmount * allCharges.serviceFee)/100
        if (tempServiceCharge > allCharges.maxServiceFee) {
          tempServiceCharge = allCharges.maxServiceFee
        } 
        // calculate tax
        // if (allCharges.taxPay != 0) {
        //   tempTaxCharge = (cart.totalAmount * allCharges.taxPay)/100
        // }

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
            tempDiscountCharge = (cart.totalAmount * storeDetail.data.discount.discountValue)/100
            if (storeDetail.data.discount.maxDiscount > 0 && tempDiscountCharge > storeDetail.data.discount.maxDiscount) {
              tempDiscountCharge = storeDetail.data.discount.maxDiscount
            }  
          }
        }
      }
     
      setCharge({
        grandTotal:Number(( ( cart.totalAmount + Number(tip) + tempTaxCharge ) - tempDiscountCharge).toFixed(2) ),  //remove tex charges after number(tip)  + tempTaxCharge
        discount:Number(tempDiscountCharge.toFixed(2)),
        // serviceCharge:tempServiceCharge.toFixed(2),
        taxCharge:Number(tempTaxCharge.toFixed(2)),
        subTotal:Number((cart.totalAmount).toFixed(2))
      })  
    }

    const clearCartData = (e) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't to Delete this order!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          let cart = {
            orderItems:{},
            orderType:0,
            storeId:null,
            totalQuantity:0,
            totalAmount:0.00
          }
          localStorage.setItem('cart',JSON.stringify(cart))
          dispatch(manageCartData())
          setTransectionIdPOS("")
          setPaymentMode(0)
          setIsReset(true)
        }
      })
    }
   
    const confirmOrder = () => {
        if (selectUser === null) {
          Swal.fire('Please select user')
        }else if((paymentMode === 1 || paymentMode === 2) && !transectionIdPOS){
          setTransectionIdError(true)
        }else{
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't to complete this Order!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, confirmed Order!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Submit!',
                'Your Order has been submited.',
                'success'
              ).then((result) => {
                if (result) {
                  submitOrder()
                }
              })
            }
          })
        }
    }

    const handelPOSUser = (data) => {
      setSelectUser(data)
    }

    const handelisReset = (data) => {
      setIsReset(false)
    }

  // all charges or calculation end ============= 

  //  effects start *****************

      useEffect(() => {
          dispatch(getAllOrderCharge())
          dispatch(getStoreDetail())
      }, [])
  
      // add to cart effect 
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
          nProgress.done()
        }
      }, [storeDetail])

      // selected product price calulation
      useEffect(() => {
        calculateCharges()
      }, [tip,cart,storeItems])

      // after submit order clear page 
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
            dispatch(unSetApiSucc())
            let cart = {
              orderItems:{},
              orderType:0,
              storeId:null,
              totalQuantity:0,
              totalAmount:0.00
            }
            localStorage.setItem('cart',JSON.stringify(cart))
            dispatch(manageCartData())
          }
        }
      }, [apiFail,apiSuccess]);

  //  effects end *****************
  return (
    <>
        <UserHeader/>
        <Container className="mt--7" fluid>
          <Row>
              <Col className="order-xl-1" xl='12' lg="12" sm="12">
                  <Card className="bg-secondary shadow">
                      <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                            <Col xs="8">
                              <h3 className="mb-0">POS</h3>
                            </Col>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        {
                           storeDetail?.data?.assignPOS === 1 
                           ? <>
                            <Row>
                              <Col xl="12">
                                <h4>Select Category</h4>
                                <DetailsSidebar
                                  filter={storeDetail.data?storeDetail.data.filter:[]}
                                  getSelectedCat={getSelectedCat}
                                />   
                              </Col>
                            </Row>
                            <Row className="mt-5">
                              <Col xl="8" lg="12" md="12" sm="12" className='mb-3'>
                                <div className='storeCards'>
                                    {storeItems.doc.map( (list) => (
                                      <div key={list._id} className={`itemStoreCard ${ list?.status === false ? "dissabledStoritem" : ""}`}>
                                          <div className={`imageBlock`} 
                                            style={{backgroundImage: `url('${list.image}')`,width:"100%", height:"118px",backgroundRepeat:"no-repeat", backgroundSize:"cover"}}>
                                          </div>
                                          <div className={`itemInfo`}></div>
                                          <h6 style={{fontSize:"14px"}}>{ list.title  }</h6>
                                          <span className={`itemPrice`}>
                                            £{list.is_customize?calculateDefaultPrice(list):list.price}
                                          </span>
                                          <br/>
                                          { 
                                            list?.badge != 0 
                                              ? <span className="itemCardBadge" 
                                                      style={
                                                        { 
                                                          background: !list?.status 
                                                            ? "rgb(191, 191, 191)" 
                                                            : badgesColor(list.badge) 
                                                        }
                                                      }>
                                                    { badgesText( list.badge ) }
                                                  </span> 
                                              : ""
                                          }

                                          {/* <Col lg="2" sm="2"> */}
                                            <div className={`addTocartBtnBlock`}>
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
                                                    : <div role="button" onClick={cartToggle} item={list._id}><a  >Add</a></div>
                                                  : ""
                                              }
                                              {/* {
                                                list.is_customize
                                                  ? <span className={`addBtnBlockSpan`}>Customizable</span>
                                                  : ""
                                              } */}
                                            </div>
                                          {/* </Col> */}
                                      </div>
                                    ))}
                                </div>
                              </Col>
                              <Col xl="4" lg="12" md="12" sm="12" className='leftcarCalculationtBox'>
                                  <div className='topUserManageBox'>
                                    <span className='selectUserBtn'>
                                      <PosUserComponent
                                        handelPOSUser={handelPOSUser}
                                        isReset={isReset}
                                        handelisReset={handelisReset}
                                      />
                                    </span>
                                  </div>
                                  { 
                                    Object.keys(cart.orderItems).length > 0 
                                      ? 
                                        <div className="cartBlock">
                                            {
                                              Object.keys(cart.orderItems).map( list => ( 
                                                Object.keys(cart.orderItems[list].selectedGroup).map( group => (
                                                    <div className="cartbody" key={group}>
                                                        <div className="cartImg">
                                                            <img src={cart.orderItems[list].menuitem.image} alt="Cart" />
                                                        </div>
                                                        <div className="cartContent">
                                                          <div className='titlePriceBox'>
                                                            <p className='cartItemname'>{cart.orderItems[list].menuitem.title}</p>
                                                            <span className="cartItemPrice">£{cart.orderItems[list].selectedGroup[group].price}</span>  
                                                          </div>
                                                            <span style={{fontSize:"12px"}}>{getCustomeTypeToString(cart.orderItems[list].selectedGroup[group].group)} </span>
                                                            <div className="AddToCartBtn">
                                                                <QuantityBtn
                                                                    defvalue={cart.orderItems[list].selectedGroup[group].quantity}
                                                                    grpCus={true}
                                                                    groupId={group}
                                                                    itemId={list}
                                                                    getQuantity={()=>{ }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                              ))
                                            }
                                        </div>
                                      : ""
                                    }

                                  <div className={`subtotal`}>
                                    <div className='valculationBox'>
                                      <ul>
                                        <li>
                                          <span>
                                              Subtotal
                                          </span> 
                                          <span> 
                                            £ {charge.subTotal}
                                          </span>
                                        </li>
                                        <li>
                                          <span>
                                            Discount
                                          </span> 
                                          <span>
                                            £ {charge?.discount}
                                          </span>
                                        </li>
                                        {/* <li>
                                          <span>
                                              Tax and Charges
                                          </span> 
                                          <span>
                                            £ {charge?.taxCharge}
                                          </span>
                                        </li> */}
                                      </ul>
                                    </div>

                                    <div className='finalAmountBox'>
                                        <span>
                                            Grand Total  
                                        </span> 
                                        <span>
                                          £ {charge.grandTotal}
                                        </span>
                                    </div>

                                    {/* payment mode  */}
                                    <section className='containerBox'>
                                      <div className='selector'>
                                        <div className='selecotr-item'>
                                          <Input 
                                            type="radio" 
                                            id="huey" 
                                            name="drone" 
                                            value="0"
                                            checked={paymentMode === 0}
                                            onChange={(e) => setPaymentMode(0)} 
                                            className="selector-item_radio"
                                          /> 
                                          <label for="huey" className='selector-item_label'>Cash</label>
                                        </div>
                                        <div className='selecotr-item'>
                                          <Input 
                                            type="radio" 
                                            id="dewey" 
                                            name="drone" 
                                            value="1"
                                            checked={paymentMode === 1}
                                            onChange={(e) => setPaymentMode(1)} 
                                            className="selector-item_radio"
                                          /> 
                                          <label for="dewey" className='selector-item_label'>Wallet</label>
                                        </div>
                                        <div className='selecotr-item'>
                                          <Input 
                                            type="radio" 
                                            id="louie" 
                                            name="drone" 
                                            value="2"
                                            checked={paymentMode === 2}
                                            onChange={(e) => setPaymentMode(2)} 
                                            className="selector-item_radio"
                                          /> 
                                          <label for="louie" className='selector-item_label'>Card</label>
                                        </div>
                                      </div>
                                    {
                                      paymentMode !== 0 
                                      ?
                                        <div>
                                          <label for="louie" className='selector-item_label'>Transection ID</label>   
                                          <Input 
                                              type="text" 
                                              id="transectionIdPOS" 
                                              name="transectionIdPOS" 
                                              value={transectionIdPOS}
                                              onChange={(e) => setTransectionIdPOS(e.target.value)} 
                                              className="selector-item_radio"
                                          /> 
                                          {transectionIdError && !transectionIdPOS && <label style={{color:"red"}}>Transection ID is required</label>}
                                        </div>
                                      : ""
                                    }
                                    </section>
                                  
                                    <div className={`bottumBtnBox`}>
                                        <Button onClick={confirmOrder}
                                            disabled={Object.keys(cart.orderItems).length > 0 ? false : true}
                                            type="button"
                                            color="success"
                                            >
                                            Submit Order
                                        </Button>
                                        <Button onClick={clearCartData}
                                            disabled={Object.keys(cart.orderItems).length > 0 ? false : true}
                                            type="button"
                                            color="danger"
                                            >
                                            Clear Cart
                                        </Button>
                                    </div>
                                  </div>
                              </Col>
                            </Row>
                          </>
                           : <div style={{textAlign:"center"}} >contact to admin for POS activation</div>
                        }
                      </CardBody>
                  </Card>
              </Col>
          </Row>
        </Container>

        {/* model section start */}
          <Cart
            isOpen={cartModal}
            toggle={cartToggle}
            item={cartItem}
            storeId={storeDetail?.data?._id}
          />
          {/* item remove model */}
          <RemoveItem
            isOpen={cartRemoveModal}
            toggle={cartRemoveToggle}
            itemId={itemId}
            storeId={storeDetail?.data?._id}
          />
        {/* model section end */}      
    </>
  )
}

index.layout = Vendor
export default index  
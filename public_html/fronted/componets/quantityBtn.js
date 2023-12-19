import React, {useEffect, useState} from "react";
import Image from 'next/image'
import minus from '../public/images/minus-icon.svg';
import pluse from '../public/images/pluse-icon.svg';
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash'
import { manageCartData } from "../reducers/mainSlice";
export default function QuantityBtn(props) {
  const cartData = useSelector(state => state.mainSlice.cart)
  const dispatch = useDispatch()
    const [countValue,setCountValue]=useState(0);
    let item = cartData.orderItems[props.itemId]
    useEffect(() => {
      if(props){
        setCountValue(props.defvalue)
      }
    }, [props.defvalue])
    const getCustomeTypeToString = (data) => {
      let returnString =''
      data.map(cus=>{
          returnString+=cus.title+' | '
          cus.variants.map(vare=>{
              returnString+= vare.title+', '
          })
      })
      return returnString
    } 
    const incriment = () => {
      if ('askCus' in props && props.askCus) {
        Swal.fire({
          title: 'Repeat last used customisation',
          html:`<h4>${item.menuitem.title}</h4><p>${getCustomeTypeToString(item.latestGroup)}</p>`,
          showCancelButton: false,
          showDenyButton: true,
          denyButtonText:'Repeat Last',
          confirmButtonText: 'Add New',
          scrollbarPadding:false,
          customClass:{
            actions:'cartConfirmAction',
            confirmButton: 'cartAddNewBtn',
            denyButton: 'cartRepeatLastBtn',
            htmlContainer:'cartHtmlContainer',
            title:"cartConfirnHeader"
          }
        }).then((result) => {
          /* Confirm button is use for add new Varient's */
          if (result.isConfirmed) {
              props.getQuantity({
                newPopUp:true,
                itemId:props.itemId
              })
          }
          /* Deny button is use for repeat last Varient */
          if (result.isDenied) {
            let cartData = JSON.parse(localStorage.getItem('cart'))
            let selectedGroupkey = Object.keys(cartData.orderItems[props.itemId].selectedGroup).find(tempList=>{
             return _.isEqual(cartData.orderItems[props.itemId].selectedGroup[tempList].group,cartData.orderItems[props.itemId].latestGroup) 
            })
            let lastGroupPrice = Number(cartData.orderItems[props.itemId].menuitem.price);
            cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].group.map(itPrice=>{
              itPrice.variants.map(temp=>{
                lastGroupPrice+=Number(temp.price);
              })
            })
            cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].quantity+=1 
            cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].price+=lastGroupPrice
            cartData.orderItems[props.itemId].itemQuantity+=1
            cartData.orderItems[props.itemId].itemPrice+=lastGroupPrice
            cartData.totalQuantity+=1
            cartData.totalAmount+=lastGroupPrice
            localStorage.setItem('cart',JSON.stringify(cartData))
            dispatch(manageCartData())
          }
        })
      } else if('grpCus' in props && props.grpCus){
        let selectedGroupkey = props.groupId
        let cartData = JSON.parse(localStorage.getItem('cart'))
        let lastGroupPrice = Number(cartData.orderItems[props.itemId].menuitem.price);
        cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].group.map(itPrice=>{
          itPrice.variants.map(temp=>{
            lastGroupPrice+=Number(temp.price);
          })
        })
        cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].quantity+=1 
        cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].price+=lastGroupPrice
        cartData.orderItems[props.itemId].itemQuantity+=1
        cartData.orderItems[props.itemId].itemPrice+=lastGroupPrice
        cartData.totalQuantity+=1
        cartData.totalAmount+=lastGroupPrice
        localStorage.setItem('cart',JSON.stringify(cartData))
        dispatch(manageCartData())
      } else{
        if (countValue < 99) {
          setCountValue(countValue+1);    
        } 
      }
    }
    const decriment = () => {
      if ('askCus' in props && props.askCus) {
        if (Object.keys(item.selectedGroup).length==1) {
          let selectedGroupkey = Object.keys(item.selectedGroup)[0]
          let cartData = JSON.parse(localStorage.getItem('cart'))
          let lastGroupPrice = Number(cartData.orderItems[props.itemId].menuitem.price);
          cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].group.map(itPrice=>{
            itPrice.variants.map(temp=>{
              lastGroupPrice+=Number(temp.price);
            })
          })
          cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].quantity-=1 
          cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].price-=lastGroupPrice
          cartData.orderItems[props.itemId].itemQuantity-=1
          cartData.orderItems[props.itemId].itemPrice-=lastGroupPrice
          /* remove Item Group if group quantity hit 0 */
          if (cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].price < 0 || cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].quantity == 0) {
            delete cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey]
          } 
          /* remove Item if item quantity hit 0 */
          if (cartData.orderItems[props.itemId].itemPrice < 0 || cartData.orderItems[props.itemId].itemQuantity == 0) {
            delete cartData.orderItems[props.itemId]
          }
          cartData.totalQuantity-=1
          cartData.totalAmount-=lastGroupPrice
          if(cartData.totalAmount < 0){
            cartData.totalAmount=0
          }
          if (cartData.totalQuantity == 0) {
            cartData.storeId=null
          }
          localStorage.setItem('cart',JSON.stringify(cartData))
          dispatch(manageCartData())
        }else{
          props.getQuantity({
            removePopUp:true,
            itemId:props.itemId
          })
        }
      } else if('grpCus' in props && props.grpCus){
        let selectedGroupkey = props.groupId
        let cartData = JSON.parse(localStorage.getItem('cart'))
        let lastGroupPrice = Number(cartData.orderItems[props.itemId].menuitem.price);
        cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].group.map(itPrice=>{
          itPrice.variants.map(temp=>{
            lastGroupPrice+=Number(temp.price);
          })
        })
        cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].quantity-=1 
        cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].price-=lastGroupPrice
        cartData.orderItems[props.itemId].itemQuantity-=1
        cartData.orderItems[props.itemId].itemPrice-=lastGroupPrice
        /* remove Item Group if group quantity hit 0 */
        if (cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].price < 0 || cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey].quantity == 0) {
          delete cartData.orderItems[props.itemId].selectedGroup[selectedGroupkey]
        } 
        /* remove Item if item quantity hit 0 */
        if (cartData.orderItems[props.itemId].itemPrice < 0 || cartData.orderItems[props.itemId].itemQuantity == 0) {
          delete cartData.orderItems[props.itemId]
        }
        cartData.totalQuantity-=1
        cartData.totalAmount-=lastGroupPrice
        if(cartData.totalAmount < 0){
          cartData.totalAmount=0
        }
        if (cartData.totalQuantity == 0) {
          cartData.storeId=null
        }
        localStorage.setItem('cart',JSON.stringify(cartData))
        dispatch(manageCartData())
      } else {
        let minValue=0
        if ('minValue' in props) {
          minValue = props.minValue
        }
        if (countValue > minValue) {
          setCountValue(countValue-1);    
        } 
      }
      
    }
    useEffect(() => {
      props.getQuantity(countValue)
    }, [countValue])
    return (  
      <>     
        <div className="QuantityBlock">
          <span className="minus" onClick={decriment}><Image src={minus} alt="Minus" /></span>
          <span className="countAll">{countValue}</span>
          <span className="pluse" onClick={incriment}><Image src={pluse} alt="Pluse" /></span>
        </div> 
      </>
    )
}

import React, { useEffect, useState } from 'react'
import styles from '../../styles/cart.module.css'
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap'
import Link from 'next/link'
import QuantityBtn from '../quantityBtn'
import _ from "lodash";
import { manageCartData } from '../../reducers/mainSlice'
import { useDispatch } from 'react-redux'
export default function Cart(props) {
    const dispatch = useDispatch()
    const [variant, setVariant] = useState({})
    const [item, setItem] = useState(null)
    const [itemPrice, setItemPrice] = useState(0.00)
    const [quantity, setQuantity] = useState(1)
    const [tempChildData, setTempChildData] = useState({})
    const getQuantity = (data) => {
        setQuantity(data)
    }
    const resetChildDep = (data) =>{
        // console.log('data',data);
        let tempChild={}
        if (Object.keys(data).length!=0) {
            Object.keys(data).map(childDep=>{
                let selectedInput = document.querySelector(`input[name="${childDep}"]:checked`)
                let selValue = selectedInput?selectedInput.value:''
                data[childDep].childCus.map(tempCus=>{
                    let childCus = props.item.customize.filter(dataCus=>dataCus.dependent_with==tempCus._id);
                        if (childCus.length!=0) {
                            tempChild[tempCus._id] = {
                                childCus:childCus,
                                data:data,
                            }
                        }
                    let varListRow = []
                    tempCus.variants.map(varList=>{
                        let price = varList.dependent_price.find(raw=>raw.varientId==selValue);
                        if (price!==undefined) {
                            varListRow.push({
                                _id:varList._id,
                                title: varList.title,
                                price: price,
                                isDefault: varList.isDefault,
                            })  
                        }
                    })
                    variant[childDep][tempCus._id] = varListRow
                })
            })
            setVariant({...variant})
            setTempChildData(tempChild) 
        }
    }
    const handelChange =  (e) => {
        let cusId = e.currentTarget.name
        let type = e.currentTarget.type
        let tempChild={}
        if (type=='radio') {
            let depCus = props.item.customize.filter(dataCus=>dataCus.dependent_with==cusId)
            if (depCus.length!=0) {
                depCus.map(data=>{
                    let childCus = props.item.customize.filter(dataCus=>dataCus.dependent_with==data._id);
                    if (childCus.length!=0) {
                        // console.log(data.title,' childCus',childCus);
                        tempChild[data._id] = {
                            childCus:childCus,
                            data:data,
                        }
                    }
                    let varListRow=[]
                    data.variants.map(varList=>{
                        let price = varList.dependent_price.find(raw=>raw.varientId==e.currentTarget.value);
                        if (price!==undefined) {
                            varListRow.push({
                                _id:varList._id,
                                title: varList.title,
                                price: price,
                                isDefault: varList.isDefault,
                            })  
                        }
                    })
                    variant[cusId][data._id] = varListRow;
                })
                setVariant({...variant}) 
                setTempChildData(tempChild)
            }
        }
        calculatePrice()
    }

    const calculatePrice = () => {
        let tempPrice = Number(item.price);
        item.customize.map(data => { 
            let inputs = document.querySelectorAll(`input[name="${data._id}"]`)
            for (const input of inputs) {
                if (input.checked) {
                    tempPrice += Number(input.getAttribute('price'))
                }
            }
        })
        // console.log('tempPrice',tempPrice);
        setItemPrice(tempPrice * quantity)
    }
    useEffect(() => {
        if (props.item) {
            setTempChildData({})
            let depCustom = props.item.customize.filter(list=>list.is_dependent)
            let depVarObj = {}
            depCustom.map(data=>{
                let dWithId = data['dependent_with'];
                let varListRow=[]
                let dependentCustome = props.item.customize.find(dataCus=>dataCus._id==data.dependent_with)
                let defaultSelectedVarID = dependentCustome.variants.find(defVar=>defVar.isDefault==true)      
                if (defaultSelectedVarID!==undefined) {
                    data.variants.map(varList=>{
                        let price = varList.dependent_price.find(raw=>raw.varientId==defaultSelectedVarID._id); 
                        if (price!==undefined) {
                            varListRow.push({
                                _id:varList._id,
                                title: varList.title,
                                price: price,
                                isDefault: varList.isDefault,
                            })    
                        }
                    })  
                }
                if(!variant.hasOwnProperty(dWithId)){
                    depVarObj ={}
                    depVarObj[data['_id']] =  varListRow;
                } else {
                    depVarObj = variant[dWithId];
                    depVarObj[data['_id']] =  varListRow;
                }
                variant[dWithId] = depVarObj
            })
            setVariant({...variant})
        }
        setItem(props.item)
    }, [props.item])
    useEffect(() => {
        if(item){
            calculatePrice()
            // console.log('tempChildData',tempChildData);
            if (Object.keys(tempChildData).length!=0)
                resetChildDep(tempChildData)
        }
    }, [variant,quantity])
    
    const addItemToCart = () => {
        let cart = localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):{
            orderItems:{},
            storeId:props.storeId,
            totalQuantity:0,
            totalAmount:0.00,
            orderType:0
        }
        let latestGroup = cart.orderItems[item._id]?cart.orderItems[item._id].latestGroup : []
        let selectedGroup = cart.orderItems[item._id]?cart.orderItems[item._id].selectedGroup : {}
        /* find all checked input and group tham start*/
            let checkedInputs={}
            item.customize.map(data => {
                let groupCheckInput = []
                let inputs = document.querySelectorAll(`input[name="${data._id}"]`)
                for (const input of inputs) {
                if (input.checked)
                groupCheckInput.push(input)
                }
                checkedInputs[data._id]=groupCheckInput
            })
        /* find all checked input and group tham End*/
        /* Find and create a selected group start */
            let selectedGroupRaw=[]
            let groupKey=item._id+"_"
            Object.keys(checkedInputs).map(inputs=>{
                groupKey+=inputs.slice(inputs.length - 6)
                let selectedCustom = item.customize.find(cus=> cus._id == inputs)
                let varListRow=[]
                checkedInputs[inputs].map(input=>{
                    let tempVar = selectedCustom.variants.find(list => list._id == input.value)
                    groupKey+='_'+tempVar._id.slice(tempVar._id.length-6)
                    varListRow.push({
                        _id:tempVar._id,
                        title: tempVar.title,
                        price: input.getAttribute('price'),
                    })
                })
                if (varListRow.length!=0) {
                    selectedGroupRaw.push(
                        {
                            _id: selectedCustom._id,
                            title: selectedCustom.title,
                            is_multiple: selectedCustom.is_multiple,
                            variants:varListRow
                        }
                    ) 
                }
            })
            selectedGroup[groupKey]={
                group:selectedGroupRaw,
                quantity:selectedGroup[groupKey]?selectedGroup[groupKey].quantity+quantity:quantity,
                price:selectedGroup[groupKey]?selectedGroup[groupKey].price+itemPrice:itemPrice
            }
            latestGroup=selectedGroupRaw
        /* Find and create a selected group end */
        /* set cart data to a spacific format start*/   
            cart.orderItems[item._id]= {
                menuitem:item,
                selectedGroup:selectedGroup,
                latestGroup:latestGroup,
                itemQuantity:cart.orderItems[item._id]?cart.orderItems[item._id].itemQuantity+quantity:quantity,
                itemPrice:cart.orderItems[item._id]?cart.orderItems[item._id].itemPrice+itemPrice:itemPrice

            }
            if (!cart.storeId) {
                cart.storeId = props.storeId
            }
            cart.totalQuantity+=quantity
            cart.totalAmount+=itemPrice
            localStorage.setItem('cart',JSON.stringify(cart))
            dispatch(manageCartData())
            props.toggle()
        /* set cart data to a spacific format end*/
    }
    return (
        <>
            <Modal isOpen={props.isOpen} className={`${styles.ModalCustom} modal-dialog-scrollable`}>
                <ModalHeader className={`${styles.modalHeader}`}>
                    {item?item.title:''}
                    <span>{item?item.description:''}</span>
                    <span>£{item?item.price:''}</span>
                    <span className={`${styles.closeButton}`} onClick={props.toggle}></span>
                </ModalHeader>
                <ModalBody>
                    {item && item.customize?item.customize.map(cusList=>(
                        cusList.is_dependent?
                            Object.keys(variant).length!=0 && variant[cusList.dependent_with][cusList._id].length!=0?
                            <div id={cusList._id} key={cusList._id}>
                            <span className={`${styles.titleOptional}`}>{cusList.title}</span>
                                <Form id={`var_${cusList._id}`}>
                                    {variant[cusList.dependent_with][cusList._id].map(varList=>(
                                        <FormGroup key={varList._id}>
                                            <Label>
                                            <Input 
                                                name={cusList._id} 
                                                value={varList._id}
                                                price={varList.price.price}
                                                type={cusList.is_multiple?"checkbox":"radio"} className={`${styles.checkInput}`} 
                                                onChange={handelChange} 
                                                defaultChecked={varList.isDefault?true:false} 
                                            />
                                            <span className={`${cusList.is_multiple?styles.checkmark:styles.radio}`}></span>
                                            <span className={`${styles.checktext}`}>{varList.title}</span>
                                            </Label>
                                            <span className={`${styles.customizePrice}`}>£{varList.price.price}</span>
                                        </FormGroup>
                                    ))}
                                </Form>
                            </div>
                            :''   
                        :
                            cusList.variants && cusList.variants.length!=0?
                                <div id={cusList._id} key={cusList._id}>
                                <span className={`${styles.titleOptional}`}>{cusList.title}</span>
                                <Form id={`var_${cusList._id}`}>
                                {cusList.variants.map(varList=>(
                                    <FormGroup key={varList._id}>
                                        <Label>
                                        <Input 
                                            name={cusList._id} 
                                            value={varList._id} 
                                            price={varList.price}
                                            type={cusList.is_multiple?"checkbox":"radio"} className={`${styles.checkInput}`} 
                                            onChange={handelChange} 
                                            defaultChecked={varList.isDefault?true:false} 
                                        />
                                        <span className={`${cusList.is_multiple?styles.checkmark:styles.radio}`}></span>
                                        <span className={`${styles.checktext}`}>{varList.title}</span>
                                        </Label>
                                        <span className={`${styles.customizePrice}`}>£{varList.price}</span>
                                    </FormGroup>
                                ))}
                            </Form>
                            </div>
                            :""
                    )):''}
                    {/* {item?calculatePrice():''} */}
                </ModalBody>
                <ModalFooter>
                    <Col>
                    <Row className="align-items-center">
                        <Col md="3" className="col-3">
                        <QuantityBtn
                            defvalue={1}
                            minValue={1}
                            getQuantity={getQuantity}
                        />
                        </Col>
                        <Col md="9" className="col-9">
                        <span role="button" onClick={addItemToCart}><a className={`${styles.themeBtn}`}>Add to Cart - <span>£{itemPrice}</span></a></span>
                        </Col>
                    </Row>
                    </Col>
                </ModalFooter>
            </Modal>
        </>
    )
}

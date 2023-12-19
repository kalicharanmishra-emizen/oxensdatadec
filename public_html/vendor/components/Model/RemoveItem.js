import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import QuantityBtn from '../quantityBtn';

export default function RemoveItem(props) {
    const cartData = useSelector(state => state.mainSlice.cart)
    let item = null
    item = cartData.orderItems[props.itemId]
    useEffect(() => {
        if (props.isOpen) {
            document.body.classList.add('itemRemoveModel')
        }else{
            document.body.classList.remove('itemRemoveModel')
        }
    }, [props])
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
    return (
        <div>
            <Modal isOpen={props.isOpen} className="modal-dialog-centered cartRemoveItem" >
            <div className="ModalCustom">
                <ModalHeader className="modalHeader">
                    <span>Remove your items</span>
                    <span className="closeButton" onClick={props.toggle}></span>
                </ModalHeader>
                <ModalBody className="modalBody">
                    <ul className="cart-item-list">
                        {
                            item?
                            Object.keys(item.selectedGroup).map(group=>(
                                <li key={group}>
                                    <div className="cartInfo">
                                        <div className="cartContent">
                                            <div className="left">
                                                <div className="cartContentInner">
                                                    <h6>{item.menuitem.title}</h6>
                                                    <span>{getCustomeTypeToString(item.selectedGroup[group].group)} </span>
                                                </div>
                                            </div>
                                            <div className="right">
                                                <div className="AddCart">
                                                    <span className="cartPrice">£{item.selectedGroup[group].price}</span>
                                                </div>
                                                <QuantityBtn
                                                    defvalue={item.selectedGroup[group].quantity}
                                                    grpCus={true}
                                                    groupId={group}
                                                    itemId={props.itemId}
                                                    getQuantity={() => {}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                            :''
                        }
                    </ul>
                </ModalBody>
                </div>
            </Modal>
        </div>
    )
}

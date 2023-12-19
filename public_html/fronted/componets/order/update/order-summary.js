import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap'
import React, {useEffect, useState} from "react";
import Image from 'next/image';
import Link from 'next/link';
import styles from "../../styles/payment-details.module.css";
import about from '../../public/images/about.svg';
import successfull from '../../public/images/successfull-icon.svg';
import { useSelector } from 'react-redux';



export default function OrderSummary() {
  const [modal, setModal] = useState(false);
  const cartData = useSelector(state => state.mainSlice.cart)
  const [grandTotal, setGrandTotal] = useState()
  const [tip, setTip] = useState(0)
  useEffect(() => {
    setGrandTotal(cartData.totalAmount+Number(tip))
  }, [tip,cartData])
  const tipChange = (e) => {
    if (e.target.value.match(/^[0-9]*$/) && e.target.value!= '') {
      setTip(e.target.value)
    }else{
      setTip(0)
    }
  }
  
  const toggle = () => setModal(!modal);
  return (
    <>
    <div className={`${styles.delivery}`}>
      <div className={`${styles.deliveryInfo}`}>
        <h6>{cartData.totalQuantity} Items in your Bag <span>Delivery</span></h6>
      </div>
      <div className={`${styles.subtotal}`}>
        <ul>
          <li>Subtotal <span>£{cartData.totalAmount}</span></li>
          <li>Discount on MRP <span className={`${styles.mrp}`}>-£0.00</span></li>
          {/* <li><strong>order fee</strong> <Image src={about} alt="about"/> <span>£5.50</span></li>
          <li>Delivery charges <span>£2</span></li>
          <li><strong className={`${styles.serviceFree}`}>Service Fee</strong> <Image src={about} alt="about"/> <span>£5.50</span></li>
          <li>Tax and Charges <span>£4.99</span></li> */}
          <li>Tip <span className={`${styles.tip}`}><span className={`${styles.currency}`}>&#163;</span><Input type="text" className={`${styles.formCantrol}`} placeholder="" onChange={tipChange} /> </span></li>
        </ul>
        <div className={`${styles.request}`}>
          <Input type="search" className={`${styles.formCantrol}`} placeholder="Any request for your food (optional)" /> 
        </div>
        <div className={`${styles.totalInfo}`}>
          <h4>Grand Total <span>£{grandTotal}</span></h4>
        </div>
        <div className={`${styles.btnBlock}`}>
          <Link href="#"><a onClick={toggle}>Continue to Pay</a></Link>
        </div>
      </div>
    </div>
    <Modal isOpen={modal} toggle={toggle} className={`${styles.ModalPayment}`}>
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
              <Link href="#" ><a className={`${styles.themeBtn}`}>Explore More</a></Link>
            </Col>
          </Row>
        </Col>
      </ModalFooter>
    </Modal>
    </>
  )
}

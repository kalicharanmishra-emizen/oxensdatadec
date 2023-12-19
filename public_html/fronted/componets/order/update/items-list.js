import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input} from 'reactstrap'
import React, {useEffect, useState} from "react";
import Image from 'next/image';
import Link from 'next/link';
import QuantityBtn from '../quantityBtn';
import styles from "../../styles/payment-details.module.css";
import paneer from '../../public/images/paneer.png';
import info from '../../public/images/info18+.svg';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';


export default function ItemsList() {
    const router = useRouter()
    const cartData = useSelector(state => state.mainSlice.cart)
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [modal1, setModal1] = useState(false);
    const Customizable = () => setModal1(!modal1);
    const getCustomeTypeToString = (data) => {
        let returnString =''
        data.map(cus=>{
            returnString+=cus.title+' : '
            cus.variants.map(vare=>{
                returnString+= vare.title+' , '
            })
            returnString+=' | '
        })
        return returnString
    }
    useEffect(() => {
      let cart = localStorage.getItem('cart')
      if (!(cart!=null && Object.keys(JSON.parse(cart).orderItems).length!=0 )) {
        router.push('/store')
      }
    }, [])
  return (
    <>
      <div className={`${styles.orderSpace}`}>
      {Object.keys(cartData.orderItems).map(list=>(
        Object.keys(cartData.orderItems[list].selectedGroup).map(group=>(
          <div className={`${styles.singleOrder}`} key={group}>
            <Row>
              <Col sm="8" className="col-8">
                <div className={`${styles.orderInfo}`}>
                  <div className={`${styles.imgBlock}`}>
                    <img src={cartData.orderItems[list].menuitem.image} alt="paneer"/>
                  </div>
                  <div className={`${styles.orderWrap}`}>
                    <h4>{cartData.orderItems[list].menuitem.title} 
                    {/* <span onClick={toggle} className={`${styles.orderSpan}`}><Image src={info} />18+</span> */}
                    </h4>
                    <p>
                      {getCustomeTypeToString(cartData.orderItems[list].selectedGroup[group].group)}
                    </p>
                  </div>
                </div>
              </Col>
              <Col sm="4" className="col-4">
                <div className={`${styles.priceDetails}`}>
                  <h6>£{cartData.orderItems[list].selectedGroup[group].price}</h6>
                  <QuantityBtn
                    defvalue={cartData.orderItems[list].selectedGroup[group].quantity}
                    grpCus={true}
                    groupId={group}
                    itemId={list}
                    getQuantity={()=>{ }}
                  />
                  {/* <p onClick={Customizable} >Customizable</p> */}
                </div>
              </Col>
            </Row>
          </div>
        ))
    ))}
        <div className={`${styles.singleOrder}`}>
          <Row>
            <Col md="12">
              <div className={`${styles.addItem}`}>
                <Link href={`/store/${cartData.storeId}`}><a>Add More Items</a></Link>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle} className={`${styles.ModalCustom}`}>
        <ModalHeader className={`${styles.modalHeader}`}>Info</ModalHeader>
        <ModalBody className={`${styles.modalBody}`}>
          <p>You mush be of 18+ age for ordering this product.</p>
          <p>Are you 18 or above?</p>
        </ModalBody>
        <ModalFooter className={`${styles.modalFooter}`}>
          <Col>
            <Row className="align-items-center">           
              <Col sm="6">
                <Link href="#" ><a className={`${styles.themeBtn}`}>Yes</a></Link>
              </Col>
              <Col sm="6">
                <Link href="#" ><a className={`${styles.themeBtn}`}>Cancel</a></Link>
              </Col>
            </Row>
          </Col>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modal1} toggle={Customizable} className={`${styles.ModalCustom}`}>
          <ModalHeader className={`${styles.modalHeader}`}>Customize “Veggie Paradise”
            <span>£10.00</span>
          </ModalHeader>
          <ModalBody>
            <span className={`${styles.titleOptional}`}>Extras <span>(optional)</span></span>
            <Form>
              <FormGroup>
                <Label>
                  <Input type="checkbox" className={`${styles.checkInput}`} />
                  <span className={`${styles.checkmark}`}></span>
                  <span className={`${styles.checktext}`}>Tomato Souce</span>
                </Label>
                <span className={`${styles.customizePrice}`}>£8.99</span>
              </FormGroup>
              <FormGroup>
                <Label>
                  <Input type="checkbox" className={`${styles.checkInput}`} />
                  <span className={`${styles.checkmark}`}></span>
                  <span className={`${styles.checktext}`}>Cheese</span>
                </Label>
                <span className={`${styles.customizePrice}`}>£8.99</span>
              </FormGroup>
              <FormGroup>
                <Label>
                  <Input type="checkbox" className={`${styles.checkInput}`} />
                  <span className={`${styles.checkmark}`}></span>
                  <span className={`${styles.checktext}`}>Olives</span>
                </Label>
                <span className={`${styles.customizePrice}`}>£8.99</span>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Col>
              <Row className="align-items-center">
                <Col md="3">
                  <QuantityBtn
                    getQuantity={()=>{ }}
                  />
                </Col>
                <Col md="9">
                  <Link href="/order-details" ><a className={`${styles.themeBtn}`}>Add to Cart - <span>£20.00</span></a></Link>
                </Col>
              </Row>
            </Col>
          </ModalFooter>
      </Modal>
    </>
  )
}

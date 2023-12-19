import React, { useEffect, useState } from 'react'
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import Image from 'next/image'
import styles from "../../../styles/my-order.module.css";
import Dirver from '../../../public/images/Dirver.png';
import * as yup from 'yup'
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { callApi } from '../../../Helper/helper';


const DriverRating = (props) => {

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const dispatch = useDispatch()
    const [dirverModal, dirverPopup1] = useState(false);
    const [ratingModel, setRatingModel] = useState({});
    const validateSchema = yup.object().shape(
        {
          rateType: yup.string().required('Please select one'),
        }
    )
    const formSubmit = async (value) => {
        try {
          let res = await callApi('post','/rating/review',value)
          if (res) {
            dirverPopup1(false) 
            props.updateStatus(props.selectData?._id + "driver")
          }  
        } catch (error) {
          console.log("review form submit error", error);
          alert("error", error)
        }
    }
    useEffect(()=>{
        setRatingModel({
            type:'driver',
            storeId:"",
            orderId:props.selectData?._id ?? "",
            // driverId:props.selectData?.driverDetail?._id ?? "",
            driverId: "619cd43c60bce6eacba3a5c5",
            rateType:"",
            description:""
        })
        dirverPopup1(props.isOpen)
        setRating(null)
    },[props.isOpen])

  return (
    <Modal isOpen={dirverModal} toggle={() => props.dirverPopup1()} className={`${styles.restoReviewPopup} ${styles.dirverPopup} `}>
      <ModalHeader className={`${styles.modalHeader}`}>Rate Your Driver {props?.driverDetails?.name ?? "" }</ModalHeader>
      <span className={`${styles.closeButton}`} onClick={() => props.dirverPopup1()}></span>
      <ModalBody className={`${styles.modalBody}`}>
        <div className={`${styles.reviewPopupWrap}`}>
          <div className={`${styles.dirverImg}`}>
            <div className={`${styles.imgBlock}`}>
              <Image src={ props?.driverDetails ?  props?.driverDetails?.image :  Dirver } alt="Dirver Image" />
            </div>
          </div>
          <Formik
            enableReinitialize
            initialValues={ratingModel}
            validationSchema={validateSchema}
            onSubmit={formSubmit}
            >{(props) => (
              <Form onSubmit={props.handleSubmit}>
                  <div className="star-rating mt-4">
                    {
                      [...Array(5)].map((star, i) => {
                        const ratingValue = i + 1;
                        return (
                          <label>
                            <Input
                              type="radio"
                              name="rateType"
                              value={ratingValue}
                              onChange={props.handleChange}
                              onClick={() => setRating(ratingValue)}
                            />
                            <i onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(null)} data-star-filled={ratingValue <= (hover || rating) ? true : false}>
                            </i>
                          </label>
                        );
                      })
                    }
                  </div>
                  <FormGroup>
                      {props.touched.rateType && props.errors.rateType ? <div className="form-error">{props.errors.rateType}</div> : null}
                  </FormGroup>
                  <div className={`${styles.btnBlock}`}>
                    <Button type="submit" className={`${styles.oxensBtn}`}>Submit</Button>
                  </div>
              </Form>
            )}
          </Formik>
        </div>          
      </ModalBody>
    </Modal>
  )
}

export default DriverRating
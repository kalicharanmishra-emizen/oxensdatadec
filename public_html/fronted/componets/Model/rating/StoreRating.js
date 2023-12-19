import { Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import Image from 'next/image'
import * as yup from 'yup'
import styles from "../../../styles/my-order.module.css";
import ratingIcon1 from '../../../public/images/ratingIcon1.svg';
import ratingIcon2 from '../../../public/images/ratingIcon2.svg';
import ratingIcon3 from '../../../public/images/ratingIcon3.svg';
import ratingIcon4 from '../../../public/images/ratingIcon4.svg';
import ratingIcon5 from '../../../public/images/ratingIcon5.svg';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { callApi } from '../../../Helper/helper';

const StoreRating = (props) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [restoReview, restoReviewPopup] = useState(false);
    const [ratingModel, setRatingModel] = useState({});
    const validateSchema = yup.object().shape(
        {
          rateType: yup.string().required('Please select one'),
          description:yup.string().required('description is required'),
        }
    )
 
    const formSubmit = async (value) => {
        try {
          let res = await callApi('post','/rating/review',value)
          if (res) {
              restoReviewPopup(false) 
              props.updateStatus(props?.selectData?._id)
          }  
        } catch (error) {
          console.log("review form submit error", error);
        }
    }

    useEffect(()=>{
        setRatingModel({
            type:'order',
            storeId:props.selectData?.storeDetail?._id ?? "",
            orderId:props.selectData?._id ?? "",
            driverId:"",
            rateType:"",
            description:""
        })
        restoReviewPopup(props.isOpen)
    },[props.isOpen])

  return (
    <Modal isOpen={restoReview} toggle={()=>props.restoReviewPopup("order")} className={`${styles.restoReviewPopup}`}>
    <ModalHeader className={`${styles.modalHeader}`}>Rate Your Food</ModalHeader>
    <span className={`${styles.closeButton}`} onClick={()=>props.restoReviewPopup("order")}></span>
    <ModalBody className={`${styles.modalBody}`}>
      <div className={`${styles.reviewPopupWrap}`}>
        <Formik
          enableReinitialize
          initialValues={ratingModel}
          validationSchema={validateSchema}
          onSubmit={formSubmit}
        >{(props) => (
          <Form onSubmit={props.handleSubmit}>
            <div className={`${styles.foodRating}`}>
            <FormGroup>
              <span>
                <Input type="radio" id="star1" name="rateType" value="1" onChange={props.handleChange} />
                <Label for="star1" title="text" ><Image src={ratingIcon1} alt="rateType" /></Label>
                <span>Terrible</span>
              </span>
              <span>
                <Input type="radio" id="star2" name="rateType" value="2" onChange={props.handleChange} />
                <Label for="star2" title="text" ><Image src={ratingIcon2} alt="rateType" /></Label>
                <span>Bad</span>
              </span>
              <span>
                <Input type="radio" id="star3" name="rateType" value="3" onChange={props.handleChange} />
                <Label for="star3" title="text" ><Image src={ratingIcon3} alt="rateType" /></Label>
                <span>Meh</span>
              </span>
              <span>
                <Input type="radio" id="star4" name="rateType" value="4" onChange={props.handleChange} />
                <Label for="star4" title="text" ><Image src={ratingIcon4} alt="rateType" /></Label>
                <span>Good</span>
              </span>
              <span>
                <Input type="radio" id="star5" name="rateType" value="5" onChange={props.handleChange} />
                <Label for="star5" title="text" ><Image src={ratingIcon5} alt="rateType" /></Label>
                <span>Awesome</span>             
              </span>
                {props.touched.rateType && props.errors.rateType ? <div className="form-error">{props.errors.rateType}</div> : null}
              </FormGroup>
            </div>
            <FormGroup>
              <Input id="exampleText" name="description" type="textarea" value={props.values.description}  onChange={props.handleChange}  placeholder="Add Your Valuable Feedback" />
              {props.touched.description && props.errors.description ? <div className="form-error">{props.errors.description}</div> : null}
            </FormGroup>
            <div className={`${styles.btnBlock}`}>
              <Button type="submit" className={`${styles.oxensBtn}`}>Submit</Button>
            </div>
          </Form>)}
        </Formik>
      </div>          
    </ModalBody>
  </Modal>

  )
}

export default StoreRating
import { Container, Row, Col,Form, Label, FormGroup, Input, Button, Alert} from 'reactstrap'
import IinnerLayout from "../layouts/linnerlayout"
import React, { useState } from 'react';
import Image from 'next/image'
import styles from "../styles/become-rider.module.css";
import work4 from '../public/images/work-4.svg';
import work5 from '../public/images/work-5.svg';
import work6 from '../public/images/work-6.svg';
import { Formik } from 'formik';
import * as yup from 'yup';
import nProgress from 'nprogress';
import { callApi } from '../Helper/helper';
function RegisterStore() {  
    const [alert,setAlert] = useState({
        status:false,
        message:"",
        type:""
    })
    const initialValues ={
        storeName:"",
        storeType:"",
        cPersonName:"",
        cPersonEmail:"",
        cPersonPhoneNo:"",
        storeLocation:""
    }
    const validateSchema = yup.object().shape(
        {
            storeName: yup.string().required('Store name is required'),
            storeType: yup.string().required('Store type is required'),
            cPersonName: yup.string().required('Contact person name is required'),
            cPersonEmail: yup.string().required('Contact person email is required').email(),
            cPersonPhoneNo: yup.string().required('Contact person phone no is required').matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
            storeLocation:yup.string().required('Store location is required'),
        }
    )
    const formSubmit = async (formData) =>{
        nProgress.start()
        try {
            let res = await callApi('post','/front/becomestore',formData)
            document.getElementById("becomeStore").reset()
            setAlert({
                status:true,
                message:res.data.message,
                type:"success"
            })
            setInterval(() => {
                setAlert({
                    status:false,
                    message:'',
                    type:""
                })
            }, 3000);
        } catch (error) {
            setAlert({
                status:true,
                message:error.message,
                type:"danger"
            })
            setInterval(() => {
                setAlert({
                    status:false,
                    message:'',
                    type:""
                })
            }, 3000);
        }
        nProgress.done()
    }
    return (
      <>
            <section className={`${styles.banner}`}>
                <Container fluid className="p-0">
                    <Row className="m-0">
                        <Col xl="8" lg="7" className="p-0">
                            <div className={`${styles.imgBlock}`}>
                                {/* <Image src={img4} alt="Img3" /> */}
                            </div>
                        </Col>
                        <Col xl="4" lg="5" className="p-0">
                            <div className={`${styles.bannerForm}`}>
                                <h6>Register as Store</h6>
                                <Alert isOpen={alert.status} color={alert.type}>
                                    {alert.message}
                                </Alert>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validateSchema}
                                    onSubmit={ values =>formSubmit(values)}
                                >
                                {(props) => (
                                    <Form 
                                        id='becomeStore' 
                                        onSubmit={props.handleSubmit} 
                                        onReset={props.handleReset}
                                    >
                                        <FormGroup className="form-floating">
                                            <Input
                                                type="text" 
                                                autoFocus 
                                                className={`${styles.formControl}`} 
                                                placeholder=""
                                                id="store_name"
                                                name="storeName"
                                                value={props.values.storeName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            <label htmlFor="store_name">Store Name</label>
                                            {props.errors.storeName && props.touched.storeName?
                                                <div className="form-error">{props.errors.storeName}</div>
                                            :""}
                                        </FormGroup>
                                        <FormGroup >
                                            <Input 
                                                id="exampleSelect" 
                                                className={`${styles.formControl}`} 
                                                type="select"
                                                name="storeType" 
                                                value={props.values.storeType}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            >
                                                <option value="">Select store type</option>
                                                <option value="grocery">Grocery</option>
                                                <option value="restaurant">Restaurant</option>
                                            </Input>
                                            {props.errors.storeType && props.touched.storeType?
                                                <div className="form-error">{props.errors.storeType}</div>
                                            :""}
                                        </FormGroup>
                                        <FormGroup className="form-floating">
                                            <Input 
                                                type="text" 
                                                className={`${styles.formControl}`}
                                                placeholder="" 
                                                id="contact_person_name"
                                                name='cPersonName'
                                                value={props.values.cPersonName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            <label htmlFor="contact_person_name">Contact Person Name</label>
                                            {props.errors.cPersonName && props.touched.cPersonName?
                                                <div className="form-error">{props.errors.cPersonName}</div>
                                            :""}
                                        </FormGroup>
                                        <FormGroup className="form-floating">
                                            <Input 
                                                type="email" 
                                                className={`${styles.formControl}`}
                                                placeholder=""
                                                id="contact_email"
                                                name='cPersonEmail'
                                                value={props.values.cPersonEmail}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            <label htmlFor="contact_email">Contact Email</label>
                                            {props.errors.cPersonEmail && props.touched.cPersonEmail?
                                                <div className="form-error">{props.errors.cPersonEmail}</div>
                                            :""}
                                        </FormGroup>
                                        <FormGroup className="form-floating">
                                            <span className={`${styles.borderLeft}`}></span>
                                            <Input 
                                                type="text" 
                                                className={`${styles.number}`} 
                                                placeholder=""
                                                id="contact_number"
                                                name='cPersonPhoneNo'
                                                value={props.values.cPersonPhoneNo}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            <label htmlFor="contact_number">Contact Number</label>
                                            {props.errors.cPersonPhoneNo && props.touched.cPersonPhoneNo?
                                                <div className="form-error">{props.errors.cPersonPhoneNo}</div>
                                            :""}
                                        </FormGroup>
                                        <FormGroup className="form-floating">
                                            <Input 
                                                type="text" 
                                                className={`${styles.formControl}`} 
                                                placeholder="" 
                                                id="location_of_restaurant"
                                                name='storeLocation'
                                                value={props.values.storeLocation}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            <label htmlFor="location_of_restaurant">Location of Restaurant</label>
                                            {props.errors.storeLocation && props.touched.storeLocation?
                                                <div className="form-error">{props.errors.storeLocation}</div>
                                            :""}
                                        </FormGroup>
                                        <div className={`${styles.btnBlock}`}>
                                            <Button 
                                                type="submit" 
                                                className={`${styles.oxensBtn}`}
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                                </Formik>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className={`${styles.workUs}`}>
                <Container>
                    <div className={`${styles.sectionTitle}`}>
                        <h2>How It Works</h2>
                    </div>
                    <Row>
                        <Col lg="4" md="6">
                        <div className={`${styles.workWrap}`}>
                            <div className={`${styles.imgBlock}`}>
                            <Image src={work4} alt="Banner Img" />
                            </div>
                            <h4>Register your store on Oxens</h4>
                        </div>
                        </Col>
                        <Col lg="4" md="6">
                        <div className={`${styles.workWrap}`}>
                            <div className={`${styles.imgBlock}`}>
                            <Image src={work5} alt="Banner Img" />
                            </div>
                            <h4>Manage your store on Oxens</h4>
                        </div>
                        </Col>
                        <Col lg="4" md="6">
                        <div className={`${styles.workWrap}`}>
                            <div className={`${styles.imgBlock}`}>
                            <Image src={work6} alt="Banner Img" />
                            </div>
                            <h4>Get Orders online</h4>
                        </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className={`${styles.workWith}`}>
                <Container>
                    <div className={`${styles.workWrap}`}>
                        <h3>Work With Us</h3>
                        <p className={`${styles.subtitle}`}>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.</p>
                        <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.  Velit officia consequat duis enim velit mollit enim velit mollit veniam Exercitation veniam consequat sunt nostrud amet Velit officia consequat duis enim velit mollit Exercitation veniam officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet consequat sunt Velit officia consequat duis enim velit mollit Exercitation velit mollit enim nostrud amet.</p>
                    </div>
                </Container>
            </section>
      </>
  )
}
RegisterStore.layout = IinnerLayout
export default RegisterStore
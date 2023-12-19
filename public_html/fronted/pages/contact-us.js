import { Container, Row, Col, Form, FormGroup, Input, Button, Alert } from 'reactstrap'
import IinnerLayout from "../layouts/linnerlayout"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import styles from "../styles/contact-us.module.css";
import iconPhone from "../public/images/iconPhone.svg";
import emailIcon from "../public/images/emailIcon.svg";
import { Formik } from 'formik';
import * as yup from 'yup'
import Nprogress from 'nprogress'
import { callContactUs } from '../reducers/frontSlice';
import { unSetApiFail, unSetApiSucc } from '../reducers/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
function ContactUs() {
    const dispatch = useDispatch()
    const [alert, setAlert] = useState({
        status:false,
        message:"",
        type:""
      }) 
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    let initialValues = {
        fname: '',
        lname: '',
        email: '',
        phoneNo: '',
        message:''
    }
    const validateSchema = yup.object().shape(
        {
            fname: yup.string().required('First name is required'),
            lname: yup.string().required('Last name is required'),
            email: yup.string().required('Email is required').email('Email must be a valid email'),
            phoneNo:yup.string().required('Phone number is required').matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
            message:yup.string().required('Message is required'),
        }
    )
    const formSubmit = async (value) => {
        // console.log(value);
        Nprogress.start()
        dispatch(callContactUs(value))
    }
    useEffect(() => {
        if (apiSuccess) {
          if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
            document.getElementById("contactForm").reset()
            Nprogress.done()
            alert.status = true
            alert.message = apiSuccess.message
            alert.type='success'
            setAlert({...alert})
            dispatch(unSetApiSucc())
            setTimeout(() => {
              alert.status = false
              alert.message = ""
              alert.type=''
              setAlert({...alert})
            }, 3000);
          }
        }
        if (apiError) {
          if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
            Nprogress.done()
            alert.status = true
            alert.message = apiError.message,
            alert.type = 'danger'
            setAlert({...alert})
            dispatch(unSetApiFail())
            setTimeout(() => {
              alert.status = false
              alert.message = ""
              alert.type=''
              setAlert({...alert})
            }, 3000);
          }
        }
    }, [apiSuccess,apiError])
    return (
        <>
            <section className={`${styles.banner}`}>                
                <div className={`${styles.tableWrap}`}>
                    <div className={`${styles.alignWrap}`}>
                        <Container>
                            <h2>Contact Us</h2>
                            <p>Lorem Ipsum is simply dummy text of the printing.</p>
                        </Container>
                    </div>
                </div>                
            </section>

            <section className={`${styles.contactWrap}`}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg="4" md="6">
                            <div className={`${styles.contactInfo}`}>
                                <div className={`${styles.imgBlock}`}>
                                    <Image src={iconPhone} alt="Phone" />
                                </div>
                                <span className={`${styles.title}`}>Contact Us</span>
                                <Link href="tel:+44 1865 270000"><a>+44 1865 270000</a></Link>
                            </div>
                        </Col>
                        <Col lg="4" md="6">
                            <div className={`${styles.contactInfo}`}>
                                <div className={`${styles.imgBlock}`}>
                                    <Image src={emailIcon} alt="email" />
                                </div>
                                <span className={`${styles.title}`}>Email</span>
                                <Link href="mailto:oxens@example.com"><a>oxens@example.com</a></Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className={`${styles.contactForm}`}>
                <Container>
                    <div className={`${styles.contactFormWrap}`}>
                        <h5>Send Message Us</h5>
                        <Alert isOpen={alert.status} color={alert.type}>
                            {alert.message}
                        </Alert>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validateSchema}
                            validateOnChange={false}
                            validateOnBlur={false}
                            onSubmit={ values =>formSubmit(values)}
                        >
                        {props=>(
                            <Form id="contactForm" onSubmit={props.handleSubmit} onReset={props.handleReset}>
                                <Row>
                                    <Col md="6">
                                        <FormGroup className="form-floating">
                                            <Input 
                                                type="text" 
                                                name="fname"
                                                onChange={props.handleChange}
                                                value={props.values.fname}
                                                className={`${styles.formControl}`} id="floatingFirstName"  placeholder="" 
                                            />
                                            <label htmlFor="floatingFirstName">First Name</label>
                                            {props.errors.fname ? <div className="form-error">{props.errors.fname}</div> : null}
                                        </FormGroup>        
                                    </Col>
                                    <Col md="6">
                                        <FormGroup className="form-floating">
                                            <Input 
                                                name="lname"
                                                type="text" 
                                                id="floatingLastName"
                                                className={`${styles.formControl}`}  placeholder=""
                                                onChange={props.handleChange}
                                                value={props.values.lname}
                                            />
                                            <label htmlFor="floatingLastName">Last Name</label>
                                            {props.errors.lname ? <div className="form-error">{props.errors.lname}</div> : null}
                                        </FormGroup>        
                                    </Col>
                                    <Col md="12">
                                        <FormGroup className="form-floating">
                                            <Input 
                                                type="text"
                                                name="email"
                                                onChange={props.handleChange}
                                                value={props.values.email}
                                                className={`${styles.formControl}`}   placeholder="" 
                                                id="floatingEmail"
                                            />
                                            <label htmlFor="floatingEmail">Email</label>
                                            {props.errors.email ? <div className="form-error">{props.errors.email}</div> : null}
                                        </FormGroup>        
                                    </Col>
                                    <Col md="12">
                                        <FormGroup className="form-floating">
                                            <Input 
                                            type="text" 
                                            name="phoneNo"
                                            onChange={props.handleChange}
                                            value={props.values.phoneNo}
                                            className={`${styles.formControl}`}
                                            placeholder="" 
                                            id="floatingPhone"
                                            />
                                            <label htmlFor="floatingPhone">Phone Number</label>
                                            {props.errors.phoneNo ? <div className="form-error">{props.errors.phoneNo}</div> : null}
                                        </FormGroup>        
                                    </Col>
                                    <Col md="12">
                                        <FormGroup className="form-floating">
                                            <Input 
                                                type="textarea" 
                                                name="message" 
                                                placeholder=""
                                                onChange={props.handleChange}
                                                value={props.values.message}
                                                id="floatingMessage"
                                            />
                                            <label htmlFor="floatingMessage">Message</label>
                                            {props.errors.message ? <div className="form-error">{props.errors.message}</div> : null}
                                        </FormGroup>        
                                    </Col>
                                    <Col md="12">
                                        <div className={`${styles.btnBlock}`}>
                                            <Button type="submit" className={`${styles.oxensBtn}`}>Submit</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                        </Formik>
                    </div>
                </Container>
            </section>
        </>
  )
 
}
ContactUs.layout = IinnerLayout
export default ContactUs
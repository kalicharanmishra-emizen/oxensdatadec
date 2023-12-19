import React, { useEffect, useState } from 'react';
import HomeLayout from "../layouts/home";
import { Container, Row, Col, Form, FormGroup, Input, Button, Alert} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import styles from "../styles/Login.module.css";
import Link from 'next/link'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik } from 'formik';
import * as yup from 'yup'
import { register } from '../reducers/authSlice'
import {manageCartData, unSetApiFail} from '../reducers/mainSlice'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Nprogress from 'nprogress'
import moment from 'moment'
import { callApi } from '../Helper/helper';
const Signup =()=> { 
  const router = useRouter()
  const dispatch = useDispatch() 
  const userDetails = useSelector(state=> state.authSlice.loggedInUser)
  const apiError = useSelector(state=> state.mainSlice.failed) 
  const [userInfo, setUserInfo] = useState("")
  const [error, setError] = useState({
    status:false,
    message:""
  })
  const [icon, setIcon] = useState({
    pass:false,
    con_pass:false
  })
  let initialValues = {
    name: '',
    email: '',
    phone_no: '',
    dob:'',
    password:"",
    con_password:""
  }
  const validateSchema = yup.object().shape(
    {
      name: yup.string().required('Name is required'),
      email: yup.string().required('Email is required').email(),
      phone_no:yup.string().required('Phone Number is required').matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
      dob:yup.string().required('Date of birth is required'),
      password:yup.string().required('Password is required'),
      con_password:yup.string().required('Confirm Password is required').oneOf([yup.ref('password')],'confirm password not match to password')
    }
  )
  const formSubmit = async (value) => {
    Nprogress.start()
    // dispatch(register(value))
    const res = await callApi('post','/auth/signup',value)
    if (res) {
      setUserInfo(res.data)
    }
  }
  useEffect(()=>{
      if(userInfo){
        if(userInfo.statusCode === 200){
          let cart = {
            orderItems:{},
            storeId:null,
            totalQuantity:0,
            totalAmount:0.00
          }
          localStorage.setItem('cart',JSON.stringify(cart))
          dispatch(manageCartData())
          Nprogress.done()
          router.push('/login')
        }
      }
  },[userInfo])
  // use effect for api error 
  useEffect(()=>{
    if(apiError){
      if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
        Nprogress.done()
        error.status = true
        error.message = apiError.message
        setError({...error})
        dispatch(unSetApiFail())
        setTimeout(() => {
          error.status = false
          error.message = ''
          setError({...error})
        }, 3000);
      }
    }
  },[apiError])
  return (
    <>
      <section className={`${styles.formSection}`} >
        <Container>
          <div className={`${styles.formWrap} formWrap`}>
            <div className={`${styles.formTitle}`}>
              <h3>Create your Account</h3>
            </div>
            <Alert isOpen={error.status} color="danger">
              {error.message}
            </Alert>
            <Formik
              initialValues={initialValues}
              validationSchema={validateSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={ values =>formSubmit(values)}
            >
            {(formikProps) => (
              <>
              <Form onSubmit={formikProps.handleSubmit}>
                <FormGroup className="form-floating">
                  <Input 
                    type="text" 
                    className={`${styles.name} formControl`} 
                    name="name"  
                    placeholder="" 
                    onChange={formikProps.handleChange}
                    value={formikProps.values.name}
                    id="name"
                  />
                  <label htmlFor="name">Full Name</label>
                  {formikProps.errors.name ? <div className="form-error">{formikProps.errors.name}</div> : null}
                </FormGroup>
                <FormGroup className="form-floating">
                  <span className={`${styles.borderLeft} borderLeft`}></span>
                  <Input 
                    type="text" 
                    className={`${styles.number} formControl`} 
                    name="phone_no" 
                    placeholder=""
                    onChange={formikProps.handleChange}
                    value={formikProps.values.phone_no}
                    id="mobile_number"
                  />
                  <label htmlFor="mobile_number">Mobile Number</label>
                  {formikProps.errors.phone_no ? <div className="form-error">{formikProps.errors.phone_no}</div> : null}
                </FormGroup>
                <FormGroup className="form-floating">
                  <Input 
                    type="text" 
                    className={`${styles.email} formControl`} 
                    name="email" 
                    placeholder=""
                    onChange={formikProps.handleChange}
                    value={formikProps.values.email}
                    id="email"
                  />
                  <label htmlFor="email">Email Id</label>
                  {formikProps.errors.email ? <div className="form-error">{formikProps.errors.email}</div> : null}
                </FormGroup>
                <FormGroup className="form-floating">
                  <DatePicker
                    name="dob"
                    // showMonthDropdown
                    showYearDropdown
                    maxDate={new Date()}
                    selected={(formikProps.values.dob && new Date(formikProps.values.dob)) || null}
                    onChange={val=>{
                      formikProps.setFieldValue('dob',moment(val).format("MM/DD/yyyy"))}}
                  />
                  <FontAwesomeIcon icon={faInfoCircle} />
                  {formikProps.errors.dob ? <div className="form-error">{formikProps.errors.dob}</div> : null}
                </FormGroup>
                <FormGroup className="form-floating">
                  <Input 
                    type={icon.pass?"text":"password"} 
                    className={`${styles.password} formControl`} 
                    name="password" 
                    placeholder="" 
                    onChange={formikProps.handleChange}
                    value={formikProps.values.password}
                    id="Password"
                  />
                  <label htmlFor="password">Password</label>
                    <FontAwesomeIcon icon={icon.pass?faEye:faEyeSlash} onClick={e=>{
                      icon.pass=!icon.pass
                      setIcon({...icon})
                    }}/>
                  {formikProps.errors.password ? <div className="form-error">{formikProps.errors.password}</div> : null}
                </FormGroup>
                <FormGroup className="form-floating">              
                  <Input 
                    type={icon.con_pass?"text":"password"} 
                    className={`${styles.password} formControl`} 
                    name="con_password" 
                    placeholder=""
                    onChange={formikProps.handleChange}
                    value={formikProps.values.con_password}
                    id="confirm_password"
                  />
                  <label htmlFor="confirm_password">Confirm Password</label>
                  <FontAwesomeIcon icon={icon.con_pass?faEye:faEyeSlash} onClick={e=>{
                      icon.con_pass=!icon.con_pass
                      setIcon({...icon})
                    }}/>
                  {formikProps.errors.con_password ? <div className="form-error">{formikProps.errors.con_password}</div> : null}
                </FormGroup>
                <div className={`${styles.btnBlock}`}>
                  <Button type="submit" className={`${styles.oxensBtn}`}>Sign Up</Button>
                </div>
                <div className={`${styles.create}`}>
                  <span>Already have an account? <Link href="/login"><a>Log in</a></Link></span>
                </div>
              </Form>
              </>
            )}
          </Formik>
          </div>
        </Container>
      </section> 
    </>
  )

}
Signup.layout = HomeLayout
export default Signup;
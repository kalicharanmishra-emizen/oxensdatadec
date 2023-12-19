import React, { useEffect, useState } from 'react';
import HomeLayout from "../layouts/home"
import { Container, Form, FormGroup, Input, Button, Alert} from 'reactstrap'
import styles from "../styles/Login.module.css";
import Link from 'next/link'
import {forgetPassword} from '../reducers/authSlice'
import {unSetApiFail,unSetApiSucc} from '../reducers/mainSlice'
import { useDispatch, useSelector } from 'react-redux';
import Nprogress from 'nprogress'
import { Formik } from 'formik';
import * as yup from 'yup'
const ForgotPassword =()=> {  
  const dispatch = useDispatch()
  const apiError = useSelector(state=> state.mainSlice.failed)
  const apiSuccess = useSelector(state=> state.mainSlice.success)
  const [alert, setAlert] = useState({
    status:false,
    message:"",
    type:""
  }) 
  const initialValues ={
    email:""
  }
  const validateSchema = yup.object().shape(
    {
      email: yup.string().required('Email is required').email('Email must be a valid email'),
    }
  )
  const formSubmit = (value) => {
    Nprogress.start()
    dispatch(forgetPassword(value))
  }
  
  useEffect(() => {
    if (apiSuccess) {
      if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
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
      <section className={`${styles.formSection}`} >
        <Container>
          <div className={`${styles.formWrap} formWrap`}>
            <div className={`${styles.formTitle}`}>
              <h3>Forgot Password</h3>
              <p>Instructions will be Sent to your Email</p>
            </div>
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
                <Form onSubmit={props.handleSubmit}>
                  <FormGroup className="form-floating">
                    <Input 
                      type="text" 
                      className={`${styles.email} formControl`} 
                      name="email" 
                      placeholder="" 
                      value={props.values.email}
                      onChange={props.handleChange}
                      id="Email"
                    />
                    <label htmlFor="Email">Email</label>
                    {props.errors.email ? <div className="form-error">{props.errors.email}</div> : ''}
                  </FormGroup>
                  <div className={`${styles.btnBlock}`}>
                    <Button type="submit" className={`${styles.oxensBtn}`}>Send</Button>
                  </div>
                  <div className={`${styles.create}`}>
                    <span>Back to <Link href="/login"><a>Log in</a></Link></span>
                  </div>
                </Form>
              )}
              
            </Formik>
            
          </div>
        </Container>
      </section> 
    </>
  )

}
ForgotPassword.layout = HomeLayout
export default ForgotPassword;
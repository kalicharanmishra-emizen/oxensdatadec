import React, { useState, useEffect } from 'react';
import HomeLayout from "../layouts/home"
import { Container, Form, FormGroup, Input, Button, Alert} from 'reactstrap'
import styles from "../styles/Login.module.css";
import {resetPass} from '../reducers/authSlice'
import {unSetApiFail,unSetApiSucc} from '../reducers/mainSlice'
import { useDispatch, useSelector } from 'react-redux';
import Nprogress from 'nprogress'
import { Formik } from 'formik';
import * as yup from 'yup'
import { useRouter } from 'next/router';
const ResetPassword =()=> { 
  const router = useRouter()
  const dispatch = useDispatch()
  const apiError = useSelector(state=> state.mainSlice.failed)
  const apiSuccess = useSelector(state=> state.mainSlice.success)
  const [alert, setAlert] = useState({
    status:false,
    message:"",
    type:""
  }) 
  const initialValues ={
    new_pass:"",
    con_pass:""
  }
  const validateSchema = yup.object().shape(
    {
      new_pass: yup.string().required('New password is required'),
      con_pass:yup.string().required('Confirm Password is required').oneOf([yup.ref('new_pass')],'Confirm password not match to New password')
    }
  )
  const formSubmit = (value) => {
    Nprogress.start()
    value['token']= router.query.token
    dispatch(resetPass(value))
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
        router.push('/login')
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
          <div className={`${styles.formWrap}`}>
            <div className={`${styles.formTitle}`}>
              <h3>Create New Password</h3>
              <p>Set new password and login using this password</p>
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
                  <FormGroup>
                    <Input 
                      type="password" 
                      className={`${styles.password}`} 
                      name="new_pass" 
                      placeholder="Set new Password"
                      value={props.values.new_pass}
                      onChange={props.handleChange}
                    />
                    {props.errors.new_pass ? <div className="form-error">{props.errors.new_pass}</div> : ''}
                  </FormGroup>
                  <FormGroup>
                    <Input 
                      type="password" 
                      className={`${styles.password}`} 
                      name="con_pass" 
                      placeholder="Confirm password" 
                      value={props.values.con_pass}
                      onChange={props.handleChange}
                    />
                    {props.errors.con_pass ? <div className="form-error">{props.errors.con_pass}</div> : ''}
                  </FormGroup>
                  <div className={`${styles.btnBlock}`}>
                    <Button type="submit" className={`${styles.oxensBtn}`}>Submit</Button>
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
ResetPassword.layout = HomeLayout
export default ResetPassword;
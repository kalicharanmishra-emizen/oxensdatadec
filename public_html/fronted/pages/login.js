import React, { useState,useEffect } from 'react';
import HomeLayout from "../layouts/home"
import { Container, Form, FormGroup, Input, Button, Alert} from 'reactstrap'
import styles from "../styles/Login.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash,faEye } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { Formik } from 'formik';
import * as yup from 'yup'
import { login } from '../reducers/authSlice'
import {unSetApiFail} from '../reducers/mainSlice'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Nprogress from 'nprogress'

const Login =()=> {    
  const router = useRouter()
  const dispatch = useDispatch() 
  const userDetails = useSelector(state=> state.authSlice.loggedInUser)
  const apiError = useSelector(state=> state.mainSlice.failed) 
  const [error, setError] = useState({
    status:false,
    message:""
  })
  const [icon, setIcon] = useState(false)
  const initialValues ={
    email:"",
    password:""
  }
  const validateSchema = yup.object().shape(
    {
      email: yup.string().required('Email is required').email(),
      password:yup.string().required('Password is required'),
    }
  )
  const formSubmit = async (value) => {
    // console.log('value',value);
    Nprogress.start()
    dispatch(login(value))
  }
  useEffect(()=>{
    if(userDetails){
      if(userDetails.statusCode === 200){
        Nprogress.done()
        router.push('/')
      }
    }
  },[userDetails])
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
      <section className={`${styles.formSection} `}>
        <Container> 
          <div className={`${styles.formWrap} formWrap`}>
            <div className={`${styles.formTitle}`}>
              <h3>Log In</h3>
              <p>Login with your Email that you entered during your registration</p>
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
            {(props) => (
              <Form onSubmit={props.handleSubmit}>              
                <FormGroup className="form-floating">
                  <Input
                    type="text" 
                    className={`${styles.email} formControl`} 
                    name="email" 
                    placeholder="" 
                    value={props.values.email} 
                    onChange={props.handleChange}
                    id="email"
                  />
                  <label htmlFor="email">Email</label>
                  {props.errors.email ? <div className="form-error">{props.errors.email}</div> : ''}
                </FormGroup>
                <FormGroup className="form-floating">
                  <Input 
                    type={icon?"text":"password"} 
                    className={`${styles.password} formControl`} 
                    name="password" 
                    placeholder=""
                    value={props.values.password} 
                    onChange={props.handleChange}
                    id="password"
                  />
                  <label htmlFor="password">Password</label>
                  <FontAwesomeIcon icon={icon?faEye:faEyeSlash} onClick={()=>setIcon(!icon)}/>
                  {props.errors.password ? <div className="form-error">{props.errors.password}</div> : ''}
                </FormGroup>
                <div className={`${styles.Forgot}`}>
                  <Link href="/forgotPassword"><a>Forgot Password?</a></Link>
                </div>
                <div className={`${styles.btnBlock}`}>
                  <Button 
                    type="submit" 
                    className={`${styles.oxensBtn}`}
                  >
                    Login
                  </Button>
                </div>
                <div className={`${styles.create}`}>
                  <Link href="/signup"><a>Create your account</a></Link>
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
Login.layout = HomeLayout
export default Login;
import { Container,Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Alert} from 'reactstrap'
import IinnerLayout from "../layouts/linnerlayout"
import React, { useEffect, useState } from 'react';
import styles from "../styles/profile.module.css";
import { useDispatch, useSelector,  } from 'react-redux';
import { useRouter } from 'next/router';
import Nprogress from 'nprogress'
import { Formik } from 'formik';
import * as yup from 'yup'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuthUser, updateProfile,updatePassword } from '../reducers/authSlice';
import { unSetApiFail, unSetApiSucc } from '../reducers/mainSlice';
import moment from 'moment'
function Profile() { 
  const [alert, setAlert] = useState({
    status:false,
    message:"",
    type:""
  }) 
  const authUser = useSelector(state=> state.authSlice.loggedInUser)
  const apiError = useSelector(state=> state.mainSlice.failed)
  const apiSuccess = useSelector(state=> state.mainSlice.success)
  const [changePassModel, setChangePassModel] = useState(false)
  const toggelChangePass = () => {
    setChangePassModel(!changePassModel)
  }
  
  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(() => {
    if(!localStorage.getItem('auth-user-token')){
      router.push('/')
    }else{
      dispatch(getAuthUser())
    }
  }, [])
  const initialValues ={
    name:authUser.data.name,
    email:authUser.data.email,
    phone_no:authUser.data.phone_no,
    dob:authUser.data.dob
  }
  const validatePassSchema = yup.object().shape(
    {
      old_pass:yup.string().required('Old password is required'),
      new_pass: yup.string().required('New password is required'),
      con_pass:yup.string().required('Confirm Password is required').oneOf([yup.ref('new_pass')],'confirm password not match to password')
    }
  )

  const validateSchema = yup.object().shape(
    {
      name:yup.string().required('Name is required'),
      email: yup.string().required('Email is required').email(),
      phone_no:yup.string().required('Phone Number is required').matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
      dob:yup.string().required('Date of birth is required'),
    }
  )
  const formSubmit = (value) =>{
    Nprogress.start()
    dispatch(updateProfile(value))
  }
  const passFormSubmit = (value) => {
    Nprogress.start()
    dispatch(updatePassword(value))
  }
  
  useEffect(() => {
      if (apiSuccess) {
        if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
          dispatch(getAuthUser())
          setChangePassModel(false)
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
          setChangePassModel(false)
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
        <section className={`${styles.profile}`}>
          <Container>
            <div className={`${styles.profileWrap}`}>
              {/* <div className={`${styles.profileImg}`}>
                <Label for="EditImg">
                  <Input type="file" id="EditImg"/>
                  <Image src={ProfileImg}   alt="Profile"/>    
                  <span className={`${styles.profileIcon}`}><Image src={camIcon} alt="Camera Icon" /></span>              
                </Label>                
              </div>
              <div className={`${styles.editProfile}`}>
                <span><Image src={editIcon} alt="editIcon" />Edit Profile</span>
              </div> */}
              <div className={`${styles.formSection}`}>
                <h5>Personal Details</h5>
                <Alert isOpen={alert.status} color={alert.type}>
                  {alert.message}
                </Alert>
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={validateSchema}
                  validateOnChange={false}
                  validateOnBlur={false}
                  onSubmit={ values =>formSubmit(values)}
                >
                  {props=>(
                    <Form onSubmit={props.handleSubmit}>
                      <FormGroup className={`${styles.formGroup}`}>
                        <Input 
                          className={`${styles.name}`} 
                          name="name" 
                          type="text" 
                          placeholder="Full Name"
                          value={props.values.name}
                          onChange={props.handleChange}
                        />
                        {props.errors.name ? <div className="form-error">{props.errors.name}</div> : null}
                      </FormGroup>
                      <FormGroup className={`${styles.formGroup}`}>
                        <Input 
                          className={`${styles.email}`} 
                          name="email" 
                          type="text" 
                          placeholder="Email Address" 
                          value={props.values.email}
                          onChange={props.handleChange}
                        />
                        {props.errors.email ? <div className="form-error">{props.errors.email}</div> : null}
                      </FormGroup>
                      <FormGroup className={`${styles.formGroup}`}>
                        <span className={`${styles.borderLeft}`}></span>
                        <Input 
                          type="text" 
                          className={`${styles.number}`} 
                          name="phone_no" 
                          placeholder="Mobile Number" 
                          value={props.values.phone_no}
                          onChange={props.handleChange}
                        />
                        {props.errors.phone_no ? <div className="form-error">{props.errors.phone_no}</div> : null}
                      </FormGroup>
                      <FormGroup className={`${styles.formGroup}`}>
                        <DatePicker
                          name="dob"
                          // showMonthDropdown
                          showYearDropdown
                          maxDate={new Date()}
                          selected={(props.values.dob && new Date(props.values.dob)) || null}
                          onChange={val=>{props.setFieldValue('dob',moment(val).format("MM/DD/yyyy"))}}
                        />
                        {props.errors.dob ? <div className="form-error">{props.errors.dob}</div> : null}
                      </FormGroup>
                      <div className={`${styles.Forgot}`}>
                        <span role="button" onClick={toggelChangePass}><a>Change Password?</a></span>
                      </div>
                      <div className={`${styles.btnBlock}`}>
                        <Button type="submit" className={`${styles.oxensBtn}`}>Save</Button>
                      </div>
                    </Form>
                  )}
                  
                </Formik>
              </div>
            </div>
          </Container>
        </section>


      <Modal isOpen={changePassModel} className="ModalCustom ChangePass">
          <ModalHeader className="modalHeader">Change Password
            <span className="closeButton" onClick={toggelChangePass}></span>
          </ModalHeader>
          <ModalBody>
          <div className={`${styles.formSection}`}>

            <Formik
              initialValues={{
                old_pass:'',
                new_pass:'',
                con_pass:''
              }}
              validationSchema={validatePassSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={ values =>passFormSubmit(values)}
            >
            {props=>(
              <Form onSubmit={props.handleSubmit}>
                <FormGroup className={`${styles.formGroup}`}>
                  <Input 
                    type="password" 
                    className={`${styles.password}`} 
                    name="old_pass" 
                    placeholder="Old Password" 
                    value={props.values.old_pass}
                    onChange={props.handleChange}
                  />
                  {props.errors.old_pass ? <div className="form-error">{props.errors.old_pass}</div> : null}
                </FormGroup>
                <FormGroup className={`${styles.formGroup}`}>
                  <Input 
                    type="password" 
                    className={`${styles.password}`} 
                    name="new_pass" 
                    placeholder="New Password" 
                    value={props.values.new_pass}
                    onChange={props.handleChange}
                  />
                  {props.errors.new_pass ? <div className="form-error">{props.errors.new_pass}</div> : null}
                </FormGroup>
                <FormGroup className={`${styles.formGroup}`}>
                  <Input 
                    type="password" 
                    className={`${styles.password}`} 
                    name="con_pass" 
                    placeholder="Confirm Password" 
                    value={props.values.con_pass}
                    onChange={props.handleChange}
                  />
                  {props.errors.con_pass ? <div className="form-error">{props.errors.con_pass}</div> : null}
                </FormGroup>
                <div className={`${styles.btnBlock} btnBlock`}>
                  <Button type="submit" className={`${styles.oxensBtn}`}>Save</Button>
                </div>
              </Form>
            )}
            </Formik>
          </div>
          </ModalBody>
      </Modal>
    </>
  )
}
Profile.layout = IinnerLayout
export default Profile
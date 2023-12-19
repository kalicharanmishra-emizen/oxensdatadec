import { Container, Row, Col,Form, Label, FormGroup, Input, Button, Alert} from 'reactstrap'
import IinnerLayout from "../layouts/linnerlayout"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import styles from "../styles/careers.module.css";
import UploadImg from '../public/images/UploadImg.svg';
import { callCareers } from '../reducers/frontSlice';
import { Formik } from 'formik';
import * as yup from 'yup';
import nProgress from 'nprogress';
import { useDispatch,useSelector } from 'react-redux';
import {unSetApiFail,unSetApiSucc} from '../reducers/mainSlice';
function Carreer() {  
    const dispatch = useDispatch()
    const apiSuccess = useSelector(state =>state.mainSlice.success)
    const apiError = useSelector(state =>state.mainSlice.failed)
    const [file,setFile] = useState(null)
    const [alert,setAlert] = useState({
        status:false,
        message:"",
        type:""
    })
    const initialValues ={
        name:"",
        phone_no:"",
        email:"",
        position:"",
        curProfile:"",
        totelExp:"",
        relExp:"",
        coverLetter:"",
    }
    const validateSchema = yup.object().shape(
        {
            name: yup.string().required('Name is required'),
            phone_no: yup.string().required('Phone No. is required').matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
            email: yup.string().required('Email is required').email(),
            position: yup.string().required('Position is required'),
            totelExp: yup.number().typeError('Must be a number').required('Total experience is required'),
            relExp: yup.number().typeError('Must be a number').required('Relevant experience is required'),
            coverLetter:yup.string().required('Cover letter is required'),
        }
    )

    const fileUpload = (e) =>{
        setFile(e.target.files[0])
    }

    const formSubmit = async (formData) =>{
        nProgress.start()
        let finalData =new FormData()
        Object.keys(formData).forEach(list=>{
            finalData.append(list,formData[list])
        })
        finalData.append('resume',file)
        // console.log('finalData',finalData);
        dispatch(callCareers(finalData))
    }
    useEffect(() => {
        if (apiSuccess) {
          if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
            document.getElementById("carrerForm").reset()
            window.scrollTo({ top: '100px', behavior: 'smooth' });
            nProgress.done()
            setAlert({
                status:true,
                message: apiSuccess.message,
                type:'success'
            })
            dispatch(unSetApiSucc())
            setTimeout(() => {
              setAlert({
                status:false,
                message: '',
                type:''
              })
            }, 3000);
          }
        }
        if (apiError) {
          if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
            setAlert({
                status:true,
                message: apiError.message,
                type:'danger'
            })
            nProgress.done()
            window.scrollTo({ top: '100px', behavior: 'smooth' });
            dispatch(unSetApiFail())
            setTimeout(() => {
                setAlert({
                    status:false,
                    message: '',
                    type:''
                })
            }, 3000);
          }
        }
    }, [apiSuccess,apiError])
    return (
      <>
          <section className={`${styles.banner}`}>
            <Container className={`${styles.container}`}>
                <h3>Careers</h3>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever<br /> since the 1500s, when an unknown printer took a galley</p>
            </Container>
          </section>

          <section className={`${styles.careersWrap}`}>
            <Container>
                <div className={`${styles.careerForm}`}>
                    <h5>Fill out your Details</h5>
                    <p>Lorem Ipsum is simply dummy text</p>
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
                            id="carrerForm" 
                            onSubmit={props.handleSubmit} 
                            onReset={props.handleReset}
                        >
                            <Row>
                                <Col md="6">
                                    <FormGroup className="form-floating">
                                        <Input 
                                            type="text" 
                                            className={`${styles.formControl}`} 
                                            placeholder=""
                                            id="full_name"
                                            name='name'
                                            value={props.values.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <label htmlFor="full_name">Full Name</label>
                                        {props.errors.name && props.touched.name?
                                            <div className="form-error">{props.errors.name}</div>
                                        :""}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup className="form-floating">
                                        <span className={`${styles.borderLeft}`}></span>
                                        <Input 
                                            type="text" 
                                            className={`${styles.formControl,styles.number}`} 
                                            placeholder=""
                                            id="mobile_number" 
                                            name='phone_no'
                                            value={props.values.phone_no}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <label htmlFor="mobile_number">Mobile Number</label>
                                        {props.errors.phone_no && props.touched.phone_no?
                                            <div className="form-error">{props.errors.phone_no}</div>
                                        :""}
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup className="form-floating">
                                        <Input 
                                            type="email" 
                                            className={`${styles.formControl}`} 
                                            placeholder="" 
                                            id="email"
                                            name='email'
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <label htmlFor="email">Email</label>
                                        {props.errors.email && props.touched.email?
                                            <div className="form-error">{props.errors.email}</div>
                                        :""}
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup>
                                        <Input 
                                            id="options" 
                                            className={`${styles.formControl}`} 
                                            type="select"
                                            name='position'
                                            value={props.values.position}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        >
                                            <option value="">Select Position</option>
                                            <option>Want to Apply for Which position</option>
                                            <option>Want to Apply for Which position</option>
                                            <option>Want to Apply for Which position</option>
                                            <option>Want to Apply for Which position</option>
                                        </Input>
                                        {props.errors.position && props.touched.position?
                                            <div className="form-error">{props.errors.position}</div>
                                        :""}
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup className="form-floating">
                                        <Input 
                                            type="text" 
                                            className={`${styles.formControl}`} 
                                            placeholder=""
                                            id="current_profile"
                                            name='curProfile'
                                            value={props.values.curProfile}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <label htmlFor="current_profile">Current Profile (Optional)</label>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup className="form-floating">
                                        <Input 
                                            type="text" 
                                            className={`${styles.formControl}`} 
                                            placeholder=""
                                            name='totelExp'
                                            value={props.values.totelExp}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            id="total_experience_yrs"
                                        />
                                        <label htmlFor="total_experience_yrs">Total Experience Yrs.</label>
                                        {props.errors.totelExp && props.touched.totelExp?
                                            <div className="form-error">{props.errors.totelExp}</div>
                                        :""}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup className="form-floating">
                                        <Input 
                                            type="text" 
                                            className={`${styles.formControl}`} 
                                            placeholder=""
                                            id="relevant_experience_yrs"
                                            name='relExp'
                                            value={props.values.relExp}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <label htmlFor="relevant_experience_yrs">Relevant Experience Yrs.</label>
                                        {props.errors.relExp && props.touched.relExp?
                                            <div className="form-error">{props.errors.relExp}</div>
                                        :""}
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup className="form-floating">
                                        <Input 
                                            className={`${styles.formControl}`} 
                                            type="textarea" 
                                            placeholder=""
                                            id="cover_letter"
                                            name='coverLetter'
                                            value={props.values.coverLetter}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur} 
                                        />
                                        <label htmlFor="cover_letter">Cover Letter</label>
                                        {props.errors.coverLetter && props.touched.coverLetter?
                                            <div className="form-error">{props.errors.coverLetter}</div>
                                        :""}
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup>
                                        <div className={`${styles.fileSelector}`}>
                                            <Label for="fileSelector">
                                                <span>Upload Resume / File type shuld be PDF</span>
                                                <span className={`${styles.fileIcon}`}><Image src={UploadImg} alt="File" /></span>
                                                <Input 
                                                    id="fileSelector" 
                                                    className={`${styles.fileInput}`} 
                                                    type="file"
                                                    placeholder='File type shuld be PDF'
                                                    onChange={fileUpload}
                                                />
                                            </Label>
                                        </div>
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
Carreer.layout = IinnerLayout
export default Carreer
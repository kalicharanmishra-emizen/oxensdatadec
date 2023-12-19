import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik';
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { callApi } from '../../Helper/helper';
import "../../styles/posUser.css"
const POSuser = (props) => {
  
    // globel states
    const [userFormModal, setUserFormModal] = useState(false)
    const [existsUser, setExistsUser] = useState("")
    const initalValue = {
        firstName:"",
        lastName:"",
        email:"",
        phoneNo:props?.itemId ?? "",
    }

    // form validation
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().required('Email is required').email("Email must be a valid email address"),
        phoneNo: Yup.string().required('Phone No is required').matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
    })

    // submit form and save POS user in db
    const formSubmitHandal = async (value) => {
        try {
            const res = await callApi("post", "/store/createPOSuser", value)
            if (res) {
                setUserFormModal(false)
            }
            setExistsUser("")
            const rawData = {
                key:res?.data?.data?._id,
                value:res?.data?.data?.firstName + " " + res?.data?.data?.lastName + " " + res?.data?.data?.phoneNo, 
                phoneno:res?.data?.data?.phoneNo
            }
            props.getTempUser(rawData)
            console.log("rawData", rawData);
            console.log("res", res?.data?.data);
        } catch (error) {
            setExistsUser(error.message) // already exists user set error
        }
    }

    const handleReset = (resetForm) => {
        resetForm();
        setExistsUser("")
    };

    useEffect(() => {
        setUserFormModal(props.isOpen) // Toggle user form model 
    }, [props.isOpen])

  return (
    <>
        <Modal isOpen={ userFormModal } className="">
            <ModalHeader className="modelHeader">
                <div className="modelHeaderTitle">Create New User</div>
                <div className="bg-close" onClick={() => props.toggle()}></div>
            </ModalHeader>
            <ModalBody className="">
                    <Formik
                        enableReinitialize
                        initialValues={initalValue}
                        validationSchema={validationSchema}
                        onSubmit={ 
                            (values, {resetForm}) => {
                                formSubmitHandal(values)
                                resetForm({
                                    firstName:"",
                                    lastName:"",
                                    email:"",
                                    phoneNo:"",
                                })
                            }
                        }
                    >
                    {
                        (formikProps)=>(
                            <Form onSubmit={formikProps.handleSubmit}>
                                <Row>
                                    <Col xl="6">
                                        <FormGroup>
                                            <label className="form-control-label"> First Name </label>
                                            <Input
                                                type="text"
                                                name="firstName"
                                                placeholder="Enter First Name"
                                                value={ formikProps.values.firstName }  
                                                onChange={ formikProps.handleChange } 
                                            />
                                            {   
                                                formikProps.touched.firstName && formikProps.errors.firstName 
                                                    ? <div style={{color:"red"}} className="form-error">{formikProps.errors.firstName}</div> 
                                                    : null
                                            }
                                        </FormGroup>
                                    </Col>
                                    <Col xl="6">
                                        <FormGroup>
                                            <label className="form-control-label"> Last Name </label>
                                            <Input
                                                type="text"
                                                name="lastName"
                                                placeholder="Enter last Name"
                                                value={ formikProps.values.lastName }  
                                                onChange={ formikProps.handleChange } 
                                            />
                                            {  
                                                formikProps.touched.lastName && formikProps.errors.lastName 
                                                    ? <div style={{color:"red"}} className="form-error">{formikProps.errors.lastName}</div> 
                                                    : null
                                            }
                                        </FormGroup>
                                    </Col>
                                    <Col xl="6">
                                        <FormGroup>
                                            <label className="form-control-label"> Email  </label>
                                            <Input
                                                type="text"
                                                name="email"
                                                placeholder="Enter Email"
                                                value={ formikProps.values.email }  
                                                onChange={ formikProps.handleChange } 
                                            />
                                            {   
                                                formikProps.touched.email && formikProps.errors.email 
                                                    ? <div style={{color:"red"}} className="form-error">{formikProps.errors.email}</div> 
                                                    : null
                                            }
                                        </FormGroup>
                                    </Col>
                                    <Col xl="6">
                                        <FormGroup>
                                            <label className="form-control-label"> Phone Number </label>
                                            <Input
                                                type="text"
                                                name="phoneNo"
                                                placeholder="Enter Mobile No"
                                                value={ formikProps.values.phoneNo }  
                                                onChange={ formikProps.handleChange } 
                                            />
                                            {
                                                formikProps.touched.phoneNo && formikProps.errors.phoneNo 
                                                    ? <div style={{color:"red"}} className="form-error">{formikProps.errors.phoneNo}</div> 
                                                    : null
                                            }
                                        </FormGroup>
                                    </Col>
                                    <Col xl="12">
                                        <FormGroup>
                                            {   
                                                existsUser && existsUser 
                                                    ? <div className="form-error" style={{color:"red"}}>{existsUser}</div> 
                                                    : ""
                                            }
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <Button onClick={handleReset.bind(null, formikProps.resetForm)}
                                            type="button"
                                            color="danger"
                                            style={{width:"100%"}}
                                            >
                                            Reset
                                        </Button>
                                    </Col>
                                    <Col md="6">
                                        <Button
                                            color="primary"
                                            type="submit"
                                            style={{width:"100%"}}
                                        >
                                            Save
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        )
                    }
                    </Formik> 
            </ModalBody>
        </Modal>
    </>
  )
}

export default POSuser
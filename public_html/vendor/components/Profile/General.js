import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { updateProfile } from "reducers/authSlice";
import { useDispatch } from 'react-redux';
import NProgress from 'nprogress';
import {Formik} from 'formik';
import * as Yup from 'yup';
import InputCom from "components/Form/InputCom";
import FromSelect from "components/Form/FromSelect";
import LocationCom from "../../components/Form/LocationCom";
export default function General(props) {
    const dispatch = useDispatch()
    const [profileData, setProfileData] = useState(null)
    const [vendorTypesList,setVendorTypesList] = useState([]);
    const [categoryList,setCategoryList] = useState([]);
    const [logo, setLogo] = useState(null)
    const [temp, setTemp] = useState(null)
    let formSubmit = {
        typeOf:profileData?profileData.profile_data.typeOf:'',
        category:profileData?profileData.profile_data.category:[],
        commission:profileData?profileData.profile_data.commission:'',
        name:profileData?profileData.name:'',
        email:profileData?profileData.email:'',
        phone_no:profileData?profileData.phone_no:'',
        preparation_time:profileData?profileData.profile_data.preparation_time:'',
        minimum_amount:profileData?profileData.profile_data.minimum_amount:'',
        contact_person_name:profileData?profileData.profile_data.contactPerson.name:'',
        contact_person_email:profileData?profileData.profile_data.contactPerson.email:'',
        contact_person_phone_no:profileData?profileData.profile_data.contactPerson.phone_no:'',
        location:{
            address:profileData?profileData.profile_data.location.address:'',
            lat:profileData?profileData.profile_data.location.late:'',
            lng:profileData?profileData.profile_data.location.lng:''
        }
    }
    const validationSchema =Yup.object().shape({
        typeOf: Yup.string().required('Vendor type is required!'),
        category: Yup.array().min(1,'Vendor category required'),
        name: Yup.string().required('Store name required'),
        phone_no: Yup.string().required('Store phone no. required')
            .matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
        preparation_time: Yup.number().typeError('Must be a number')
            .required('Preparation time is required')
            .min(1,'Preparation time must be greater than 1'),
        minimum_amount: Yup.number().typeError('Must be a number')
            .required('Minimum amount is required')
            .min(1,'Minimum amount must be greater than 1'),
        contact_person_name: Yup.string().required('Contact person name required'),
        contact_person_email: Yup.string().required('Contact person email required')
            .email('Email must be a valid email address'),
        contact_person_phone_no: Yup.string().required('Contact person phone no. required')
            .matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
        location:Yup.object().shape({
            address:Yup.string().required('Location is required'),
        }),
    })
    useEffect(() => {
        setProfileData(props.details)
        setVendorTypesList(props.typeList)
        setCategoryList(props.categoryList)
        setTemp(props.details.logo)
    }, [props.details])
    const imgUpload = (e) =>{
        // console.log('image',e.target.files);
        setLogo(e.target.files[0])
        setTemp(URL.createObjectURL(e.target.files[0]))
    }
    const formSubmitHandal = async (formData) =>{
            // console.log('final data',formData);
            let convertFormData= new FormData();
            for (const [key, value] of Object.entries(formData)) {
                if (key!='location') {
                    convertFormData.append(key,value)
                }
            }
            if (logo) {
                convertFormData.append('logo',logo)
            }
            convertFormData.append('address',formData.location.address)
            convertFormData.append('lat',formData.location.lat)
            convertFormData.append('lng',formData.location.lng)
            // console.log('final data',convertFormData);
            NProgress.start()
            dispatch(updateProfile(convertFormData))
    }
    console.log("profileData--", profileData);
    return (
    <Formik
        enableReinitialize
        initialValues={formSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={ values =>formSubmitHandal(values)}
    >
    {(formikProps)=>(
        <Form onSubmit={formikProps.handleSubmit}>
            <h6 className="heading-small text-muted mb-4">
                User information
            </h6>
            <div className="pl-lg-4">
                <Row>
                <Col lg="6">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                           Vendor Type
                        </label>
                        {!props.isLoading?
                            <FromSelect
                                name="typeOf"
                                id="typeOf"
                                options={vendorTypesList}
                                isDefault={true}
                                isMulti={false}
                                defValue={formikProps.values.typeOf}
                                getValue={formikProps.setFieldValue}
                                error={formikProps.errors.typeOf}
                            />
                        :""}
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                           Vendor Category
                        </label>
                        {!props.isLoading?
                        <FromSelect
                            name="category"
                            id="category"
                            options={categoryList}
                            isDefault={false}
                            isMulti={true}
                            defValue={formikProps.values.category}
                            getValue={formikProps.setFieldValue}
                            error={formikProps.errors.category}
                        />
                        :""}
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-email"
                        >
                            Email address
                        </label>
                        <InputCom
                            type="text"
                            name="email"
                            placeholder="Enter Store Email"
                            isDefault={false}
                            getValue={formikProps.setFieldValue}
                            defValue={formikProps.values.email}
                            error={formikProps.errors.email}
                        />
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                    <label
                        className="form-control-label"
                        htmlFor="input-phone-no"
                    >
                        Commission
                    </label>
                        <InputCom
                            type="text"
                            name="commission"
                            placeholder="Enter Store Email"
                            isDefault={true}
                            getValue={formikProps.setFieldValue}
                            defValue={formikProps.values.commission}
                            error={formikProps.errors.commission}
                        />
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                    <label
                        className="form-control-label"
                        htmlFor="input-name"
                    >
                        Name
                    </label>
                        <InputCom
                            type="text"
                            name="name"
                            placeholder="Enter Store Name"
                            isDefault={false}
                            getValue={formikProps.setFieldValue}
                            defValue={formikProps.values.name}
                            error={formikProps.errors.name}
                        />
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                    <label
                        className="form-control-label"
                        htmlFor="input-phone-no"
                    >
                        Phone No
                    </label>
                        <InputCom
                            type="text"
                            name="phone_no"
                            placeholder="Enter Store phone no."
                            isDefault={false}
                            getValue={formikProps.setFieldValue}
                            defValue={formikProps.values.phone_no}
                            error={formikProps.errors.phone_no}
                        />
                    </FormGroup>
                </Col>
                <Col lg="3">
                    <FormGroup>
                    <label
                        className="form-control-label"
                        htmlFor="input-phone-no"
                    >
                        Order Preparation Time (Min.)
                    </label>
                        <InputCom
                            type="text"
                            name="preparation_time"
                            placeholder="Enter Store preparation time."
                            isDefault={false}
                            getValue={formikProps.setFieldValue}
                            defValue={formikProps.values.preparation_time}
                            error={formikProps.errors.preparation_time}
                        />
                    </FormGroup>
                </Col>
                <Col lg="3">
                    <FormGroup>
                    <label
                        className="form-control-label"
                        htmlFor="input-phone-no"
                    >
                        Minimum Order Amount (£)
                    </label>
                        <InputCom
                            type="text"
                            name="minimum_amount"
                            placeholder="Enter Store minimum amount."
                            isDefault={false}
                            getValue={formikProps.setFieldValue}
                            defValue={formikProps.values.minimum_amount}
                            error={formikProps.errors.minimum_amount}
                        />
                    </FormGroup>
                </Col>
                <Col lg="2">
                    <FormGroup>
                    <label className="form-control-label" htmlFor="profile-image">
                        Logo
                    </label>
                    <Input
                        className="form-control-alternative"
                        id="profile-image"
                        type="file"
                        name="logo"
                        onChange={imgUpload}
                    />
                    </FormGroup>
                </Col>
                <Col lg="2">
                    <img 
                        src={temp}
                        className="m-2"
                        width="100"
                        height="80"
                    />
                </Col>
                <Col lg="12">
                        <h6 className="heading-small text-muted mb-4">
                            Contact Person information
                        </h6>
                    <Row>
                    <Col lg="4">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="profile-image">
                                Name
                            </label>
                            <InputCom
                                type="text"
                                name="contact_person_name"
                                placeholder="Enter contact person name."
                                isDefault={false}
                                getValue={formikProps.setFieldValue}
                                defValue={formikProps.values.contact_person_name}
                                error={formikProps.errors.contact_person_name}
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="4">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="profile-image">
                                Email
                            </label>
                            <InputCom
                                type="text"
                                name="contact_person_email"
                                placeholder="Enter contact person email."
                                isDefault={false}
                                getValue={formikProps.setFieldValue}
                                defValue={formikProps.values.contact_person_email}
                                error={formikProps.errors.contact_person_email}
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="4">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="profile-image">
                                Phone No
                            </label>
                            <InputCom
                                type="text"
                                name="contact_person_phone_no"
                                placeholder="Enter contact person phone no."
                                isDefault={false}
                                getValue={formikProps.setFieldValue}
                                defValue={formikProps.values.contact_person_phone_no}
                                error={formikProps.errors.contact_person_phone_no}
                            />
                        </FormGroup>
                    </Col>
                    </Row>
                </Col>
                <Col lg="12">
                        <h6 className="heading-small text-muted mb-4">
                            Location
                        </h6>
                    <Row>
                    <Col lg="12">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="profile-image">
                                Location *
                            </label>
                            <LocationCom
                                getValue={formikProps.setFieldValue}
                                defValue={
                                    formikProps.values.location
                                }
                                error={formikProps.errors.location}
                            />
                        </FormGroup>
                    </Col>
                    </Row>
                </Col>
                <Col lg="12">
                <Button
                    className="float-right"
                    color="primary"
                    type="submit"
                >
                    Update
                </Button>
                </Col>
                </Row>
            </div>
        </Form>
    )}
    </Formik>
    )
}

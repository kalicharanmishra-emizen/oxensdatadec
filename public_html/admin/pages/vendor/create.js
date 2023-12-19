import Admin from "layouts/Admin";
import UserHeader from "components/Headers/UserHeader"
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Row} from "reactstrap";
import InputCom from "components/Form/InputCom";
import FromSelect from "components/Form/FromSelect";
import StatusChnage from "components/Form/StatusChnage";
import LocationCom from "../../components/Form/LocationCom";
import { useEffect, useState } from "react";
import { createVendor } from "reducers/vendorSlice";
import { unSetApiFail, unSetApiSucc } from "reducers/mainSlice";
import { getApiType } from "reducers/categorySlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import NProgress from 'nprogress';
import {Formik} from 'formik';
import * as Yup from 'yup';
function Create() {
    const router=useRouter()
    const [loader, setLoader] = useState(true)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const typeList = useSelector(state => state.categorySlice.typeList)
    const dispatch=useDispatch()
    let formSubmit={
        typeOf:"",
        deliveryType:"",
        assignPOS:"",
        email:"",
        name:"",
        phone_no:"",
        commission:"",
        hygiene_url:"",
        contact_person_name:"",
        contact_person_email:"",
        contact_person_phone_no:"",
        location:{
            address:"",
            lat:"",
            lng:"" 
        },
        status:true
    }
    const validationSchema =Yup.object().shape({
        typeOf: Yup.string()
            .required('Vendor type is required!'),
        deliveryType: Yup.string()
            .required('Delivery type is required!'),
        assignPOS: Yup.string()
            .required('Assign type is required!'),
        email: Yup.string()
            .required('Store email required')
            .email("Email must be a valid email address"),
        name: Yup.string()
            .required('Store name required'),
        phone_no: Yup.string()
            .required('Store phone no. required')
            .matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
        commission: Yup.number()
            .typeError('Must be a number')
            .required('Store commission is required!')
            .min(1,'Commission must be a number between 1 to 100')
            .max(100,'Commission must be a number between 1 to 100'),
        hygiene_url: Yup.string()
            .required('Hygiene url is required')
            .url('Must be a valid url'),
        contact_person_name: Yup.string()
            .required('Contact person name required'),
        contact_person_email: Yup.string()
            .required('Contact person email required')
            .email('Email must be a valid email address'),
        contact_person_phone_no: Yup.string()
            .required('Contact person phone no. required')
            .matches(/^[1-9][0-9]{9,13}$/g,'Phone number is not valid'),
        location:Yup.object().shape({
            address:Yup.string().required('Location is required'),
        }),
    })
    const [alert,setAlert]=useState({
        status:false,
        message:'',
        type:''
    })
    
    
    /* form submit handel start */
        const formSubmitHandal = async (formSubmit) =>{
            // console.log('final data',formSubmit);
            NProgress.start()
            dispatch(createVendor(formSubmit))
        }
    /* form submit handel end */
    if (alert.status) {
        toast(alert.message,{
          type:alert.type
        });
    }
    useEffect(() => {
        if (typeList.length == 1) {
            dispatch(getApiType())
        }
        setLoader(false)
     }, [])
        
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                setAlert({
                    status:true,
                    message:apiSuccess.message,
                    type:'success'
                })
                dispatch(unSetApiSucc())
                NProgress.done()
                router.push('/vendor')
                setTimeout(() => {
                    setAlert({
                        status:false,
                        message:'',
                        type:''
                    })
                }, 3000);
            }
        }
        if (apiError) {
            if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
                setAlert({
                    status:true,
                    message:apiError.message,
                    type:'error'
                })
                dispatch(unSetApiFail())
                NProgress.done()
                setTimeout(() => {
                    setAlert({
                        status:false,
                        message:'',
                        type:''
                    })
                }, 3000);
            }
        }
    }, [apiSuccess,apiError])
    
    return (
        <>
            <UserHeader/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-1" xl="12">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                <Col xs="8">
                                    <h3 className="mb-0">Create Vendor</h3>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                            <Formik
                                initialValues={formSubmit}
                                validationSchema={validationSchema}
                                validateOnChange={false}
                                validateOnBlur={false}
                                onSubmit={ values =>formSubmitHandal(values)}
                            >
                                {(formikProps)=>(
                                    <Form onSubmit={formikProps.handleSubmit}>
                                    <div className="pl-lg-4">
                                        <Row className="align-items-center">
                                            <Col lg="12">
                                                    <h6 className="heading-small text-muted mb-4">Vendor General</h6>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                    >
                                                        Type of Vendor *
                                                    </label>
                                                    {
                                                        !loader?
                                                        <FromSelect
                                                            name="typeOf"
                                                            id="typeOf"
                                                            options={typeList}
                                                            isDefault={false}
                                                            isMulti={false}
                                                            defValue={formikProps.values.typeOf}
                                                            getValue={formikProps.setFieldValue}
                                                            error={formikProps.errors.typeOf}
                                                        />
                                                        :""
                                                    }
                                                    
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                    >
                                                        Delivery Type *
                                                    </label>
                                                    {
                                                        !loader?
                                                        <FromSelect
                                                            name="deliveryType"
                                                            id="deliveryType"
                                                            options={[
                                                                {
                                                                    value:"0",
                                                                    label:"Oxens"
                                                                },
                                                                {
                                                                    value:"1",
                                                                    label:"Self"
                                                                },
                                                            ]}
                                                            isDefault={false}
                                                            isMulti={false}
                                                            defValue={formikProps?.values?.deliveryType.toString() || ""}
                                                            getValue={formikProps.setFieldValue}
                                                            error={formikProps.errors.deliveryType}
                                                        />
                                                        :""
                                                    }
                                                    
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label"> Assign POS * </label>
                                                    {
                                                        !loader
                                                        ? <FromSelect
                                                            name="assignPOS"
                                                            id="assignPOS"
                                                            options={[
                                                                {
                                                                    value:"0",
                                                                    label:"Not Assigned"
                                                                },
                                                                {
                                                                    value:"1",
                                                                    label:"Assigned POS"
                                                                },
                                                            ]}
                                                            isDefault={false}
                                                            isMulti={false}
                                                            defValue={formikProps?.values?.assignPOS.toString() || ""}
                                                            getValue={formikProps.setFieldValue}
                                                            error={formikProps?.errors?.assignPOS}
                                                        />
                                                        : ""
                                                    }
                                                </FormGroup>
                                            </Col>
                                        
                                            <Col lg="4">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Name *
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
                                            <Col lg="4">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Email * <small>(This will be login ID)</small>
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
                                            <Col lg="4">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Phone No *
                                                </label>
                                                    <InputCom
                                                        type="text"
                                                        name="phone_no"
                                                        placeholder="Enter Phone No."
                                                        isDefault={false}
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.phone_no}
                                                        error={formikProps.errors.phone_no}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col lg="6">
                                                <FormGroup>
                                                <label className="form-control-label">
                                                    Commission % <small>(Per order) *</small>
                                                </label>
                                                    <InputCom
                                                        type="number"
                                                        name="commission"
                                                        min={0}
                                                        max={100}
                                                        placeholder="Enter Phone No."
                                                        isDefault={false}
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.commission}
                                                        error={formikProps.errors.commission}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup
                                                    inline 
                                                >
                                                <label className="form-control-label d-block w-100">
                                                    Status
                                                </label>
                                                {
                                                    !loader?
                                                        <StatusChnage
                                                            defValue={formikProps.values.status}
                                                            getValue={formikProps.setFieldValue}
                                                            error={formikProps.errors.status}
                                                        />
                                                    :""
                                                }
                                                </FormGroup>
                                            </Col>
                                            <Col lg="12">
                                                <FormGroup>
                                                <label className="form-control-label d-block w-100">
                                                    Hygiene Url *
                                                </label>
                                                    <InputCom
                                                        type="text"
                                                        name="hygiene_url"
                                                        placeholder="Hygiene Url"
                                                        isDefault={false}
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.hygiene_url}
                                                        error={formikProps.errors.hygiene_url}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <h6 className="heading-small text-muted mb-4">Vendor Contact Preson</h6>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">
                                                        Name *
                                                    </label>
                                                    <InputCom
                                                        type="text"
                                                        name="contact_person_name"
                                                        placeholder="Enter Name"
                                                        isDefault={false}
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.contact_person_name}
                                                        error={formikProps.errors.contact_person_name}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">
                                                        Email *
                                                    </label>
                                                    <InputCom
                                                        type="text"
                                                        name="contact_person_email"
                                                        placeholder="Enter email"
                                                        isDefault={false}
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.contact_person_email}
                                                        error={formikProps.errors.contact_person_email}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">
                                                        Phone No *
                                                    </label>
                                                    <InputCom
                                                        type="text"
                                                        name="contact_person_phone_no"
                                                        placeholder="Enter Phone No."
                                                        isDefault={false}
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.contact_person_phone_no}
                                                        error={formikProps.errors.contact_person_phone_no}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <h6 className="heading-small text-muted mb-4">Vendor Location</h6>
                                            </Col>
                                            <Col lg="12">
                                                <FormGroup>
                                                    <label className="form-control-label">
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
                                        <Row>
                                            <Col lg="12">
                                                <Button
                                                    className="float-right"
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    className="float-right mr-2"
                                                    color="secondary"
                                                    type="button"
                                                    onClick={
                                                        (e)=>{
                                                            e.preventDefault()
                                                            router.back()
                                                        }
                                                    }
                                                >
                                                    Back
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                    </Form>
                                )}
                            </Formik>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>       
        </>
    )
}
Create.layout=Admin;
export default Create

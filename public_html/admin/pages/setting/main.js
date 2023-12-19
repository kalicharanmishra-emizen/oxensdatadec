import Admin from 'layouts/Admin'
import UserHeader from "components/Headers/UserHeader"
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form,FormGroup,Row, Table} from "reactstrap";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMainSetting, updateMainSetting } from '../../reducers/settingSlice';
import { unSetApiFail, unSetApiSucc } from "reducers/mainSlice";
import InputCom from "components/Form/InputCom";
import NProgress from 'nprogress';
import {Formik} from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
function Index() {
    const dispatch = useDispatch()
    const setting = useSelector(state=>state.settingSlice.main);
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const [alert,setAlert]=useState({
        status:false,
        message:'',
        type:''
    })
    useEffect(() => {
        dispatch(getMainSetting());    
    }, []);
    const validationSchema = Yup.object().shape({
        driverWaitTime:Yup.number()
            .typeError('Time must be a number')
            .required('Driver pickup time is required')
            .min(1,'Time must be greater than 1')
            .integer('Time must be a integer'),
        deliveryDis:Yup.number()
            .typeError('distance be a number')
            .required('Delivery distance is required')
            .min(1,'distance must be greater than 1')
            .integer('distance must be a integer'),
        serviceFee:Yup.number()
            .typeError('Service fee must be a number')
            .required('Service fee is required')
            .min(1,'Service fee must be greater than 1')
            .max(100,'Service fee must be less than 100')
            .integer('Time must be a integer'),
        maxServiceFee:Yup.number()
            .typeError('Max service fee must be a number')
            .required('Max service fee is required')
            .min(1,'Max service fee must be greater than 1')
            .integer('Max service fee must be a integer'),
        deliveryDistance:Yup.number()
            .typeError('Delivery distance must be a number')
            .required('Delivery distance is required')
            .min(1,'Delivery distance must be greater than 1'),
        minDeliveryCharge:Yup.number()
            .typeError('Min delivery charge must be a number')
            .required('Min delivery charge is required')
            .positive('Must be a positive number'),
        deliveryExtraFee:Yup.number()
            .typeError('Delivery extra fee must be a number')
            .required('Delivery extra fee is required')
            .positive('Must be a positive number'),
        fixLimitDeliveryDistance:Yup.number()
            .typeError('Min delivery distance must be a number')
            .required('Min delivery distance is required')
            .positive('Must be a positive number'),
        deliveryExtraFeeUnit:Yup.number()
            .typeError('Delivery extra fee unit must be a number')
            .required('Delivery extra fee unit is required')
            .positive('Must be a positive number'),
        vatCharge:Yup.number()
            .typeError('Vat charge must be a number')
            .required('Vat charge is required')
            .min(1,'Vat charge must be greater than 1')
            .integer('Vat charge must be a integer'),
        fixDriverDistance:Yup.number()
            .typeError('Fixed driver distance must be a number')
            .required('Fixed driver distance is required')
            .positive('Must be a positive number'),
        minDriverPayFirst:Yup.number()
            .typeError('Delivery pay must be a number')
            .required('Delivery pay is required')
            .positive('Must be a positive number'),
        extraDriverPaySecond:Yup.number()
            .typeError('Second delivery pay must be a number')
            .required('Second delivery pay is required')
            .positive('Must be a positive number'),
        deliveryExtraPayUnit:Yup.number()
            .typeError('Delivery extra pay unit must be a number')
            .required('Delivery extra pay unit is required')
            .positive('Must be a positive number'),
        deliveryExtraPay:Yup.number()
            .typeError('Delivery extra pay must be a number')
            .required('Delivery extra pay is required')
            .positive('Must be a positive number'),
        taxPay:Yup.number()
            .typeError('Tax must be a number')
            .required('Tax is required')
            .min(1,'Tax must be greater than 1')
            .max(100,'Tax must be less than 100')
            .positive('Must be a positive number')
    })
    const formSubmitHandal = (formData) => {
        // console.log('final data',formData);
        NProgress.start()
        dispatch(updateMainSetting(formData))
    }
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                setAlert({
                    status:true,
                    message:apiSuccess.message,
                    type:'success'
                })
                NProgress.done()
                dispatch(unSetApiSucc())
                setTimeout(() => {
                    setAlert({
                        status:false,
                        message:'',
                        type:''
                    })
                //   dispatch(unSetApiSucc())
                }, 3000);
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
        }
    }, [apiSuccess,apiError])
    if (alert.status) {
        toast(alert.message,{
          type:alert.type
        });
    }
    return (
        <>
            <UserHeader/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-1" xl='12'>
                    <Card className="bg-secondary shadow">
                        <CardHeader className="bg-white border-0">
                            <Row className="align-items-center">
                                <Col xs="12">
                                    <h3 className="mb-0">Main Setting</h3>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Formik
                                enableReinitialize
                                initialValues={setting}
                                validationSchema={validationSchema}
                                validateOnChange={false}
                                validateOnBlur={false}
                                onSubmit={ values =>formSubmitHandal(values)}
                            >
                            {(formikProps)=>(
                                <Form onSubmit={formikProps.handleSubmit}>
                                <div className="pl-lg-4">
                                    <Row className="align-items-center">
                                    <Col lg="6">
                                        <FormGroup>
                                            <label className="form-control-label">Driver Pickup Time (Min)</label>
                                            <InputCom
                                                type="text"
                                                name="driverWaitTime"
                                                placeholder="Driver Pickup Time"
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.driverWaitTime}
                                                error={formikProps.errors.driverWaitTime}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                            <label className="form-control-label">Delivery distance </label>
                                            <InputCom
                                                type="text"
                                                name="deliveryDis"
                                                placeholder="Driver Pickup Time"
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.deliveryDis}
                                                error={formikProps.errors.deliveryDis}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="4">
                                        <FormGroup>
                                            <label className="form-control-label"> Service Fee (%)</label>
                                            <InputCom
                                                type="text"
                                                name="serviceFee"
                                                placeholder="Service Fee"
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.serviceFee}
                                                error={formikProps.errors.serviceFee}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="4">
                                        <FormGroup>
                                            <label className="form-control-label">Max Service Fee (£)</label>
                                            <InputCom
                                                type="text"
                                                name="maxServiceFee"
                                                placeholder="Max Service Fee"
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.maxServiceFee}
                                                error={formikProps.errors.maxServiceFee}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="4">
                                        <FormGroup>
                                            <label className="form-control-label">TAX in % (£)</label>
                                            <InputCom
                                                type="text"
                                                name="taxPay"
                                                placeholder="Tax in %"
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.taxPay}
                                                error={formikProps.errors.taxPay}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="12">
                                        <FormGroup>
                                            <label className="form-control-label">Vat Charge (%)</label>
                                            <InputCom
                                                type="text"
                                                name="vatCharge"
                                                placeholder="Vat Charge"
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.vatCharge}
                                                error={formikProps.errors.vatCharge}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="12">
                                        <h4>
                                            Delivery Fee Settings User
                                            <hr/>
                                        </h4>
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label">Fix limit delivery distance (Miles) </label>
                                                    <InputCom
                                                        type="text"
                                                        name="fixLimitDeliveryDistance"
                                                        placeholder="Fix limit delivery distance"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.fixLimitDeliveryDistance}
                                                        error={formikProps.errors.fixLimitDeliveryDistance}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label">Max Delivery Distance (Miles) </label>
                                                    <InputCom
                                                        type="text"
                                                        name="deliveryDistance"
                                                        placeholder="Delivery Distance"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.deliveryDistance}
                                                        error={formikProps.errors.deliveryDistance}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">Min Delivery Fee (£)</label>
                                                    <InputCom
                                                        type="text"
                                                        name="minDeliveryCharge"
                                                        placeholder="Min Delivery Fee"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.minDeliveryCharge}
                                                        error={formikProps.errors.minDeliveryCharge}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">Extra Delivery Fee Unit (Miles)</label>
                                                    <InputCom
                                                        type="text"
                                                        name="deliveryExtraFeeUnit"
                                                        placeholder="Extra Delivery Fee Unit"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.deliveryExtraFeeUnit}
                                                        error={formikProps.errors.deliveryExtraFeeUnit}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">Extra Delivery Fee (£)</label>
                                                    <InputCom
                                                        type="text"
                                                        name="deliveryExtraFee"
                                                        placeholder="Extra Delivery Fee"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.deliveryExtraFee}
                                                        error={formikProps.errors.deliveryExtraFee}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg="12">
                                        <h4>
                                            Driver Earning Settings
                                            <hr/> 
                                        </h4>
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label">
                                                        Fix Driver Distance For First Order (Miles)
                                                    </label>
                                                    <InputCom
                                                        type="text"
                                                        name="fixDriverDistance"
                                                        placeholder="Fix Driver Distance For First Order"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.fixDriverDistance}
                                                        error={formikProps.errors.fixDriverDistance}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label"> Min driver pay for first order (£) </label>
                                                    <InputCom
                                                        type="text"
                                                        name="minDriverPayFirst"
                                                        placeholder="Min Driver Pay For First Order"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.minDriverPayFirst}
                                                        error={formikProps.errors.minDriverPayFirst}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">Extra Pay For Every Second Order (£)</label>
                                                    <InputCom
                                                        type="text"
                                                        name="extraDriverPaySecond"
                                                        placeholder="Extra Pay For Every Second Order"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.extraDriverPaySecond}
                                                        error={formikProps.errors.extraDriverPaySecond}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">Extra Delivery Pay Unit (Miles)</label>
                                                    <InputCom
                                                        type="text"
                                                        name="deliveryExtraPayUnit"
                                                        placeholder="Extra Delivery Pay Unit"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.deliveryExtraPayUnit}
                                                        error={formikProps.errors.deliveryExtraPayUnit}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                    <label className="form-control-label">Extra Delivery Pay (£)</label>
                                                    <InputCom
                                                        type="text"
                                                        name="deliveryExtraPay"
                                                        placeholder="Extra Delivery Pay"
                                                        getValue={formikProps.setFieldValue}
                                                        defValue={formikProps.values.deliveryExtraPay}
                                                        error={formikProps.errors.deliveryExtraPay}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
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
                        <CardFooter className="py-4">
                               
                        </CardFooter>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
Index.layout = Admin
export default Index;

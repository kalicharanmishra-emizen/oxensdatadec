import Vendor from "layouts/Vendor";
import UserHeader from "components/Headers/UserHeader";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Row } from "reactstrap";
import { Formik } from "formik";
import * as Yup from 'yup'
import { useDispatch, useSelector } from "react-redux";
import InputCom from '../../components/Form/InputCom'
import { useEffect, useState } from "react";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import NProgress from 'nprogress';

import { toast } from "react-toastify";
import { getMainSetting, getStoreDetail, updateMainSetting } from "../../reducers/settingSlice";
function Index() {
    const dispatch = useDispatch()
    const storeDetail = useSelector(state => state.settingSlice.storeDetail)
    const setting = useSelector(state=>state.settingSlice.main);
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const [alert,setAlert]=useState({
        status:false,
        message:'',
        type:''
    })
    useEffect(() => {
        dispatch(getStoreDetail())
    }, []);
    useEffect(() => {
        dispatch(getMainSetting({storeId:storeDetail?.data?._id}));  
    }, [storeDetail])
    
    console.log("setting", setting);
    const validationSchema = Yup.object().shape({
        fixLimitDeliveryDistance:Yup.number()
            .typeError('Min delivery distance must be a number')
            .required('Min delivery distance is required')
            .positive('Must be a positive number'),
        deliveryDistance:Yup.number()
            .typeError('Delivery distance must be a number')
            .required('Delivery distance is required')
            .min(1,'Delivery distance must be greater than 1'),
        minDeliveryCharge:Yup.number()
            .typeError('Min delivery charge must be a number')
            .required('Min delivery charge is required')
            .positive('Must be a positive number'),
        deliveryExtraFeeUnit:Yup.number()
            .typeError('Delivery extra fee unit must be a number')
            .required('Delivery extra fee unit is required')
            .positive('Must be a positive number'),
        deliveryExtraFee:Yup.number()
            .typeError('Delivery extra fee must be a number')
            .required('Delivery extra fee is required')
            .positive('Must be a positive number'),
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
                                <Col xs="8">
                                    <h3 className="mb-0">Delivery Fee Setting</h3>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                { storeDetail?.data?.deliveryType === 0 ? 
                                    <Row className="align-items-center">
                                        <Col xs="12" style={{textAlign:"center"}}>
                                            <p className="mb-0">No data found</p>
                                        </Col>
                                    </Row>
                                    : 
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
                                            <Row>
                                            <Col lg="12">
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <label className="form-control-label">Fix limit delivery distance (Miles) </label>
                                                            <InputCom
                                                                type="text"
                                                                name="fixLimitDeliveryDistance"
                                                                placeholder="Fix limit delivery distance"
                                                                getValue={formikProps.setFieldValue}
                                                                defValue={formikProps?.values?.fixLimitDeliveryDistance}
                                                                error={formikProps?.errors?.fixLimitDeliveryDistance}
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
                                                                defValue={formikProps?.values?.deliveryDistance}
                                                                error={formikProps?.errors?.deliveryDistance}
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
                                                                defValue={formikProps?.values?.minDeliveryCharge}
                                                                error={formikProps?.errors?.minDeliveryCharge}
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
                                                                defValue={formikProps?.values?.deliveryExtraFeeUnit}
                                                                error={formikProps?.errors?.deliveryExtraFeeUnit}
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
                                                                defValue={formikProps?.values?.deliveryExtraFee}
                                                                error={formikProps?.errors?.deliveryExtraFee}
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
                                                    Save
                                                </Button>
                                            </Col>
                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
Index.layout = Vendor
export default Index
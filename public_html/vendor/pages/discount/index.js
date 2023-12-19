import Vendor from "layouts/Vendor";
import UserHeader from "components/Headers/UserHeader";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Row } from "reactstrap";
import { Formik } from "formik";
import * as Yup from 'yup'
import { useDispatch, useSelector } from "react-redux";
import InputCom from '../../components/Form/InputCom'
import FromSelect from '../../components/Form/FromSelect'
import { useEffect, useState } from "react";
import { getDiscount, updateDiscount } from "../../reducers/discountSlice";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import nProgress from "nprogress";
import { toast } from "react-toastify";
function Index() {
    const dispatch = useDispatch()
    const discountData = useSelector(state=>state.discountSlice.list)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const validationSchema = Yup.object().shape({
        discountType: Yup.number().required('Discount Type is required'),
        discountValue:Yup.number().when('discountType',{
                is:0,
                then: Yup.number().typeError('Discount must be a number').required('Discount is required').positive('Discount must be positive number').integer('Discount must be integer number')
        }),
        maxDiscount:Yup.number().typeError('Max Discount must be a number').required('Max Discount is required').positive('Max Discount must be positive number')
    })
    const formSubmitHandal = (formData) =>{
        nProgress.start()
        dispatch(updateDiscount(formData))
    }
    useEffect(()=>{
        dispatch(getDiscount())
    },[])
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                toast(apiSuccess.message,{
                    type:'success',
                    toastId: 12
                });
                dispatch(unSetApiSucc())
                nProgress.done()
            }
        }
        if (apiError) {
            if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
                toast(apiError.message,{
                    type:'error',
                    toastId: 12
                });
                dispatch(unSetApiFail())
                nProgress.done()
            }
        }
    }, [apiSuccess,apiError])

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
                                    <h3 className="mb-0">Discount Manager</h3>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Formik
                                    enableReinitialize
                                    initialValues={discountData}
                                    validationSchema={validationSchema}
                                    validateOnChange={false}
                                    validateOnBlur={false}
                                    onSubmit={ values =>formSubmitHandal(values)}
                                >
                                {(formikProps)=>(
                                    <Form onSubmit={formikProps.handleSubmit}>
                                        <Row>
                                        <Col xl="12">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Discount Type
                                                </label>
                                                <FromSelect
                                                    name="discountType"
                                                    id="discountType"
                                                    options={[
                                                        {
                                                            value:"0",
                                                            label:"Percentage"
                                                        },
                                                        {
                                                            value:"1",
                                                            label:"Fixed"
                                                        },
                                                    ]}
                                                    isDefault={false}
                                                    isMulti={false}
                                                    getValue={formikProps.setFieldValue}
                                                    defValue={formikProps.values.discountType.toString()||''}
                                                    error={formikProps.errors.discountType}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col xl="6">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Discount (%)
                                                </label>
                                                <InputCom
                                                    type="text"
                                                    name="discountValue"
                                                    isDefault={formikProps.values.discountType==1?true:false}
                                                    placeholder="Enter Title"
                                                    getValue={formikProps.setFieldValue}
                                                    defValue={formikProps.values.discountValue}
                                                    error={formikProps.errors.discountValue}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col xl="6">
                                            <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Max Discount Price (£)
                                                </label>
                                                <InputCom
                                                    type="text"
                                                    name="maxDiscount"
                                                    placeholder="Enter max discount"
                                                    getValue={formikProps.setFieldValue}
                                                    defValue={formikProps.values.maxDiscount}
                                                    error={formikProps.errors.maxDiscount}
                                                />
                                            </FormGroup>
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
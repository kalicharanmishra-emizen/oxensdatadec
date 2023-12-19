import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Row} from "reactstrap";
import { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { getOrderSettingDetail, updateOrderSetting } from 'reducers/settingSlice';
import { unSetApiFail, unSetApiSucc } from "reducers/mainSlice";
import Admin from 'layouts/Admin'
import nprogress from 'nprogress';
import { toast } from "react-toastify";
import { useRouter } from 'next/router'
import InputCom from "components/Form/InputCom";
import FromSelect from "components/Form/FromSelect";
import UserHeader from "components/Headers/UserHeader"
import {Formik} from 'formik';
import * as Yup from 'yup';
function Edit() {
    const dispatch = useDispatch()
    const router = useRouter()
    const {id} = router.query
    const [loader, setLoader] = useState(true)
    const detail = useSelector(state=>state.settingSlice.orderDetail)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const [alert,setAlert]=useState({
        status:false,
        message:'',
        type:''
    })
    useEffect(() => {
        if (id!= undefined) {
            dispatch(getOrderSettingDetail({id:id}))
            setLoader(false)
        }
    }, [id])
    /* form submit handel  start */
        let formSubmit = {
            vehicleType:detail.vehicleType,
            maxDistance:detail.maxDistance,
            packageLimit:detail.packageLimit,
        }
        const validationSchema =Yup.object().shape({
            maxDistance: Yup.number().typeError('Must be a number').required('Max Distance is required!').min(1,'Distance must be greater than 1').integer('Distance must be a integer'),
            packageLimit:Yup.array().min(1,'Package limit is required')
        })
        const formSubmitHandal = (formData) => {
            // console.log('final data',formData);
            formData['id'] = id
            nprogress.start()
            dispatch(updateOrderSetting(formData))
        }
    /* form submit handel  end */
    if (alert.status) {
        toast(alert.message,{
          type:alert.type
        });
    }
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                setAlert({
                    status:true,
                    message:apiSuccess.message,
                    type:'success'
                })
                nprogress.done()
                dispatch(unSetApiSucc())
                router.push('/setting/order')
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
                    nprogress.done()
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
                                    <h3 className="mb-0">Order assign setting {detail.vehicleType}</h3>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
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
                                <div className="pl-lg-4">
                                    <Row className="align-items-center">
                                    <Col lg="6">
                                        <FormGroup>
                                            <label className="form-control-label">Vehicle Type</label>
                                            <InputCom
                                                type="text"
                                                name="vehicleType"
                                                placeholder="Vehicle Type"
                                                isDefault={true}
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.vehicleType}
                                                error={formikProps.errors.vehicleType}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                            <label className="form-control-label">Max Distance (Miles)</label>
                                            <InputCom
                                               type="text"
                                               name="maxDistance"
                                               placeholder="Enter Max Distance"
                                               isDefault={false}
                                               getValue={formikProps.setFieldValue}
                                               defValue={formikProps.values.maxDistance||''}
                                               error={formikProps.errors.maxDistance}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="12">
                                        <FormGroup>
                                            <label className="form-control-label">
                                                Package Limit Type
                                            </label>
                                            {
                                                !loader?
                                                <FromSelect
                                                    name="packageLimit"
                                                    id="packageLimit"
                                                    options={[
                                                        {
                                                            value:"small",
                                                            label:"Small"
                                                        },
                                                        {
                                                            value:"medium",
                                                            label:"Medium"
                                                        },
                                                        {
                                                            value:"large",
                                                            label:"Large"
                                                        }
                                                    ]}
                                                    isDefault={false}
                                                    isMulti={true}
                                                    defValue={formikProps.values.packageLimit}
                                                    getValue={formikProps.setFieldValue}
                                                    error={formikProps.errors.packageLimit}
                                                />
                                                :""
                                            }
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
  );
}
Edit.layout = Admin;
export default Edit;


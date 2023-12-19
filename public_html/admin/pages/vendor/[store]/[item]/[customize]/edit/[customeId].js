import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Admin from "layouts/Admin";
import UserHeader from 'components/Headers/UserHeader';
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Input,Row} from "reactstrap";
import validator from 'validator';
import { toast } from "react-toastify";
import InputCom from "components/Form/InputCom";
import FromSelect from "components/Form/FromSelect";
import StatusChnage from "components/Form/StatusChnage";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import { updateCustome,getCustomeList, detailCustomize } from "reducers/menuSlice";
import {Formik} from 'formik';
import * as Yup from 'yup';
function Edit() {
    const router=useRouter()
    const routeData = router.query
    const {store,item,customize,customeId} =router.query
    const dispatch=useDispatch()
    const [loader, setLoader] = useState(true)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const custome = useSelector(state => state.menuSlice.custome)
    const costomDetails = useSelector(state => state.menuSlice.costomDetails)
    const [customeList, setcustomeList] = useState(null)
    const [details, setDetails] = useState(null)
    let formSubmit={
        title:costomDetails?costomDetails.title:"",
        status:costomDetails?costomDetails.status:true,
        is_multiple:costomDetails?costomDetails.is_multiple?"1":"0":"0",
        is_dependent:costomDetails?costomDetails.is_dependent?"1":"0":"0",
        dependent_with:costomDetails?costomDetails.dependent_with?costomDetails.dependent_with:"":"",
        max_multiple:costomDetails?costomDetails.max_multiple:""
    }
    const validationSchema =Yup.object().shape({
        title: Yup.string().required('Title is required!'),
        max_multiple: Yup.number().typeError('Max limit must be a valid number').positive()
        .nullable(true).transform((_, val) => val === val ? val : null),
        is_multiple: Yup.string().required('is_multiple is required!'),
        is_multiple: Yup.string().required('is_multiple is required!'),
        is_dependent: Yup.string().required('is_dependent is required!'),
        dependent_with: Yup.string().when("is_dependent",{
            is:"1",
            then: Yup.string().required("dependent_with is required!")
        }),
    })
    const formSubmitHandal = async (formData) =>{
            let finalData = {...formData}
            finalData['dependent_with'] = (finalData['dependent_with']=='empty')?null:finalData['dependent_with']
            finalData['itemId'] =  customize
            finalData['cusId'] =   customeId
            // console.log('final data',finalData);
            dispatch(updateCustome(finalData))
    }
    useEffect(() => {
        if (customize!=undefined) {
            if (custome.length==0) {
                dispatch(getCustomeList({itemId:customize}))
            }
        }
        if (customeId!=undefined) {
            if (!costomDetails) {
                dispatch(detailCustomize({cusId:customeId}))
            }
        }
        setLoader(false)
    }, [customize,customeId])
    useEffect(() => {
        let listData=[{
            value:'empty',
            label:'Select Dependent Item'
        }]
        custome.map(data=>{
            if (!data.is_multiple) {
                listData.push({
                    value:data._id,
                    label:data.title
                })
            }
        })
        setcustomeList(listData)
    }, [custome])
    // useEffect(() => {
    //     if (costomDetails) {
    //         setDetails(costomDetails)
    //     }
    // }, [costomDetails])
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                toast(apiSuccess.message,{
                    type:'success',
                    toastId: 12
                });
                setLoader(false)
                router.push(`/vendor/${store}/${item}/${customize}`)
                dispatch(unSetApiSucc())
            }
        }
        if (apiError) {
            if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
                toast(apiError.message,{
                    type:'error',
                    toastId: 12
                });
                setLoader(false)
                dispatch(unSetApiFail())
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
                                    <h3 className="mb-0">Edit Custome Item</h3>
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
                                    <Col lg="12">
                                        <FormGroup>
                                        <label
                                            className="form-control-label"
                                        >
                                            Title
                                        </label>
                                            <InputCom
                                                type="text"
                                                name="title"
                                                placeholder="Enter Title"
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.title}
                                                error={formikProps.errors.title}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                        <label
                                            className="form-control-label"
                                        >
                                            Is Multiple 
                                        </label>
                                        {!loader?
                                            <FromSelect
                                                name="is_multiple"
                                                id="is_multiple"
                                                options={[
                                                    {
                                                        value:"0",
                                                        label:"No"
                                                    },
                                                    {
                                                        value:"1",
                                                        label:"Yes"
                                                    },
                                                ]}
                                                isDefault={true}
                                                isMulti={false}
                                                defValue={formikProps.values.is_multiple}
                                                getValue={formikProps.setFieldValue}
                                                error={formikProps.errors.is_multiple}
                                                // submitValidate={submitValidate}
                                            />
                                        :""}
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                        <label
                                            className="form-control-label"
                                        >
                                            Max Limit Multiple 
                                        </label>
                                            <InputCom
                                                type="text"
                                                name="max_multiple"
                                                placeholder="Enter max limit of multiselect"
                                                isDefault={true}
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.max_multiple}
                                                error={formikProps.errors.max_multiple}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                        <label
                                            className="form-control-label"
                                        >
                                           Is Dependent 
                                        </label>
                                        {!loader?
                                            <FromSelect
                                                name="is_dependent"
                                                id="is_dependent"
                                                options={[
                                                    {
                                                        value:"0",
                                                        label:"No"
                                                    },
                                                    {
                                                        value:"1",
                                                        label:"Yes"
                                                    },
                                                ]}
                                                isDefault={true}
                                                isMulti={false}
                                                defValue={formikProps.values.is_dependent}
                                                getValue={formikProps.setFieldValue}
                                                error={formikProps.errors.is_dependent}
                                            />
                                        :""}
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                        <label
                                            className="form-control-label"
                                        >
                                           Dependent With 
                                        </label>
                                        {!loader?
                                            <FromSelect
                                                name="dependent_with"
                                                id="dependent_with"
                                                options={customeList?customeList:[
                                                    {
                                                        value:'empty',
                                                        label:"Select Customization"
                                                    }
                                                ]}
                                                isDefault={true}
                                                isMulti={false}
                                                defValue={formikProps.values.dependent_with}
                                                getValue={formikProps.setFieldValue}
                                                error={formikProps.errors.dependent_with}
                                            />
                                        :""}
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup
                                            inline
                                        >
                                        <label
                                            className="form-control-label d-block w-100"
                                        >
                                            Status
                                        </label>
                                            <StatusChnage
                                                defValue={formikProps.values.status}
                                                getValue={formikProps.setFieldValue}
                                                error={formikProps.errors.status}
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
Edit.layout = Admin
export default Edit

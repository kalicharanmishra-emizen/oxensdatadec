import { useEffect,useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Vendor from 'layouts/Vendor';
import UserHeader from 'components/Headers/UserHeader';
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Row} from "reactstrap";
import { toast } from "react-toastify";
import InputCom from "components/Form/InputCom";
import FromSelect from "components/Form/FromSelect";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import { updateCustomeVarient,VarientDependent,detailCustomizeVarient } from "reducers/menuSlice";
import {Formik,FieldArray} from 'formik';
import * as Yup from 'yup';
function Edit() {
    const router=useRouter()
    const dispatch=useDispatch()
    const {item,customize,varient,vareintId} =router.query
    const [selectDependent, setSelectDependent] = useState([])
    const [depPrice, setDepPrice] = useState([])
    const [depPricesList, setDepPricesList] = useState({})
    const [depValSchema,setDepValSchema] = useState({})
    const [loader, setLoader] = useState(true)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const variantDapendancyDetails = useSelector(state=> state.menuSlice.variantDapendancyDetails)
    const costomDetailsVariant = useSelector(state=> state.menuSlice.costomDetailsVariant)
    const [dependentList, setDependentList] = useState([])
    /* form submit handel start */
    let formSubmit={
        showDep:variantDapendancyDetails?variantDapendancyDetails.is_dependent:false,
        title:costomDetailsVariant?costomDetailsVariant.title:'',
        isDefault:costomDetailsVariant?costomDetailsVariant.isDefault?"1":"0":'0',
        price:costomDetailsVariant?costomDetailsVariant.price:"",
        dependent_varient:selectDependent,
        dependent_price_temp:depPricesList
    }
    const validationSchema =Yup.object().shape({
        title: Yup.string().required('Title is required!'),
        isDefault: Yup.string().required('Title is required!'),
        price: Yup.number().typeError('Price must be a valid number').when("showDep",{
            is:false,
            then: Yup.number().required("Price is required!")
        }),
        dependent_varient: Yup.array().when("showDep",{
            is:true,
            then: Yup.array().min(1,"Dependent Varient is required!")
        }),
        dependent_price_temp:Yup.object().when("dependent_varient",{
            is:(dependent_varient)=>dependent_varient.length>0,
            then: Yup.object().shape(depValSchema)
        })
    })
    const formSubmitHandal = async (formData) =>{
        // console.log('final data before submit',formData);
            let finalData = {
                varId:vareintId,
                customizeId:varient,
                title:formData.title,
                isDefault:formData.isDefault,
                price:formData.price||'0.00'
            }
            var dependent_price=[]
            Object.keys(formData.dependent_price_temp).map(temp=>{
                let depP =depPrice.find(list=>list.key==temp)
                // console.log('depP',depP);
                if (depP!=undefined) {
                    dependent_price.push({
                        varientId:depP.key,
                        title:depP.title,
                        price:formData.dependent_price_temp[temp]
                    })    
                }
            })
            // if (depPrice.length > 0 ) {
            //     depPrice.map(Dp=>{
            //         if(`dependent_price_temp[${Dp.key}]` in formSubmit){
            //             dependent_price.push({
            //                 varientId:Dp.key,
            //                 title:Dp.title,
            //                 price:formSubmit[`dependent_price_temp[${Dp.key}]`]
            //             })
            //         }
            //     })
            // }
            finalData.dependent_price=dependent_price
            // console.log('final data',finalData);
            dispatch(updateCustomeVarient(finalData))
    }
    /* form submit handel end */
    useEffect(() => {
        if (varient!= undefined && vareintId!=undefined) {
            dispatch(VarientDependent({cusId:varient}))
            dispatch(detailCustomizeVarient({varId:vareintId}))
            setLoader(false) 
        }
    }, [varient,vareintId])
    useEffect(() => {
        if (costomDetailsVariant) {
            let selectDep=[]
            let priceList={}
            costomDetailsVariant.dependent_price.map(data=>{
                priceList[data.varientId]=data.price
                selectDep.push(data.varientId)
            })
            setDepPricesList(priceList)
            setSelectDependent(selectDep)
        }
    }, [costomDetailsVariant])
    useEffect(() => {
        if (variantDapendancyDetails) {
            if (variantDapendancyDetails.is_dependent) {
                let depList = []
                variantDapendancyDetails.dependent.varients.map(data=>{
                    depList.push({
                        value:data._id,
                        label:data.title
                    })
                })            
                setDependentList(depList)
            }
        }
    }, [variantDapendancyDetails])
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                toast(apiSuccess.message,{
                    type:'success',
                    toastId: 12
                });
                dispatch(unSetApiSucc())
                router.push(`/menu/${item}/${customize}/${varient}`)
            }
        }
        if (apiError) {
            if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
                toast(apiError.message,{
                    type:'error'
                });
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
                                    <h3 className="mb-0">{variantDapendancyDetails?variantDapendancyDetails.title:'Item'} Custome Variant Edit </h3>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                            {loader?null:
                            <Formik
                                enableReinitialize
                                initialValues={formSubmit}
                                validationSchema={validationSchema}
                                validateOnChange={false}
                                validateOnBlur={false}
                                onSubmit={ values =>formSubmitHandal(values)}
                            >
                            {(formikProps)=>{
                                useEffect(()=>{
                                    let selectDependent = formikProps.values.dependent_varient
                                    if (typeof selectDependent ==='object') {
                                        var tempArray=[]
                                        selectDependent.map(list=>{
                                            depValSchema[list]= Yup.number().typeError('Price must be a valid number').required("Price is required")
                                            tempArray.push({
                                                key:list,
                                                title:dependentList?.find(data=>{return data.value==list}).label
                                            })
                                        })
                                        setDepPrice(tempArray)
                                        setDepValSchema({...depValSchema})
                                    }
                                },[formikProps.values.dependent_varient])
                                return(
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
                                            Is Default 
                                        </label>
                                        {!loader?
                                            <FromSelect
                                                name="isDefault"
                                                id="isDefault"
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
                                                isDefault={false}
                                                isMulti={false}
                                                getValue={formikProps.setFieldValue}
                                                defValue={formikProps.values.isDefault}
                                                error={formikProps.errors.isDefault}
                                            />
                                        :""}
                                        </FormGroup>
                                    </Col>
                                        {variantDapendancyDetails?
                                        !variantDapendancyDetails.is_dependent?
                                                <Col lg="6">
                                                    <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                    >
                                                        Price
                                                    </label>
                                                        <InputCom
                                                            type="text"
                                                            name="price"
                                                            placeholder="Enter Price of Variant"
                                                            getValue={formikProps.setFieldValue}
                                                            defValue={formikProps.values.price}
                                                            error={formikProps.errors.price}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                :
                                                <>
                                                <Col lg="6">
                                                    <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                    >
                                                    {variantDapendancyDetails.dependent.title} Varient's 
                                                    </label>
                                                    
                                                    {!loader?
                                                        <FromSelect
                                                            name="dependent_varient"
                                                            id="dependent_varient"
                                                            options={dependentList}
                                                            isDefault={false}
                                                            isMulti={true}
                                                            getValue={formikProps.setFieldValue}
                                                            defValue={formikProps.values.dependent_varient}
                                                            error={formikProps.errors.dependent_varient}
                                                        />
                                                    :""}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                <Row>
                                                <FieldArray
                                                    name='dependent_price_temp'
                                                    render={()=>(
                                                        depPrice.map((priceList,key)=>(
                                                            <Col lg="6" key={key}>
                                                            <FormGroup>
                                                                <label
                                                                    className="form-control-label"
                                                                >
                                                                {priceList.title} Varient Price
                                                                </label>
                                                                <InputCom
                                                                    type="text"
                                                                    name={`dependent_price_temp[${priceList.key}]`}
                                                                    placeholder='Enter Price'
                                                                    getValue={formikProps.setFieldValue}
                                                                    defValue={formikProps.values.dependent_price_temp[`${priceList.key}`]}
                                                                    error={formikProps.errors.dependent_price_temp?formikProps.errors.dependent_price_temp[`${priceList.key}`]:null}
                                                                />
                                                            </FormGroup>
                                                            </Col>
                                                        ))
                                                    )}
                                                />
                                                </Row>
                                                </Col>
                                                </>
                                            :''
                                        }
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
                            )}}
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
Edit.layout = Vendor
export default Edit

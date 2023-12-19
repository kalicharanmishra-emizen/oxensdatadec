import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Vendor from 'layouts/Vendor';
import UserHeader from 'components/Headers/UserHeader';
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Input,Row } from "reactstrap";
import { toast } from "react-toastify";
import InputCom from "components/Form/InputCom";
import FromSelect from "components/Form/FromSelect";
import StatusChnage from "components/Form/StatusChnage";
import { getItemDetail, getCategoryList, updateItems } from "reducers/menuSlice";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import nProgress from "nprogress";
import { Formik } from "formik";
import * as Yup from 'yup'
function Edit() {
    const router=useRouter()
    const dispatch=useDispatch()
    const {item,itemId} = router.query
    const [loader, setLoader] = useState(true)
    const [categoryListState, setcategoryListState] = useState(null)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const itemsDetails = useSelector(state => state.menuSlice.itemDetail)
    const categoryList =  useSelector(state => state.menuSlice.categoryList)
    const [itemImg, setItemImg] = useState(null)
    /* form submit handel start */
    // const badges = [1,2,3,4,5]
    // const seletBadge = badges.includes(itemsDetails?.badge) ? itemsDetails?.badge : "0"
    const formSubmit = {
        category:itemsDetails?itemsDetails.category:"",
        age_res:itemsDetails?itemsDetails.age_res?'1':'0':"0",
        is_customize:itemsDetails?itemsDetails.is_customize?'1':'0':"0",
        title:itemsDetails?itemsDetails.title:"",
        price:itemsDetails?itemsDetails.price:"",
        description:itemsDetails?itemsDetails.description:"",
        status:itemsDetails?itemsDetails.status:"",
        badge:itemsDetails?itemsDetails?.badge ?? "0":"0"
    }
    const validationSchema =Yup.object().shape({
        category: Yup.string().required('Category is required!'),
        age_res: Yup.string().required('Age restriction is required!'),
        is_customize: Yup.string().required('Customize is required!'),
        title:Yup.string().required('Item title required'),
        price: Yup.number().when("is_customize",{
            is:"0",
            then: Yup.number().typeError('Must be number').required("Price is required!").positive('Price must be a positive number')
        }),
        status:Yup.boolean().required("Status is required")
    })
    const formSubmitHandal = async (value) =>{
        let convertFormData= new FormData();
        convertFormData.append('itemId',itemId)
        Object.keys(value).forEach(key=>{
            convertFormData.append(key,value[key])
        })
        if (itemImg) {
            convertFormData.append('item_img',itemImg)
        }
        nProgress.start();
        dispatch(updateItems(convertFormData))
    }

    /* form submit handel end */
    const imgUpload = (e) =>{
        setItemImg(e.target.files[0])
    }

    const contactToAdming = () => {
        Swal.fire('Activate your item please contact to admin for aprovel')
    }

    useEffect(() => {
        if(itemId != undefined){
            dispatch(getCategoryList())
            dispatch(getItemDetail({itemId:itemId}))
            setLoader(false)
        }
    }, [itemId])
    useEffect(() => {
        let rowCategory =[
            {
                value:'empty',
                label:"Select Category"
            }
        ];
        categoryList.map(data=>{
            rowCategory.push(
                {
                    value:data._id,
                    label:data.title
                }
            )
        })
        setcategoryListState(rowCategory)
    }, [categoryList])
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                toast(apiSuccess.message,{
                    type:'success',
                    toastId: 12
                });
                dispatch(unSetApiSucc())
                router.push(`/menu/${item}`)
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

    console.log("itemsDetails", itemsDetails);
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
                                    <h3 className="mb-0">Edit Item</h3>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Formik
                                    validateOnChange={false}
                                    validateOnBlur={false}
                                    enableReinitialize
                                    initialValues={formSubmit}
                                    validationSchema={validationSchema}
                                    onSubmit={ formSubmitHandal }
                                >
                                {
                                formProps=>(
                                    <Form onSubmit={formProps.handleSubmit}>
                                        <div className="pl-lg-4">
                                            <Row className="align-items-center">
                                            <Col lg="6">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Category *
                                                </label>
                                                {!loader?
                                                <FromSelect
                                                    name="category"
                                                    id="category"
                                                    options={categoryListState?categoryListState:[{
                                                        value:'empty',
                                                        label:"Select Category"
                                                    }]}
                                                    isDefault={false}
                                                    isMulti={false}
                                                    defValue={formProps.values.category}
                                                    getValue={formProps.setFieldValue}
                                                    error={formProps.errors.category}
                                                />
                                                :""}
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Age Restrictions *
                                                </label>
                                                {!loader?
                                                    <FromSelect
                                                        name="age_res"
                                                        id="age_res"
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
                                                        defValue={formProps.values.age_res}
                                                        getValue={formProps.setFieldValue}
                                                        error={formProps.errors.age_res}
                                                    />
                                                :""}
                                                </FormGroup>
                                            </Col>
                                            <Col lg="3">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Customize *
                                                </label>
                                                {!loader?
                                                    <FromSelect
                                                        name="is_customize"
                                                        id="is_customize"
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
                                                        defValue={formProps.values.is_customize}
                                                        getValue={formProps.setFieldValue}
                                                        error={formProps.errors.is_customize}
                                                    />
                                                :""}
                                                </FormGroup>
                                            </Col>
                                            <Col lg="3">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Badge 
                                                </label>
                                                {!loader?
                                                    <FromSelect
                                                        name="badge"
                                                        // id="is_customize" new, Bestseller, trending, New Arrival, Popular, Featured
                                                        options={[
                                                            {
                                                                value:"0",
                                                                label:"Select badge"
                                                            },
                                                            {
                                                                value:"1",
                                                                label:"New Arrival"
                                                            },
                                                            {
                                                                value:"2",
                                                                label:"Bestseller"
                                                            },
                                                            {
                                                                value:"3",
                                                                label:"Featured"
                                                            },
                                                            {
                                                                value:"4",
                                                                label:"Popular"
                                                            },
                                                            {
                                                                value:"5",
                                                                label:"Trending"
                                                            },
                                                        ]}
                                                        isDefault={false}
                                                        isMulti={false}
                                                        defValue={formProps.values.badge.toString()}
                                                        getValue={formProps.setFieldValue}
                                                        error={formProps.errors.badge}
                                                    />
                                                :""}
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Title *
                                                </label>
                                                <InputCom
                                                    type="text"
                                                    name="title"
                                                    placeholder="Enter Title"
                                                    getValue={formProps.setFieldValue}
                                                    defValue={formProps.values.title}
                                                    error={formProps.errors.title}
                                                />
                                                </FormGroup>
                                            </Col>
                                            
                                            <Col lg="6">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Price (* when customize is no)
                                                </label>
                                                <InputCom
                                                    type="text"
                                                    name="price"
                                                    placeholder="Enter Price"
                                                    getValue={formProps.setFieldValue}
                                                    defValue={formProps.values.price}
                                                    error={formProps.errors.price}
                                                />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label d-block w-100"
                                                >
                                                    Item Image *
                                                </label>
                                                    <Input
                                                        type="file"
                                                        className="form-control-alternative"
                                                        name="item_img"
                                                        id="item_img"
                                                        onChange={imgUpload}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="2">
                                                <FormGroup>
                                                    <img
                                                        src={itemImg?URL.createObjectURL(itemImg):itemsDetails?.item_img}
                                                        className="m-2"
                                                        alt="preview image"
                                                        width="100"
                                                        height="80"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup inline >
                                                    <label className="form-control-label d-block w-100">
                                                        Status
                                                    </label>
                                                    {/* {
                                                        itemsDetails?.aprovedByAdmin === false ? 
                                                        <span style={{background:"rgba(211, 255, 186, 0.2)", padding: "10px 25px", cursor:"pointer", color:"red", position:"absolute", zIndex:"1", backdropFilter:"blur(2px)"}}> 
                                                            contact to admin for activation 
                                                        </span> 
                                                        : ""
                                                    }, */}
                                                    {
                                                        itemsDetails?.aprovedByAdmin === true ?
                                                            !loader ?
                                                            <StatusChnage
                                                                defValue={formProps.values.status}
                                                                getValue={formProps.setFieldValue}
                                                                error={formProps.errors.status}
                                                            />
                                                            : ""
                                                        : <span style={{background:"white", boxShadow:"#d9d9d9 0px 1px 1px 1px", color:"red", padding:"10px 20px", cursor:"pointer"}} onClick={contactToAdming}>contact to admin for activtion</span>
                                                    }
                                                </FormGroup>
                                            </Col>
                                            <Col lg="12">
                                                <FormGroup>
                                                <label
                                                    className="form-control-label"
                                                >
                                                    Description *
                                                </label>
                                                <InputCom
                                                    type="textarea"
                                                    name="description"
                                                    placeholder="Enter description"
                                                    getValue={formProps.setFieldValue}
                                                    defValue={formProps.values.description}
                                                    error={formProps.errors.description}
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
Edit.layout = Vendor
export default Edit

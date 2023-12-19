import Admin from 'layouts/Admin'
import UserHeader from "components/Headers/UserHeader"
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Row} from "reactstrap";
import validator from 'validator';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormInputCom from "components/Form/FormInputCom";
import { getApiType ,createCategory} from 'reducers/categorySlice';
import { unSetApiFail, unSetApiSucc } from "reducers/mainSlice";
import FromInputSelect from 'components/Form/FromInputSelect';
import NProgress from 'nprogress';
// import FormStatusChnage from "components/Form/FormStatusChnage";
function Create() {
    const router=useRouter()
    const [formSubmit, setFormSubmit] = useState({
        type:'',
        title:''
    })
    const [loader, setLoader] = useState(true)
    const [submitValidate, setsubmitValidate] = useState(false)
    const [confirmValidate, setConfirmValidate] = useState({})
    const [confirmValidateStatus, setConfirmValidateStatus] = useState(false)
    const [alert,setAlert]=useState({
        status:false,
        message:'',
        type:''
    })
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const typeList = useSelector(state => state.categorySlice.typeList)
    const dispatch=useDispatch()
    /* form submit handel start */
        const getValue=(data)=>{
            formSubmit[data.key]=data.data
            confirmValidate[data.key]=data.error
            setConfirmValidate({...confirmValidate})
            setFormSubmit({...formSubmit})
            setsubmitValidate(false)
        }
        const formSubmitHandal = async (e) =>{
            e.preventDefault()
            setsubmitValidate(true)
            if(confirmValidateStatus){
                console.log('final data',formSubmit);
                // setLoader(true)
                NProgress.start()
                dispatch(createCategory(formSubmit))
            }
        }
        useEffect(() => {
            let something = true
            if (Object.keys(confirmValidate).length == 2) {
                for (const key in confirmValidate) {
                    if (!(!confirmValidate[key])) {
                        something = false
                        setConfirmValidateStatus(false)
                    }
                }
                if(something){
                    setConfirmValidateStatus(true)
                }
            }
        }, [confirmValidate])
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
                router.push('/category')
                setTimeout(() => {
                    setAlert({
                        status:false,
                        message:'',
                        type:''
                    })
                //   dispatch(unSetApiSucc())
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
                                    <h3 className="mb-0">Create Category</h3>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={formSubmitHandal}>
                                <div className="pl-lg-4">
                                    <Row className="align-items-center">
                                    <Col lg="6">
                                    <FormGroup>
                                        <label
                                            className="form-control-label"
                                        >
                                            Type of Category
                                        </label>
                                        {!loader?
                                            <FromInputSelect
                                                id="type"
                                                name="type"
                                                options={typeList}
                                                validation={
                                                    {
                                                        required:true,
                                                        limit:null
                                                    }
                                                }
                                                isDefault={false}
                                                isMulti={false}
                                                getValue={getValue}
                                                defValue={formSubmit.type}
                                                submitValidate={submitValidate}
                                            />
                                        :""}
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                        <label
                                            className="form-control-label"
                                        >
                                            Title
                                        </label>
                                            <FormInputCom
                                                type="text"
                                                name="title"
                                                placeholder="Enter Title"
                                                optionData={[]}
                                                validator={
                                                    [
                                                        {
                                                            property:validator.isEmpty,
                                                            message:"Category title required",
                                                            isNot:false
                                                        },
                                                    ]
                                                }
                                                getValue={getValue}
                                                defValue={formSubmit.title}
                                                submitValidate={submitValidate}
                                            />
                                        </FormGroup>
                                    </Col>
                                    {/* <Col lg="6">
                                        <FormGroup
                                            inline 
                                        >
                                        <label className="form-control-label d-block w-100">
                                            Status
                                        </label>
                                            <FormStatusChnage
                                                defValue={true}
                                                getValue={getValue}
                                                submitValidate={submitValidate}
                                            />
                                        </FormGroup>
                                    </Col> */}
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

Create.layout = Admin
export default Create
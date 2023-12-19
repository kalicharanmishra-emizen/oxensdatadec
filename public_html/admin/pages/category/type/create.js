import Admin from 'layouts/Admin'
import UserHeader from "components/Headers/UserHeader"
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Row} from "reactstrap";
import validator from 'validator';
import { useEffect, useState } from "react";
import { unSetApiFail, unSetApiSucc } from "reducers/mainSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormInputCom from "components/Form/FormInputCom";
import FormStatusChnage from "components/Form/FormStatusChnage";
function Create() {
    const router=useRouter()
    const [formSubmit, setFormSubmit] = useState({})
    const [submitValidate, setsubmitValidate] = useState(false)
    const [confirmValidate, setConfirmValidate] = useState({})
    const [confirmValidateStatus, setConfirmValidateStatus] = useState(false)
    const [alertStaus,setalertStatus]=useState(false)
    const [alertMessage,setalertMessage]=useState('')
    const [alertType,setalertType]=useState('')
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const dispatch=useDispatch()
    const getValue=(data)=>{
        formSubmit[data.key]=data.data
        confirmValidate[data.key]=data.error
        setConfirmValidate({...confirmValidate})
        setFormSubmit({...formSubmit})
    }
    const submitHandler = () =>{
        setsubmitValidate(true)
    }
    const formSubmitHandal = async (e) =>{
        e.preventDefault()
        await submitHandler()
        setsubmitValidate(false)
        if(confirmValidateStatus){
            console.log('final data',formSubmit);
        //    dispatch(createVendor(formSubmit))
        }
    }
    if (alertStaus) {
        toast(alertMessage,{
          type:alertType
        });
    }

    useEffect(() => {
        if (apiError) {
            if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
                setalertStatus(true)
                setalertMessage(apiError.message);
                setalertType('error')
                setTimeout(() => {
                  setalertStatus(false)
                  setalertMessage('')
                  setalertType('')
                  dispatch(unSetApiFail())
                }, 3000);
            }
        }
    }, [apiError])
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                setalertStatus(true)
                setalertMessage(apiSuccess.message);
                setalertType('success')
                router.push('/category/type')
                setTimeout(() => {
                  setalertStatus(false)
                  setalertMessage('')
                  setalertType('')
                  dispatch(unSetApiSucc())
                }, 3000);
            }
        }
    }, [apiSuccess])
    useEffect(() => {
        let something = true
        if (Object.keys(confirmValidate).length !== 0 && Object.keys(confirmValidate).length == 2) {
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
                                            Email
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
                                                            message:"Vendor Email required",
                                                            isNot:false
                                                        },
                                                    ]
                                                }
                                                getValue={getValue}
                                                defValue=''
                                                submitValidate={submitValidate}
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
                                            <FormStatusChnage
                                                defValue={true}
                                                getValue={getValue}
                                                submitValidate={submitValidate}
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

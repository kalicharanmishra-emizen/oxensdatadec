import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Vendor from 'layouts/Vendor';
import UserHeader from 'components/Headers/UserHeader';
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Row} from "reactstrap";
import validator from 'validator';
import { toast } from "react-toastify";
import FormInputCom from "components/Form/FormInputCom";
import Loader from 'components/ApiLoader/loader';
import { createCategory } from "reducers/menuSlice";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import nProgress from "nprogress";

function Create() {
    const router=useRouter()
    const [loader, setLoader] = useState(false)
    const [submitValidate, setsubmitValidate] = useState(false)
    const [confirmValidate, setConfirmValidate] = useState({})
    const [confirmValidateStatus, setConfirmValidateStatus] = useState(false)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const [formSubmit, setFormSubmit] = useState({
        title:""
    })
    const dispatch=useDispatch()
    /* form Submit Handel Start */
    const getValue=(data)=>{
        formSubmit[data.key]=data.data
        confirmValidate[data.key]=data.error
        setConfirmValidate({...confirmValidate})
        setFormSubmit({...formSubmit})
        setsubmitValidate(false)
    }
    const formSubmitHandal = (e) =>{
        e.preventDefault()
        setsubmitValidate(true)
        if(confirmValidateStatus){
            nProgress.start()
            dispatch(createCategory(formSubmit))
        }
    }
    useEffect(() => {
        let something = true
        if (Object.keys(confirmValidate).length == 1) {
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
    /* form Submit Handel end */
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                toast(apiSuccess.message,{
                    type:'success',
                    toastId: 12
                });
                dispatch(unSetApiSucc())
                nProgress.done()
                router.push('/menu')
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
                                    <Col lg="12">
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
Create.layout = Vendor
export default Create

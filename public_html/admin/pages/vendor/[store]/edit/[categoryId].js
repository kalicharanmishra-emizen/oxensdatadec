import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import UserHeader from 'components/Headers/UserHeader';
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Row} from "reactstrap";
import validator from 'validator';
import { toast } from "react-toastify";
import FormInputCom from "components/Form/FormInputCom";
import Loader from 'components/ApiLoader/loader';
import { updateCategory,getCategoryDetails } from "reducers/menuSlice";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import nProgress from "nprogress";
import Admin from "layouts/Admin";

function Edit() {
    const router=useRouter()
    const {store, categoryId} = router.query
    const [loader, setLoader] = useState(false)
    const [submitValidate, setsubmitValidate] = useState(false)
    const [confirmValidate, setConfirmValidate] = useState({})
    const [confirmValidateStatus, setConfirmValidateStatus] = useState(false)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const categoryDetails = useSelector(state => state.menuSlice.categoryDetail)
    const [formSubmit, setFormSubmit] = useState({})
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
                // console.log('final data',formSubmit);
                formSubmit['id'] = categoryId
                nProgress.start()
                dispatch(updateCategory(formSubmit))
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
    /* form submit handel end */
    useEffect(() => {
        if(categoryId != undefined){
            dispatch(getCategoryDetails({id:categoryId}))
        }
    }, [categoryId])
    useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
                toast(apiSuccess.message,{
                    type:'success',
                    toastId: 12
                });
                dispatch(unSetApiSucc())
                nProgress.done()
                router.push(`/vendor/${store}`)
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
                                    <h3 className="mb-0">Edit Category</h3>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {loader?
                                    <Loader/>
                                :
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
                                                defValue={categoryDetails?categoryDetails.title:''}
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
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
Edit.layout=Admin
export default Edit

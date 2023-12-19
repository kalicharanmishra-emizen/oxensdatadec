import Admin from 'layouts/Admin'
import UserHeader from "components/Headers/UserHeader"
import { Button, Card, CardBody, CardHeader, Col, Container, Form,FormGroup,Row} from "reactstrap";
import { useEffect, useState } from 'react';
import validator from 'validator';
import FormInputCom from "components/Form/FormInputCom";
import FormCKEditor from '../../components/Form/FormCKEditor';
import { getDetail, updateCms } from '../../reducers/cmsSlice';
import { unSetApiFail, unSetApiSucc } from "reducers/mainSlice";
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import nprogress from 'nprogress';

function Cms() {
    const dispatch = useDispatch()
    const router = useRouter()
    const detail = useSelector(state=>state.cmsSlice.detail)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
    const [alert,setAlert]=useState({
        status:false,
        message:'',
        type:''
    })
    const {edit} = router.query
    const [submitValidate, setsubmitValidate] = useState(false)
    const [confirmValidate, setConfirmValidate] = useState({})
    const [confirmValidateStatus, setConfirmValidateStatus] = useState(false)
    /* form submit handel  start */
        const [formSubmit, setFormSubmit] = useState({
            title:"",
            slug:'',
            content:''
        })
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
                nprogress.start()
                dispatch(updateCms(formSubmit))
            }
        }
        useEffect(() => {
            let something = true
            if (Object.keys(confirmValidate).length == 3) {
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
                router.push('/cms')
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
    useEffect(() => {
        if (edit!= undefined) {
            dispatch(getDetail({slug:edit}))
        }
    }, [edit])
    useEffect(() => {
        if(detail){
            formSubmit.title = detail.title
            formSubmit.slug = detail.slug
            formSubmit.content = detail.content 
            setFormSubmit({...formSubmit})
        }
    }, [detail])
    
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
                                            <label className="form-control-label">Title</label>
                                            <FormInputCom
                                                type="text"
                                                name="title"
                                                placeholder="Enter Title"
                                                optionData={[]}
                                                validator={[
                                                    {
                                                        property:validator.isEmpty,
                                                        message:"Title required",
                                                        isNot:false
                                                    },
                                                ]}
                                                getValue={getValue}
                                                defValue={formSubmit.title}
                                                submitValidate={submitValidate}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                            <label className="form-control-label">Slug</label>
                                            <FormInputCom
                                                type="text"
                                                name="slug"
                                                placeholder="Enter Slug"
                                                optionData={[]}
                                                validator={[
                                                    {
                                                        property:validator.isEmpty,
                                                        message:"Slug required",
                                                        isNot:false
                                                    },
                                                ]}
                                                isDefault={true}
                                                getValue={getValue}
                                                defValue={formSubmit.slug}
                                                submitValidate={submitValidate}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="12">
                                        <FormGroup>
                                            <label className="form-control-label">Content</label>
                                            <FormCKEditor
                                                name='content'
                                                validator={
                                                    {
                                                        required:true,
                                                        message:'Content is requird'
                                                    }
                                                }
                                                defValue={formSubmit.content}
                                                placeholder="Enter Slug"
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
  );
}
Cms.layout = Admin;
export default Cms;


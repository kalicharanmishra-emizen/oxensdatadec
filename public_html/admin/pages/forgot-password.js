import React, { useEffect, useState } from "react";
import Link from 'next/link'
// reactstrap components
import { Button,Card,Alert,CardBody,FormGroup,Form,Input,InputGroupAddon,InputGroupText, InputGroup, Label} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "reducers/authSlice";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import nProgress from "nprogress";
function ForgotPassword() {
    const dispatch = useDispatch()
    const [email,setEmail] = useState('')
    const [alertStaus,setalertStatus]=useState(false)
    const [alertMessage,setalertMessage]=useState('')
    const [alertColor,setAlertColor]=useState(null)
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
  
  const handleChange = (e)=>{
    setEmail(e.target.value)
  }
  const formSubmit = (e)=>{
    e.preventDefault()
    const payload = {
      "email" : email,
    }
    dispatch(forgetPassword(payload))
    nProgress.start()
  }
  // use effect for api error 
  useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode == 200){
                nProgress.done()
                setalertStatus(true)
                setAlertColor('success')
                setalertMessage(apiSuccess.message);
                dispatch(unSetApiSucc())
                setTimeout(() => {
                  setalertStatus(false)
                  setalertMessage('')
                  setAlertColor(null)
                }, 3000);
            }
        }
    }, [apiSuccess])
  useEffect(()=>{
    if(apiError){
      if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
        nProgress.done()
        setalertStatus(true)
        setAlertColor('danger')
        setalertMessage(apiError.message);
        dispatch(unSetApiFail())
        setTimeout(() => {
          setalertStatus(false)
          setalertMessage('')
          setAlertColor(null)
        }, 3000);
      }
    }
  },[apiError])

  return (
    <>
        <Card className="border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Alert isOpen={alertStaus} color={alertColor?alertColor:"danger"}>
              {alertMessage}
            </Alert>
            <Form role="form" onSubmit={formSubmit}>
              <FormGroup className="mb-3">
                <Label for="email">Email</Label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="email"
                    placeholder="Enter Email"
                    type="email"
                    name="email"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <div className="d-flex align-items-center justify-content-between">
                <Button className="" color="theame-btn" type="submit">
                  Forgot Password
                </Button>
                <span>
                  Back to
                  <Link href="/login">
                    <a className="link ml-1">
                      Login
                    </a>
                  </Link>
                </span>
                
              </div>
            </Form>
          </CardBody>
        </Card>
    </>
  );
}

ForgotPassword.layout = Auth;

export default ForgotPassword;

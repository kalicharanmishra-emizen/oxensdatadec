import React, { useEffect, useState } from "react";
import {useRouter} from 'next/router'
// reactstrap components
import { Button,Card,Alert,CardBody,FormGroup,Form,Input,InputGroupAddon,InputGroupText, InputGroup, Label} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "reducers/authSlice";
import { unSetApiSucc,unSetApiFail } from "reducers/mainSlice";
import nProgress from "nprogress";
function ResetPassword() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [newPassword,setNewPassword] = useState('')
    const [conPassword,setConPassword] = useState('')
    const [alertStaus,setalertStatus]=useState(false)
    const [alertMessage,setalertMessage]=useState('')
    const {token} = router.query
    const apiError = useSelector(state=> state.mainSlice.failed)
    const apiSuccess = useSelector(state=> state.mainSlice.success)
  
  const handleChange = (e)=>{
    if(e.target.name === 'new_password'){
        setNewPassword(e.target.value)
    }
    if(e.target.name === 'con_password'){
        setConPassword(e.target.value)
    }
  }
  const formSubmit = (e)=>{
    e.preventDefault()
    const payload = {
      "token":token,
      "new_pass" : newPassword,
      "con_pass" : conPassword
    }
    dispatch(resetPassword(payload))
    nProgress.start()
  }
  // use effect for api error 
  useEffect(() => {
        if (apiSuccess) {
            if(apiSuccess.statusCode == 200){
                dispatch(unSetApiSucc())
                nProgress.done()
                router.push('/login')
            }
        }
    }, [apiSuccess])
  useEffect(()=>{
    if(apiError){
      if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
        setalertStatus(true)
        setalertMessage(apiError.message);
        dispatch(unSetApiFail())
        nProgress.done()
        setTimeout(() => {
          setalertStatus(false)
          setalertMessage('')
        }, 3000);
      }
    }
  },[apiError])

  return (
    <>
        <Card className="border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Alert isOpen={alertStaus} color="danger">
              {alertMessage}
            </Alert>
            <Form role="form">
              <FormGroup className="mb-3">
                <Label for="new_password">New Password</Label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="new_password"
                    placeholder="New Password"
                    type="password"
                    name="new_password"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
              <Label for="con_password">Confirm Password</Label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="con_password"
                    placeholder="Confirm Password"
                    type="password"
                    name="con_password"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <div className="d-flex align-items-center justify-content-between">
                <Button className="" color="theame-btn" type="submit" onClick={formSubmit}>
                  Reset Password
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
    </>
  );
}
ResetPassword.layout = Auth;
export default ResetPassword;

import React, { useEffect, useState } from "react";
import Router from 'next/router'
import Link from 'next/link'
// reactstrap components
import { Button,Card,Alert,CardBody,FormGroup,Form,Input,InputGroupAddon,InputGroupText, InputGroup, Label} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
import { useDispatch, useSelector } from "react-redux";
import { login } from "reducers/authSlice";
import { unSetApiFail } from "reducers/mainSlice";
function Login() {
  const dispatch = useDispatch()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [alertStaus,setalertStatus]=useState(false)
  const [alertMessage,setalertMessage]=useState('')

  const userDetails = useSelector(state=> state.authSlice.loggedInUser)
  const apiError = useSelector(state=> state.mainSlice.failed)
  
  const handleChange = (e)=>{
    if(e.target.name === 'email'){
      setEmail(e.target.value)
    }
    if(e.target.name === 'password'){
      setPassword(e.target.value)
    }
  }
  const userLogin = (e)=>{
    e.preventDefault()
    const payload = {
      "email" : email,
      "password" : password
    }
    dispatch(login(payload))
  }
  // use effect for login user 
  useEffect(()=>{
    if(userDetails){
      if(userDetails.statusCode === 200){
        Router.push('/')
      }
    }
  },[userDetails])
  // use effect for api error 
  useEffect(()=>{
    if(apiError){
      if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
        setalertStatus(true)
        setalertMessage(apiError.message);
        setTimeout(() => {
          setalertStatus(false)
          setalertMessage('')
          dispatch(unSetApiFail())
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
            <Form role="form" onSubmit={userLogin}>
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
                    placeholder="Email"
                    type="email"
                    name="email"
                    autoComplete="new-email"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
              <Label for="Password">Password</Label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="Password"
                    placeholder="Password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                  />
                </InputGroup>
                
              </FormGroup>
              <div className="d-flex align-items-center justify-content-between">
                <Button className="" color="theame-btn" type="submit">
                  Sign in
                </Button>
                <Link href="/forgot-password">
                  <a className="link">
                    Forgot password?
                  </a>
                </Link>
              </div>
            </Form>
          </CardBody>
        </Card>
    </>
  );
}

Login.layout = Auth;

export default Login;

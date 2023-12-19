import React, { useEffect, useState } from "react";
import validator from 'validator';
// reactstrap components
import {
  Button,Card,CardHeader,CardBody,FormGroup,Form,Input,Container,Row,Col,FormFeedback,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import UserHeader from "components/Headers/UserHeader";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, updateProfile } from "reducers/authSlice";
import { unSetApiFail, unSetApiSucc } from "reducers/mainSlice";
import { toast } from "react-toastify";
import nProgress from "nprogress";

function Profile() {
  const userDetails = useSelector(state=> state.authSlice.loggedInUser);
  const apiError = useSelector(state=> state.mainSlice.failed)
  const apiSuccess = useSelector(state=> state.mainSlice.success)
  const dispatch = useDispatch();
  const [name,setName]=useState(userDetails.data.name)
  const [email,setEmail]=useState(userDetails.data.email)
  const [phone_no,setPhoneNo]=useState(userDetails.data.phone_no)
  const [pro_image,setProImage]=useState(userDetails.data.pro_image)
  const [pro_img,setProfileImage]=useState(null)
  const [oldPassword,setOldPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [conPassword,setConPassword]=useState('')
  const [alertStaus,setalertStatus]=useState(false)
  const [alertMessage,setalertMessage]=useState('')
  const [alertType,setalertType]=useState('')
  const [profileSubmit, setProfileSubmit] = useState(false)
  const [passwordSubmit, setPasswordSubmit] = useState(false)
  const [validation, setValidation] = useState({
    email:'',
    name:'',
    phone_no:''
  })
  const [passValidation, setPassValidation] = useState({
    old_pass:'',
    new_pass:'',
    con_pass:''
  })

  useEffect(()=>{
    setEmail(userDetails.data.email)
    setName(userDetails.data.name)
    setPhoneNo(userDetails.data.phone_no)
    setProImage(userDetails.data.pro_image)
  },[userDetails])

  useEffect(()=>{
    if(apiSuccess){
      if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
        setalertStatus(true)
        setalertMessage(apiSuccess.message);
        setalertType('success')
        // setLoader(false)
        nProgress.done()
        setTimeout(() => {
          setalertStatus(false)
          setalertMessage('')
          setalertType('')
          dispatch(unSetApiSucc())
        }, 3000);
      }
    }
  },[apiSuccess])

  useEffect(()=>{
    if(apiError){
      if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
        setalertStatus(true)
        setalertMessage(apiError.message);
        setalertType('error')
        // setLoader(false)
        nProgress.done()
        setTimeout(() => {
          setalertStatus(false)
          setalertMessage('')
          setalertType('')
          dispatch(unSetApiFail())
        }, 3000);
      }
    }
  },[apiError])

  useEffect(() => {
    if (validation.email==null && validation.name==null && validation.phone_no==null) {
      setProfileSubmit(true);
    } else {
      setProfileSubmit(false);
    }
  }, [validation])

  useEffect(() => {
    if (passValidation.old_pass==null && passValidation.new_pass==null && passValidation.con_pass==null) {
      setPasswordSubmit(true);
    } else {
      setPasswordSubmit(false);
    }
  }, [passValidation])


  const handleChange = (e)=>{
    switch (e.target.name) {
      case 'email':
        if (validator.isEmpty(e.target.value)) {
          validation.email={
            error:"Email is required"
          }
          setValidation({...validation})
        }else{
          validation.email=null
          setValidation({...validation})
          if (!validator.isEmail(e.target.value)) {
            validation.email={
              error:"Email must be a valid email address"
            }
            setValidation({...validation})
          }else{
            validation.email=null
            setValidation({...validation})
          }
        }
        setEmail(e.target.value)
        break;
      case 'name':
        if (validator.isEmpty(e.target.value)) {
          validation.name={
            error:"Name is required"
          }
          setValidation({...validation})
        }else{
          validation.name=null
          setValidation({...validation})
        }
        setName(e.target.value)
        break;
      case 'phone_no':
        if (validator.isEmpty(e.target.value)) {
          validation.phone_no={
            error:"Phone no is required"
          }
          setValidation({...validation})
        }else{
          validation.phone_no=null
          setValidation({...validation})
          if (!validator.isMobilePhone(e.target.value,['en-GB','en-IN'])) {
            validation.phone_no={
              error:'Phone number must be in a valid number'
            }
            setValidation({...validation})
          }else{
            validation.phone_no=null
            setValidation({...validation})
          }
        }
        setPhoneNo(e.target.value)
        break;
      case 'pro_image':
        setProfileImage(e.target.files[0])
        setProImage(URL.createObjectURL(e.target.files[0]))
        break;
      case 'old_pass':
        if (validator.isEmpty(e.target.value)) {
          passValidation.old_pass={error:'Old Password is required'};
          setPassValidation({...passValidation})
        } else {
          passValidation.old_pass=null;
          setPassValidation({...passValidation})
        }
        setOldPassword(e.target.value)
        break;
      case 'new_pass':
        if (validator.isEmpty(e.target.value)) {
          passValidation.new_pass={error:'New Password is required'};
          setPassValidation({...passValidation})
        } else {
          passValidation.new_pass=null;
          setPassValidation({...passValidation})
        }
        setNewPassword(e.target.value)
        break;
      case 'con_pass':
        if (validator.isEmpty(e.target.value)) {
          passValidation.con_pass={error:'Confirm Password is required'};
          setPassValidation({...passValidation})
        } else {
          passValidation.con_pass=null;
          setPassValidation({...passValidation})
          if (e.target.value != newPassword) {
            passValidation.con_pass={error:'Confirm Password and new password must be same'};
            setPassValidation({...passValidation})
          } else {
            passValidation.con_pass=null;
            setPassValidation({...passValidation})
          }
        }
        setConPassword(e.target.value)
        break;
      default:
        break;
    }
  }

  const validateProfile=()=>{
    if (validator.isEmpty(email)) {
      validation.email={
        error:"Email is required"
      }
      setValidation({...validation})
    }else{
      validation.email=null
      setValidation({...validation})
      if (!validator.isEmail(email)) {
        validation.email={
          error:"Email must be a valid email address"
        }
        setValidation({...validation})
      }else{
        validation.email=null
        setValidation({...validation})
      }
    }
    if (validator.isEmpty(name)) {
      validation.name={
        error:"Name is required"
      }
      setValidation({...validation})
    }else{
      validation.name=null
      setValidation({...validation})
    }
    if (validator.isEmpty(phone_no)) {
      validation.phone_no={
        error:"Phone no is required"
      }
      setValidation({...validation})
    }else{
      validation.phone_no=null
      setValidation({...validation})
      if (!validator.isMobilePhone(phone_no,['en-GB','en-IN'])) {
        validation.phone_no={
          error:'Phone number must be in a valid number'
        }
        setValidation({...validation})
      }else{
        validation.phone_no=null
        setValidation({...validation})
      }
    }
  }

  const profileUpdate= async (e)=>{
    e.preventDefault()
    await validateProfile()
    // console.log('profile submit',profileSubmit);
    if (profileSubmit) {
      let formData =new FormData()
      formData.append("email",email)
      formData.append("name",name)
      formData.append("phone_no",phone_no)
      formData.append("pro_image",pro_img)
      document.getElementById('profile-image').value=''
      nProgress.start()
      // setLoader(true)
      dispatch(updateProfile(formData))
    }
  }

  const validatePassword=()=>{
    if (validator.isEmpty(oldPassword)) {
      passValidation.old_pass={error:'Old Password is required'};
      setPassValidation({...passValidation})
    } else {
      passValidation.old_pass=null;
      setPassValidation({...passValidation})
    }
    if (validator.isEmpty(newPassword)) {
      passValidation.new_pass={error:'New Password is required'};
      setPassValidation({...passValidation})
    } else {
      passValidation.new_pass=null;
      setPassValidation({...passValidation})
    }
    if (validator.isEmpty(conPassword)) {
      passValidation.con_pass={error:'Confirm Password is required'};
      setPassValidation({...passValidation})
    } else {
      passValidation.con_pass=null;
      setPassValidation({...passValidation})
      if (conPassword != newPassword) {
        passValidation.con_pass={error:'Confirm Password and new password must be same'};
        setPassValidation({...passValidation})
      } else {
        passValidation.con_pass=null;
        setPassValidation({...passValidation})
      }
    }
  }
  const passwordUpdate=async (e)=>{
    e.preventDefault();
    await validatePassword()
    if (passwordSubmit) {
     let payload={
        old_pass:oldPassword,
        new_pass:newPassword,
        con_pass:conPassword,
      }
      // setLoader(true)
      nProgress.start()
      dispatch(updatePassword(payload))
    }

  }
  if (alertStaus) {
    toast(alertMessage,{
      type:alertType
    });
  }
  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My Account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={profileUpdate}>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="demo@example.com"
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            invalid={ validation.email ? true : false}
                          />
                          <FormFeedback >{validation.email && validation.email.error }</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-name"
                          >
                            Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Enter Name"
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleChange}
                            invalid={ validation.name ? true : false}
                          />
                          <FormFeedback >{validation.name && validation.name.error }</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone-no"
                          >
                            Phone No
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-phone-no"
                            placeholder="Enter Phone No"
                            type="text"
                            name="phone_no"
                            value={phone_no}
                            onChange={handleChange}
                            invalid={ validation.phone_no ? true : false}
                          />
                          <FormFeedback >{validation.phone_no && validation.phone_no.error }</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="profile-image">
                            Profile Image
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="profile-image"
                            type="file"
                            name="pro_image"
                            onChange={handleChange}
                            invalid={ validation.pro_image ? true : false}
                          />
                          <FormFeedback >{validation.pro_image && validation.pro_image.error }</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col lg="2">
                        <img 
                          src={pro_image}
                          className="m-2"
                          width="50"
                          height="50"
                        />
                      </Col>
                      <Col lg="12">
                      <Button
                        className="float-right"
                        color="primary"
                        type="submit"
                      >
                        Update
                      </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My Account Passwords</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={passwordUpdate}>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Old Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Old Password"
                            type="password"
                            name="old_pass"
                            value={oldPassword}
                            onChange={handleChange}
                            invalid={ passValidation.old_pass ? true : false}
                          />
                          <FormFeedback >{passValidation.old_pass && passValidation.old_pass.error }</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-name"
                          >
                            New Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="New Password"
                            type="password"
                            name="new_pass"
                            value={newPassword}
                            onChange={handleChange}
                            invalid={ passValidation.new_pass ? true : false}
                          />
                          <FormFeedback >{passValidation.new_pass && passValidation.new_pass.error }</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor=""
                          >
                            Confirm Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-phone-no"
                            placeholder="Confirm Password"
                            type="password"
                            name="con_pass"
                            value={conPassword}
                            onChange={handleChange}
                            invalid={ passValidation.con_pass ? true : false}
                          />
                          <FormFeedback >{passValidation.con_pass && passValidation.con_pass.error }</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                      <Button
                        className="float-right"
                        color="primary"
                        type="submit"
                      >
                        Update Password
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
Profile.layout = Admin;
export default Profile;

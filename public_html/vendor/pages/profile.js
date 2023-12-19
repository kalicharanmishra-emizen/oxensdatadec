import { useEffect, useState } from "react";
// reactstrap components
import { Button,Card,CardHeader,CardBody,FormGroup,Form,Input,Container,Row,Col,FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
// layout for this page
import Vendor from "layouts/Vendor.js";
// core components
import UserHeader from "components/Headers/UserHeader";
import { useDispatch, useSelector } from "react-redux";
import { getProfile,getAuthUser } from "../reducers/authSlice";
import { unSetApiFail, unSetApiSucc } from "reducers/mainSlice";
import { toast } from "react-toastify";
import General from "../components/Profile/General";
import Password from "../components/Profile/Password";
import Timing from "../components/Profile/Timing";
import Loader from "../components/ApiLoader/loader";
import StoreImages from "../components/Profile/StoreImages";
import NProgress from 'nprogress';
function Profile() {
  const userProfile = useSelector(state=> state.authSlice.profile);
  const apiError = useSelector(state=> state.mainSlice.failed)
  const apiSuccess = useSelector(state=> state.mainSlice.success)
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false)
  const [profileSend, setProfileSend] = useState(null)
  const [vendorTypeListSend, setVendorTypeListSend] = useState([])
  const [categoryListSend, setCategoryListSend] = useState([])
  const [activeTab, setActiveTab] = useState('general')
  useEffect(async() => {
      setLoader(true)
      NProgress.start()
      dispatch(getProfile())
  }, [])
  useEffect(() => {
    if (userProfile) {
      setProfileSend(userProfile.profile_data)
      setVendorTypeListSend(userProfile.vendorType)
      setCategoryListSend(userProfile.categoryList)
      setLoader(false)
      NProgress.done()
    }
  }, [userProfile])
  useEffect(() => {
      if (apiSuccess) {
        if(apiSuccess.statusCode >= 200 && apiSuccess.statusCode < 300){
          dispatch(getAuthUser())
          toast(apiSuccess.message,{
            type:'success'
          });
          // setLoader(false)
          dispatch(unSetApiSucc())
          dispatch(getProfile())
          NProgress.done()
        }
      }
      if (apiError) {
        if(apiError.statusCode >= 400 && apiError.statusCode <= 500){
            toast(apiError.message,{
              type:'error'
            });
            dispatch(unSetApiFail())
            // setLoader(false)
            NProgress.done()
        }
      }
  }, [apiSuccess,apiError])

  const noRefCheck = (tab) => {
    let value = tab.target.getAttribute('key-value')
    setActiveTab(value)
  }
  return (
    
    <>
      <UserHeader />
      <Container className="mt--7" fluid>  
             
          <div className="bg-secondary card tabs-Block">
            <Row className="m-0">
              <Nav tabs>
                <NavItem>
                  <NavLink className={(activeTab=='general')?'active':''} key-value="general" onClick={noRefCheck} >My Account </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={(activeTab=='password')?'active':''} key-value="password" onClick={noRefCheck} >Passwords</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={(activeTab=='timing')?'active':''} key-value="timing" onClick={noRefCheck} >Timing</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={(activeTab=='storeImages')?'active':''} key-value="storeImages" onClick={noRefCheck} >Images</NavLink>
                </NavItem>
              </Nav>
            </Row>
            <TabContent activeTab={activeTab}>
              {/* {loader?
                <Loader
                  isShow={loader}
                />
              :''} */}
              
                <TabPane tabId="general">
                  <Row className="m-0">
                    <Card className="bg-secondary shadow">
                      <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                          <Col xs="8">
                            <h3 className="mb-0">My Account</h3>
                          </Col>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        {profileSend?
                            <General
                              details={{
                                id:profileSend._id,
                                name:profileSend.name,
                                email:profileSend.email,
                                phone_no:profileSend.phone_no,
                                logo:profileSend.pro_image,
                                profile_data:profileSend.vendor_profile
                              }}
                              typeList={vendorTypeListSend}
                              categoryList={categoryListSend}
                              isLoading={loader}
                            />
                          :""
                        }
                      </CardBody>
                    </Card>
                  </Row>
                </TabPane>
                <TabPane tabId="password">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">My Account Passwords</h3>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Password
                        isLoading={loader}
                      />
                    </CardBody>
                  </Card>
                </TabPane>
                <TabPane tabId="timing">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">Store Timing</h3>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                        {profileSend?
                          <Timing
                            list={profileSend.vendorTiming.timing}
                            isLoading={loader}
                          />
                          :""
                        }
                    
                    </CardBody>
                  </Card>
                </TabPane>
                <TabPane tabId="storeImages">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">Store Iamges</h3>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                        {profileSend?
                          <StoreImages
                            isLoading={loader}
                            images={profileSend.vendorImages}
                          />
                          :""
                        }
                    </CardBody>
                  </Card>
                </TabPane>
              
            </TabContent>
          </div>
      </Container>
      </>
  );
}

Profile.layout = Vendor;

export default Profile;

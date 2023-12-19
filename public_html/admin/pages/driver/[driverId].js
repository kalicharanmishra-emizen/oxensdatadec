import Admin from 'layouts/Admin';
import UserHeader from 'components/Headers/UserHeader';
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Card, CardBody, CardHeader, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { useEffect, useState } from 'react';
import { getDetail } from '../../reducers/driverSlice';
import Loader from "../../components/ApiLoader/loader";
import { getVehicleType } from '../../Helper/helper';
import Income from '../../components/driver/Income';
import Jobs from '../../components/driver/Jobs';
const Detail = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const {driverId} = router.query
    const [activeTab, setActiveTab] = useState('income')
    const detail = useSelector(state=>state.driverSlice.driverDetail)
    const handelTabChange = (data) => {
        setActiveTab(data)
    }
    useEffect(()=>{
        if (driverId!=undefined) {
            dispatch(getDetail({ driverId:driverId }))
        }
    },[driverId])
    return (
        <>
            <UserHeader/>
            <Container className="mt--7" fluid>
                <Row>  
                    <Col xl='12'>
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                <Col xs="8">
                                    <h3 className="mb-0">Driver Detail</h3>
                                </Col>
                                <Col xs="4">
                                    <Badge
                                        className="float-right"
                                        color="warning"
                                        role="button"
                                        onClick={
                                            (e)=>{
                                                e.preventDefault()
                                                router.push('/driver')
                                            }
                                        }
                                    >
                                        Back
                                    </Badge>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody className="bg-white">
                                <Row>
                                    {
                                        detail.isLoading
                                        ?
                                        <Col xl='12'>
                                            <Loader/>
                                        </Col>
                                        :
                                        <>
                                            <Col xl="3">
                                                Name : <b>{ detail.data.name }</b>
                                            </Col>
                                            <Col xl="3">
                                                Email : <b>{ detail.data.email }</b>
                                            </Col>
                                            <Col xl="3">
                                                Phone No : <b>{ detail.data.phone_no }</b>
                                            </Col>
                                            <Col xl="3">
                                                status : 
                                                <Badge
                                                    className="ml-1"
                                                    role="button" 
                                                    color={detail.data.status?'success':'danger'}
                                                    >
                                                        { detail.data.status?'Active':'Deactive' }
                                                </Badge>
                                            </Col>
                                        </>
                                    }
                                </Row>            
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="mt-2" xl='12'>
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h2 className="mb-0">Driver Profile</h2>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody className="bg-white">
                                <Row>
                                    {
                                        detail.isLoading
                                        ?
                                        <Col xl='12'>
                                            <Loader/>
                                        </Col>
                                        :
                                        <>
                                            <Col className='mt-2' xl="6">
                                                <h4>
                                                    Driver Address
                                                </h4>
                                                <div xl="6">
                                                    Country : <b>{ detail.data.profile.country }</b>
                                                </div>
                                                <div xl="6">
                                                    County : <b>{ detail.data.profile.county }</b>
                                                </div>
                                                <div xl="6">
                                                    City : <b>{ detail.data.profile.city }</b>
                                                </div>
                                                <div xl="6">
                                                    Post Code : <b>{ detail.data.profile.postcode }</b>
                                                </div>
                                                <div xl="12">
                                                    Address : 
                                                    <p className='font-weight-bold'>{ detail.data.profile.address }</p>
                                                </div>
                                            </Col>

                                            <Col xl="6">
                                                <h4>
                                                    Genral details
                                                </h4>
                                                <div>
                                                    Online : 
                                                    <Badge
                                                        className="ml-1"
                                                        role="button" 
                                                        color={detail.data.profile.online?'success':'danger'}
                                                        >
                                                            { detail.data.profile.online?'Online':'Offline' }
                                                    </Badge>
                                                </div>
                                                <div>
                                                    DOB : <b>{ detail.data.profile.dob }</b>
                                                </div>
                                                <div>
                                                    Vehicle Type : <b>{ getVehicleType(detail.data.profile.vehicleType) }</b>
                                                </div>
                                            </Col>
                                        </>
                                    }
                                    
                                </Row>            
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="mt-2" xl='12'>
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Nav tabs>
                                    <NavItem style={{cursor:"pointer"}}>
                                        <NavLink
                                            className={activeTab=='income'?'active':''}
                                            onClick={ ()=>handelTabChange('income') }
                                        >
                                            Income
                                        </NavLink>
                                    </NavItem>
                                    <NavItem style={{cursor:"pointer"}}>
                                        <NavLink
                                            className={activeTab=='jobs'?'active':''}
                                            onClick={ ()=>handelTabChange('jobs') }
                                        >
                                            Jobs
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardHeader>
                            <CardBody className="bg-white">
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="income">
                                        <h1>Income</h1>
                                        <Income
                                        activeTab={activeTab=='income'?true:false} 
                                        driverId={driverId}
                                        />
                                    </TabPane>
                                    <TabPane tabId="jobs">
                                        <h1>Jobs </h1>
                                        <Jobs
                                            activeTab={activeTab=='jobs'?true:false}
                                            driverId={driverId}
                                        />
                                    </TabPane>
                                </TabContent>          
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container> 
        </>
    )
}
Detail.layout = Admin
export default Detail
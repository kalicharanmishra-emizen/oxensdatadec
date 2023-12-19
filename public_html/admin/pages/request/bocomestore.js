import React from 'react'
import Admin from 'layouts/Admin'
import UserHeader from 'components/Headers/UserHeader'
import { Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Table } from "reactstrap";
import { useEffect, useState } from "react";
import { getBecomeStoreList } from "reducers/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/ApiLoader/loader";
import PaginationClient from 'components/Pagination/PaginationClient';
function Contact() {
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(true)
    const [currentItem, setCurrentItem] = useState([])
    const [currentOffset, setCurrentOffset] = useState(1)
    const ItemPerPage =10;
    const becomeStoreListing = useSelector(state => state.requestSlice.becomeStore)
    const getCurrentItem = (data) => {
        setCurrentItem(data.items)
        setCurrentOffset(data.currentOffset)
    }
    useEffect(() => {
        dispatch(getBecomeStoreList())
        setLoader(false)
    }, [])
    return (
        <>
            <UserHeader/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-1" xl='12'>
                    <Card className="bg-secondary shadow">
                        <CardHeader className="bg-white border-0">
                            <Row className="align-items-center">
                            <Col xs="8">
                                <h3 className="mb-0">Contact Us Request's</h3>
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Store Name</th>
                                <th scope="col">Store Type</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone No.</th>
                                <th scope="col">Location</th>
                            </tr>
                            </thead>
                            <tbody>
                                {loader?
                                    <tr>
                                        <td colSpan="6">
                                            <Loader/>
                                        </td>
                                    </tr>
                                :
                                (currentItem.length>0) ? currentItem.map((data,key)=>(
                                    <tr key={data._id}>
                                        <td>{currentOffset + (key+1)}</td>
                                        <td>{data.storeName}</td>
                                        <td>{data.storeType}</td>
                                        <td>{data.cPersonName}</td>
                                        <td>{data.cPersonEmail}</td>
                                        <td>{data.cPersonPhoneNo}</td>
                                        <td>{data.storeLocation}</td>
                                    </tr>
                                )):<tr><td colSpan="7">no data found</td></tr>}
                                
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                            <nav aria-label="...">
                                <PaginationClient
                                    itemsPerPage={ItemPerPage}
                                    items={becomeStoreListing}
                                    getCurrentItem={getCurrentItem}
                                />
                    
                            </nav>
                        </CardFooter>
                    </Card>
                    </Col>
                </Row>
            </Container>  
        </>
    )
}
Contact.layout = Admin
export default Contact

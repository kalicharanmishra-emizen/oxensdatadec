import React from 'react'
import Admin from 'layouts/Admin'
import UserHeader from 'components/Headers/UserHeader'
import { Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Table } from "reactstrap";
import { useEffect, useState } from "react";
import { getCareerList } from "reducers/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/ApiLoader/loader";
import PaginationClient from 'components/Pagination/PaginationClient';
function Career() {
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(true)
    const [currentItem, setCurrentItem] = useState([])
    const [currentOffset, setCurrentOffset] = useState(1)
    const ItemPerPage =10;
    const careerListing = useSelector(state => state.requestSlice.career)
    const getCurrentItem = (data) => {
        setCurrentItem(data.items)
        setCurrentOffset(data.currentOffset)
    }
    useEffect(() => {
        dispatch(getCareerList())
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
                                <h3 className="mb-0">Career Request's</h3>
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Phone No.</th>
                                <th scope="col">Email</th>
                                <th scope="col">Position</th>
                                <th scope="col">Current Profile</th>
                                <th scope="col">Total Exp</th>
                                <th scope="col">Relevant Exp</th>
                                <th scope="col">Cover Letter</th>
                                <th scope="col">Resume</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    loader?
                                    <tr>
                                        <td colSpan="10">
                                            <Loader/>
                                        </td>
                                    </tr>  
                                    :
                                    (currentItem.length>0)?
                                        currentItem.map((data,key)=>(
                                            <tr key={data._id}>
                                                <td>{currentOffset + (key+1)}</td>
                                                <td>{data.name}</td>
                                                <td>{data.phone_no}</td>
                                                <td>{data.email}</td>
                                                <td>{data.position}</td>
                                                <td className='text-wrap'>{data.curProfile}</td>
                                                <td>{data.totelExp}</td>
                                                <td>{data.relExp}</td>
                                                <td className='text-wrap'>{data.coverLetter}</td>
                                                <td><a href={data.resume} target="_blank">Link</a></td>
                                            </tr>
                                        ))
                                    :
                                        <tr>
                                            <td colSpan="10">no data found</td>
                                        </tr>
                                }
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                            <nav aria-label="...">
                                <PaginationClient
                                    itemsPerPage={ItemPerPage}
                                    items={careerListing}
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
Career.layout = Admin
export default Career

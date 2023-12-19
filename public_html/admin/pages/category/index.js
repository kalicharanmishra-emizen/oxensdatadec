import Admin from 'layouts/Admin'
import UserHeader from 'components/Headers/UserHeader'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from "reactstrap";
import Link from 'next/link';
import PaginationClient from '../../components/Pagination/PaginationClient';
import { useEffect, useState } from 'react';
import { getCategoryList,removeCategoryDetails } from 'reducers/categorySlice';
import { useDispatch, useSelector } from 'react-redux';
import {callApi} from '../../Helper/helper'
function Index() {
    const [currentItem, setCurrentItem] = useState([])
    const [currentOffset, setCurrentOffset] = useState(1)
    let categoryList =  useSelector(state => state.categorySlice.categoryList)
    const dispatch = useDispatch()
    const getCurrentItem = (data) => {
        setCurrentItem(data.items)
        setCurrentOffset(data.currentOffset)
    }
    useEffect(() => {
        dispatch(getCategoryList())
        dispatch(removeCategoryDetails())
    }, [])
    const deleteCat = (value) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#aa2323',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let res = await callApi('post','/category/delete',{catId:value}) 
                    if (res.data.statusCode == 200) {
                        document.getElementById(value).remove()
                        Swal.fire({
                            icon: 'success',
                            title: 'Category remove',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: error.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        })
    }
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
                                <h3 className="mb-0">Category List</h3>
                            </Col>
                            <Col xs="4">
                                <Link href="/category/create">
                                    <Button color="success">Create category</Button>
                                </Link>
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Category Type</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    
                                    (currentItem && currentItem.length > 0) ? currentItem.map((data,key)=>(
                                        <tr key={key} id={data._id}>
                                            <td>{currentOffset + (key+1)}</td>
                                            <th>
                                                {data.title}
                                            </th>
                                            <td>
                                                {data.type.title}
                                            </td>
                                            <td>
                                                <Link href={`/category/${data._id}`}>
                                                    <svg width="16" height="16" aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="svg-inline--fa fa-edit fa-w-18 fa-2x"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z" className=""></path></svg>
                                                </Link>
                                                
                                                <span role="button" className="ml-2" onClick={()=>deleteCat(data._id)}>
                                                    <svg width="16" height="16" aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="svg-inline--fa fa-trash-alt fa-w-14 fa-3x"><path fill="currentColor" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z" className=""></path></svg>
                                                </span>
                                            </td>
                                        </tr>
                                    )):<tr><td colSpan='3'>No Data Found</td></tr>
                                }
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                                <PaginationClient
                                    itemsPerPage={10}
                                    items={categoryList}
                                    getCurrentItem={getCurrentItem}
                                />
                        </CardFooter>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
Index.layout = Admin
export default Index

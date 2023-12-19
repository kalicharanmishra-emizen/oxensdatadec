import Admin from "layouts/Admin";
import UserHeader from "components/Headers/UserHeader";
import Link from 'next/link'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import PaginationClient from 'components/Pagination/PaginationClient';
import { getCategoryList, unSetCategoryDetails } from 'reducers/menuSlice';
function Index() {
    const router = useRouter()
    const dispatch = useDispatch()
    const {store} = router.query
    const [currentItem, setCurrentItem] = useState([])
    const [currentOffset, setCurrentOffset] = useState(1)
    const ItemPerPage =10;
    let categoryList =  useSelector(state => state.menuSlice.categoryList)
    const getCurrentItem = (data) => {
        setCurrentItem(data.items)
        setCurrentOffset(data.currentOffset)
    }
    useEffect(() => {
        dispatch(getCategoryList({storeId:store}))
        dispatch(unSetCategoryDetails())
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
                                <h3 className="mb-0">Category List</h3>
                            </Col>
                            <Col xs="4">
                                <Link href={`/vendor/${store}/create`}>
                                    <Button color="success">Create Category</Button>
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
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (currentItem && currentItem.length > 0) ? currentItem.map((data,key)=>(
                                        <tr key={key}>
                                            <td>
                                                {/* {data._id} */}
                                                {currentOffset + (key+1)}
                                            </td>
                                            <th>
                                                {data.title}
                                            </th>
                                            <td>
                                                <Link href={`/vendor/${store}/edit/${data._id}`}>
                                                    <span role="button">
                                                        <svg style={{width:"15px",height:"15px"}} aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="ml-2 svg-inline--fa fa-edit fa-w-18 fa-2x"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z" className=""></path></svg>
                                                    </span>
                                                    
                                                </Link>
                                                <Link href={`/vendor/${store}/${data._id}`}>
                                                    <span role="button">
                                                        <svg style={{width:"15px",height:"15px"}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="list" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="ml-2 svg-inline--fa fa-list fa-w-16 fa-2x"><path fill="currentColor" d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" className=""></path></svg>
                                                    </span>
                                                </Link>
                                            </td>
                                        </tr>
                                    )):<tr><td colSpan='3'>No Data Found</td></tr>
                                }
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                            <nav aria-label="..."  className="float-left">
                                <PaginationClient
                                    itemsPerPage={ItemPerPage}
                                    items={categoryList}
                                    getCurrentItem={getCurrentItem}
                                />
                            </nav>
                            <div>
                                <Button
                                    className="float-right"
                                    color="secondary"
                                    type="button"
                                    onClick={
                                        (e)=>{
                                            e.preventDefault()
                                            router.push(`/vendor`)
                                        }
                                    }
                                >
                                    Back
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
Index.layout=Admin;
export default Index

import Admin from "layouts/Admin";
import UserHeader from "components/Headers/UserHeader";
import Link from 'next/link'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from "reactstrap";
import PaginationServer from 'components/Pagination/PaginationServer'
import { useEffect, useState } from "react";
import { getList ,unSetEditVendor } from "reducers/vendorSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import Loader from "../../components/ApiLoader/loader";
function Index() {
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    const dispatch = useDispatch();
    let getVendorList = useSelector(state => state.vendorSlice.vendorList);
    useEffect(() => {
            setLoader(true)
            dispatch(getList())
            dispatch(unSetEditVendor())
    },[])
    const [vendorList, setVendorList] = useState()
    const [paginationData, setPaginationData] = useState()
    useEffect(() => {
        if (getVendorList) {
            let pagData={
                totalDocs: getVendorList.data.totalDocs,
                limit: getVendorList.data.limit,
                page: getVendorList.data.page,
                totalPages: getVendorList.data.totalPages,
                hasPrevPage: getVendorList.data.hasPrevPage,
                hasNextPage: getVendorList.data.hasNextPage,
                prevPage: getVendorList.data.prevPage,
                nextPage: getVendorList.data.nextPage
            }
            setPaginationData(pagData)
            setVendorList(getVendorList.data.docs)
            setLoader(false)
        }
    }, [getVendorList])
    const pageChange=(data)=>{
        setLoader(true)
        dispatch(getList(data))
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
                                <h3 className="mb-0">Vendor List</h3>
                            </Col>
                            <Col xs="4">
                                <Link href="/vendor/create">
                                    <Button color="success">Create Vendor</Button>
                                </Link>
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">email</th>
                                <th scope="col">phone no</th>
                                <th scope="col">Delivery Type</th>
                                {/* <th scope="col">pro image</th> */}
                                <th scope="col" />
                            </tr>
                            </thead>
                            <tbody>
                                {loader?
                                    <tr>
                                        <td colSpan="5">
                                            <Loader/>
                                        </td>
                                    </tr>
                                :
                                (vendorList && vendorList.length>0) ? vendorList.map((data, key)=>(
                                    <tr key={data._id}>
                                         <th scope="row">
                                            {key + 1}
                                        </th>
                                        <th scope="row">
                                            <Media className="align-items-center">
                                                <span className="mb-0 text-sm">
                                                    {data.name}
                                                </span>
                                            </Media>
                                        </th>
                                        <td>{data.email}</td>
                                        <td>
                                            {data.phone_no}
                                            {/* <Badge color="" className="badge-dot">
                                                <i className="bg-success" />
                                                completed
                                            </Badge> */}
                                        </td>
                                        <td>
                                            <Badge color="" style={{background:`${data?.deliveryType === 0 ? "rgba(143, 255, 192, 0.83)" : "#fff9c6d4" } `,padding: "6px 15px"}} className="badge-dot">
                                               { data?.deliveryType === 0 ? "Oxens" : "Self"} 
                                            </Badge>
                                        </td>
                                        {/* <td>
                                            <img src={data.pro_image} width="50"/>
                                        </td> */}
                                        <td className="text-right">
                                            <UncontrolledDropdown>
                                                <DropdownToggle
                                                    className="btn-icon-only text-light"
                                                    href="#pablo"
                                                    role="button"
                                                    size="sm"
                                                    color=""
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    <i className="fas fa-ellipsis-v" />
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-arrow">
                                                    <DropdownItem
                                                        onClick={
                                                            (e) => {
                                                                e.preventDefault()
                                                                router.push(`/vendor/edit/${data._id}`)
                                                            }
                                                        }
                                                    >
                                                        Edit
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        onClick={
                                                            (e) => {
                                                                e.preventDefault()
                                                                router.push(`/vendor/${data._id}`)
                                                            }
                                                        }
                                                    >
                                                        Add Product
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </td>
                                    </tr>
                                )):<tr><td colSpan="5">no data found</td></tr>}
                                
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                            <nav aria-label="...">
                                {
                                    (paginationData)?
                                        <PaginationServer 
                                            data={paginationData}
                                            pagFun={pageChange}
                                        />
                                    :null        
                                }
                    
                            </nav>
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

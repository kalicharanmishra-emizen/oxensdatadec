import Admin from "layouts/Admin";
import UserHeader from "components/Headers/UserHeader";
import Link from 'next/link'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from "reactstrap";
import PaginationServer from 'components/Pagination/PaginationServer'
import { useEffect, useState } from "react";
import { getList } from "reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import Loader from "components/ApiLoader/loader";
import { callApi } from "Helper/helper";
function Index() {
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    const dispatch = useDispatch();
    let getUserList = useSelector(state => state.userSlice.userList);
    useEffect(() => {
        setLoader(true)
        dispatch(getList())
    },[])
    const [userList, setUserList] = useState()
    const [paginationData, setPaginationData] = useState()

    const updateStatus = (e) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to change this status",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let res = await callApi('post','/user/status',{userId:e.target.id})
                    if (res.data.data) {
                        e.target.classList.add('badge-success')
                        e.target.classList.remove('badge-danger')
                        e.target.innerText = 'Active'
                    }else{
                        e.target.classList.add('badge-danger')
                        e.target.classList.remove('badge-success')
                        e.target.innerText = 'Deactive'
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Update',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } catch (error) {
                    Swal.fire({
                        icon: 'danger',
                        title: 'Somthing went wrong',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
          })
    }


    useEffect(() => {
        if (getUserList) {
            let pagData={
                totalDocs: getUserList.data.totalDocs,
                limit: getUserList.data.limit,
                page: getUserList.data.page,
                totalPages: getUserList.data.totalPages,
                hasPrevPage: getUserList.data.hasPrevPage,
                hasNextPage: getUserList.data.hasNextPage,
                prevPage: getUserList.data.prevPage,
                nextPage: getUserList.data.nextPage
            }
            setPaginationData(pagData)
            setUserList(getUserList.data.docs)
            setLoader(false)
        }
    }, [getUserList])
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
                                <h3 className="mb-0">User List</h3>
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
                                <th scope="col">DOB</th>
                                <th scope="col">Status</th>
                                {/* <th scope="col" /> */}
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
                                (userList && userList.length>0) ? userList.map((data, key)=>(
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
                                        <td>{data.phone_no}</td>
                                        <td>{data.dob}</td>
                                        <td>
                                            <Badge role="button" id={data._id} onClick={updateStatus} color={data.status?'success':'danger'}>
                                                    {data.status?'Active':'Deactive'}
                                            </Badge>
                                        </td>
                                        {/* <td className="text-right">
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
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </td> */}
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

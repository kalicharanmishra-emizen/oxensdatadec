import Admin from "layouts/Admin";
import UserHeader from "components/Headers/UserHeader";
import Link from 'next/link'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Container, CustomInput, DropdownItem, DropdownMenu, DropdownToggle, Input, Media, Pagination, PaginationItem, PaginationLink, Progress, Row, Table, UncontrolledDropdown } from "reactstrap";
import PaginationClient from 'components/Pagination/PaginationClient'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Loader from "components/ApiLoader/loader";
import { useDispatch, useSelector } from "react-redux";
import {getCustomeVarientList, unSetDetailCustomizeVarient} from 'reducers/menuSlice';
import { callApi } from "Helper/helper";
function Index() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(true)
    const customeVariant = useSelector(state => state.menuSlice.customeVariant)
    const [currentItem, setCurrentItem] = useState([])
    const [currentOffset, setCurrentOffset] = useState(1)
    const ItemPerPage =10;
    const {store,item,customize,varient} = router.query
    useEffect(() => {
        if (customize!=undefined && varient != undefined) {
            dispatch(getCustomeVarientList({cusId:varient}))
            dispatch(unSetDetailCustomizeVarient())
            setLoader(false)
        }
    }, [customize,varient])
    const getCurrentItem = (data) => {
        setCurrentItem(data.items)
        setCurrentOffset(data.currentOffset)
    }

    const updateStatus = (e) =>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to change this status",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let res = await callApi('post','/menu/customize/status',{cusId:e.target.id}) 
                    // console.log('res',res.data.data);
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
    const deleteCustome = (e) => {
        e.preventDefault()
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
                    let res = await callApi('post','/menu/customize/variant/delete',{varId:e.target.getAttribute('value')}) 
                    if (res.data.statusCode == 200) {
                        document.getElementById(e.target.getAttribute('value')).remove()
                        Swal.fire({
                            icon: 'success',
                            title: 'Customize varient Delete',
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
                                <h3 className="mb-0">Item's Custome Variants List</h3>
                            </Col>
                            <Col xs="4">
                                <Link href={`/vendor/${store}/${item}/${customize}/${varient}/create`}>
                                    <Button color="success">Create Item Custome Variant</Button>
                                </Link>
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Price</th>
                                <th scope="col">Has Dependent Price</th>
                                <th scope="col">Is Default</th>
                                <th scope="col" />
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    currentItem.length > 0?
                                    currentItem.map(list=>(
                                            <tr id={list._id} key={list._id}>
                                                <th>
                                                    {list.title}
                                                </th>
                                                <td>
                                                    {list.price}
                                                </td>
                                                <td>
                                                    <Badge color={list.dependent_price.length>0?'success':'danger'}>
                                                        {list.dependent_price.length>0?'Yes':'No'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                {/* onClick={updateStatus} */}
                                                    <Badge role="button" id={list._id} color={list.isDefault?'success':'danger'}>
                                                        {list.isDefault?'Yes':'No'}
                                                    </Badge>
                                                </td>
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
                                                                    router.push(`/vendor/${store}/${item}/${customize}/${varient}/edit/${list._id}`)
                                                                }
                                                            }
                                                        >
                                                            Edit
                                                        </DropdownItem>
                                                        {/* <DropdownItem 
                                                            value={list._id}
                                                            onClick={deleteCustome}
                                                        >
                                                            Delete
                                                        </DropdownItem> */}
                                                    </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>   
                                        ))
                                    :
                                    <tr>
                                        <td colSpan="4">no data found</td>
                                    </tr>
                                }
                                
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                            <nav aria-label="...">
                                {!loader?
                                    <PaginationClient
                                        itemsPerPage={ItemPerPage}
                                        items={customeVariant}
                                        getCurrentItem={getCurrentItem}
                                    />
                                :null
                                }
                                
                            </nav>
                            <div>
                                <Button
                                    className="float-right mr-2"
                                    color="secondary"
                                    type="button"
                                    onClick={
                                        (e)=>{
                                            e.preventDefault()
                                            router.push(`/vendor/${store}/${item}/${customize}`)
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
Index.layout = Admin
export default Index


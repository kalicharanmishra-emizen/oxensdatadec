import Admin from "layouts/Admin";
import UserHeader from "components/Headers/UserHeader";
import Link from 'next/link'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, Table, UncontrolledDropdown } from "reactstrap";
import PaginationCom from 'components/Pagination/PaginationServer'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import Loader from "components/ApiLoader/loader";
import { getItemsList,unSetItemDetails } from "reducers/menuSlice";
import { badgesColor, badgesText, callApi } from "../../../../Helper/helper";
function Index() {
    // const MySwal = withReactContent(Swal)
    const router = useRouter()
    const {store,item} = router.query
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false)
    const [itemsList, setItemsList] = useState()
    const [paginationData, setPaginationData] = useState()
    let getMenuItemsList = useSelector(state => state.menuSlice.items);
    useEffect(() => {
        setLoader(true)
        if (item !=undefined) {
            dispatch(getItemsList({category:item, storeId:store}))
            dispatch(unSetItemDetails())
        }
    },[item])
    useEffect(() => {
        if (getMenuItemsList) {
            let pagData={
                totalDocs: getMenuItemsList.totalDocs,
                limit: getMenuItemsList.limit,
                page: getMenuItemsList.page,
                totalPages: getMenuItemsList.totalPages,
                hasPrevPage: getMenuItemsList.hasPrevPage,
                hasNextPage: getMenuItemsList.hasNextPage,
                prevPage: getMenuItemsList.prevPage,
                nextPage: getMenuItemsList.nextPage
            }
            setPaginationData(pagData)
            setItemsList(getMenuItemsList.docs)
            setLoader(false)
        }
    }, [getMenuItemsList])
    const pageChange=(data)=>{
        setLoader(true)
        dispatch(getItemsList({category:item},data))
    }
    const [isToggled, setIsToggled] = useState(true)
    const toggleTrueFalse = () =>{
        setIsToggled(!isToggled)
    }
    const updateItemStatus = (e) => {
        // e.preventDefault()
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to change this status",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes'
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let res = await callApi('post','/menu/item/status',{itemId:e.target.id}) 
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
    const deleteItem = (e) =>{
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
                    // console.log('delete target',e.target);
                    // console.log('delete parent',e.target.closest('tr'));
                    // console.log('delete value',e.target.getAttribute('value'));
                    let res = await callApi('post','/menu/item/delete',{itemId:e.target.getAttribute('value')}) 
                    // console.log('res',res.data.data);
                    if (res.data.statusCode == 200) {
                        document.getElementById(e.target.getAttribute('value')).remove()
                        Swal.fire({
                            icon: 'success',
                            title: 'Status Update',
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
                                <h3 className="mb-0">Item's List</h3>
                            </Col>
                            <Col xs="4">
                                <Link href={`/vendor/${store}/${item}/create`}>
                                    <Button color="success">Create Item</Button>
                                </Link>
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">Age Restriction</th>
                                <th scope="col">Title</th>
                                <th scope="col">Is Customize</th>
                                <th scope="col">Badge</th>
                                <th scope="col">Image</th>
                                <th scope="col">Status</th>
                                <th scope="col" />
                            </tr>
                            </thead>
                            <tbody>
                                {loader?
                                    <Loader/>
                                :
                                (itemsList && itemsList.length>0) ? itemsList.map((data)=>(
                                    <tr id={data._id} key={data._id}>
                                        <td>
                                            <Badge color={data.age_res?'success':'danger'}>
                                                {data.age_res?'Yes':'No'}
                                            </Badge>
                                        </td>
                                        <td>
                                            {data.title}
                                        </td>
                                        <td>
                                            <Badge color={data.is_customize?'success':'danger'}>
                                                {data.is_customize?'Yes':'No'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge style={{background:`${badgesColor(data.badge)}`}}>
                                                <span style={{fontWeight:"900", fontSize:"12px", color:"white"}}>{badgesText(data.badge)}</span>
                                            </Badge>
                                        </td>
                                        <td>
                                            <img src={data.item_img} width="50"/>
                                        </td>
                                        <td>
                                        {/* <CustomInput
                                            onClick={toggleTrueFalse}
                                            type="switch"
                                            id="asdas"
                                            name="asd"
                                            label={isToggled === true ? "on" : "off"}
                                        /> */}
                                        {/* <label htmlFor="test" check className="custom-toggle custom-toggle-info"> 
                                            <Input 
                                                id="test" 
                                                type="checkbox"
                                            />                                   
                                            <span className="custom-toggle-slider rounded-circle" dataLabelOff="OFF" dataLabelOn="ON"></span>
                                        </label> */}
                                            <Badge role="button" id={data._id} onClick={updateItemStatus} color={data.status?'success':'danger'}>
                                                {data.status?'Active':'Deactive'}
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
                                                                router.push(`/vendor/${store}/${item}/edit/${data._id}`)
                                                            }
                                                        }
                                                    >
                                                        Edit
                                                    </DropdownItem>
                                                    {/* <DropdownItem 
                                                        value={data._id}
                                                        onClick={deleteItem}
                                                    >
                                                        Delete
                                                    </DropdownItem> */}
                                                    {data.is_customize?
                                                        <DropdownItem 
                                                        onClick={
                                                            (e)=>{
                                                                e.preventDefault()
                                                                router.push(`/vendor/${store}/${item}/${data._id}`)
                                                            }
                                                        }
                                                        >
                                                            Customize
                                                        </DropdownItem>
                                                    :''
                                                    }
                                                    
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </td>
                                    </tr>
                                )):<tr><td colSpan="7">no data found</td></tr>}
                                
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                            <nav aria-label="..."  className="float-left">
                                {
                                    (paginationData)?
                                        <PaginationCom 
                                            data={paginationData}
                                            pagFun={pageChange}
                                        />
                                    :null        
                                }
                    
                            </nav>
                            <div>
                                <Button
                                    className="float-right"
                                    color="secondary"
                                    type="button"
                                    onClick={
                                        (e)=>{
                                            e.preventDefault()
                                            router.push(`/vendor/${store}`)
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
Index.layout=Admin
export default Index

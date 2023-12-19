import { Container, Row, Col, Form, FormGroup, Input} from 'reactstrap'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react';
import logo from '../public/images/logo-color.svg';
import cart from '../public/images/cart.svg';
import locationIcon from '../public/images/location-icon.svg'
import downarrow from '../public/images/down-arrow.svg'
import livelocationIcon from '../public/images/livelocation-icon.svg';
import plusIcon from '../public/images/plus-icon.svg';
import homeIcon from '../public/images/home-icon.svg';
import officeIcon from '../public/images/office-icon.svg';
import QuantityBtn from './quantityBtn'
import SideMenu from './SideMenu';
import { manageCartData } from '../reducers/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Location from './Model/location';
import { getAddress } from '../reducers/addressSlice';
import SearchMenuItems from './Search/SearchMenuItems';

export default function StoreHeader({authrize}) {
    const dispatch = useDispatch()
    const router = useRouter()
    const locationDropDowns = useRef()
    const CartDropDowns = useRef()
    const cartData = useSelector(state => state.mainSlice.cart)
    const myAddress = useSelector(state => state.addressSlice.list)
    const authData = useSelector(state => state.authSlice.loggedInUser)
    const [isLocDropDown, setisLocDropDown] = useState(false)
    const [isCartDropDown, setisCartDropDown] = useState(false)
    const [locationModal, setLocationModal] = useState(false);
    const [selectLocation,setSelectLocation] = useState({})

    useEffect(() => {
        // dispatch(getAuthUser())
        document.body.classList=''
        if(localStorage.getItem('selectAddress')){
            setSelectLocation(JSON.parse(localStorage.getItem('selectAddress')))
        }
    }, []);
    useEffect(() => {
        if (authrize && myAddress.isLoading) {
            dispatch(getAddress())
        }
    }, [myAddress,authrize])
    useEffect(() => {
        if (Object.keys(cartData.orderItems).length==0 && localStorage.getItem('cart') && Object.keys(JSON.parse(localStorage.getItem('cart')).orderItems).length!=0 ) {
            dispatch(manageCartData())
        }
    }, [cartData])
    useEffect(() => {
        let handelClick=(e)=>{
           if (isLocDropDown && locationDropDowns.current && !locationDropDowns.current.contains(e.target)) {
                document.body.classList=''
                setisLocDropDown(false)
            }
        }
        document.addEventListener("mousedown", handelClick)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown",handelClick);
        }; 
    }, [isLocDropDown]);

    useEffect(() => {
        let handelClick=(e)=>{
            if (isCartDropDown && CartDropDowns.current && !CartDropDowns.current.contains(e.target)) {
                document.body.classList=''
                setisCartDropDown(false)
            }
        }
        document.addEventListener("mousedown", handelClick)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown",handelClick);
        };
    }, [isCartDropDown])

    const navWrap=()=>{
        if(document.body.classList.contains('navigation-open')){
            document.body.classList=''
        }else{
            document.body.classList=''
            document.body.classList.add('navigation-open')
        }
    }
    const locationBox=()=>{
        if(document.body.classList.contains('locationBox-open')){
            setisLocDropDown(false)
            document.body.classList.remove('locationBox-open')
        }else{
            setisLocDropDown(true)
            document.body.classList=''
            document.body.classList.add('locationBox-open')
        }
        
    }
    const cartBox=()=>{
        setisCartDropDown(false)
        if(document.body.classList.contains('cartBox')){
            document.body.classList.remove('cartBox')
        }else{
            setisCartDropDown(true)
            document.body.classList=''
            document.body.classList.add('cartBox')
            
        }
    }
    const checkOut=(e)=>{
        if (authData?.data?._id === "") {
            router.push("/login")
        }else{
            if(Number(e.currentTarget.getAttribute('cart'))){
                document.body.classList.remove('cartBox')
                router.push("/checkout/details")
            }
        }
    }
 
    const handelLocation = () => {
        document.body.classList=''
        setLocationModal(!locationModal)
    }
    const getCustomeTypeToString = (data) => {
        let returnString =''
        data.map(cus=>{
            returnString+=cus.title+' | '
            cus.variants.map(vare=>{
                returnString+= vare.title+', '
            })
        })
        return returnString
    }   
    const getGpsLocation = () =>{
        navigator.geolocation.getCurrentPosition(function(position) {
            const geoCode = new window.google.maps.Geocoder()
            const myLatlng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            geoCode.geocode({
                latLng:myLatlng
            }).then(({results})=>{
                if (results[0]) {
                    let area = results[0].address_components.find(temp=>
                    _.isEqual(temp.types,[
                        "political",
                        "sublocality",
                        "sublocality_level_1"
                    ])
                    )
                    router.push({
                    pathname:'/store',
                    query:{
                        area:area?area.long_name:null,
                        lat:results[0].geometry.location.lat(),
                        lng:results[0].geometry.location.lng()
                    }
                    }) 
                }else{
                    console.log('No result found');
                }
            }).catch((e) => console.log("Geocoder failed due to: " + e))
        });
    } 
    const selectAddress = (e) => {  
        let addressID = e.currentTarget.getAttribute('value')
        let selectAddress = myAddress.data.find(temp=>temp._id==addressID)
        if(selectAddress!= undefined){
            localStorage.setItem('selectAddress',JSON.stringify(selectAddress))
            router.push({
                pathname:'/store',
                shallow:true,
                query:{
                  area:selectAddress.area,
                  lat:selectAddress.lat,
                  lng:selectAddress.lng
                }
            })  
            setSelectLocation(selectAddress)
            document.body.classList=''
        }
    }
    return (
    <>
    <div className="nav-overlay" onClick={navWrap}></div>
    <header className="header style-two">
        <Container>
            <Row className="align-items-center">
                <Col sm="3" className="col-4">
                    <div className="logo">
                        <Link href="/">
                        <a><Image src={logo} alt="Oxens Logo" /></a>
                        </Link>
                    </div>
                </Col>
                <Col sm="9" className="col-8">
                    <div className="header-right">
                    <ul>
                        <li className="locationWrap" ref={locationDropDowns}>
                            <FormGroup>
                                <span className="locationIcon" onClick={locationBox}><Image src={locationIcon} alt="Cart Icon" /></span>
                                <Input type="search" onClick={locationBox} placeholder="Enter Your Location" defaultValue={selectLocation.address?selectLocation.address:router.query.area || ''} />
                                <span className="downarrow"><Image src={downarrow} alt="Cart Icon" /></span>
                            </FormGroup>
                            <div className="locationInfo">
                                <div className={`liveLocation ${!authrize?'border-bottom-0 pb-0':''}`}>
                                    <span role="button" onClick={getGpsLocation}><a>
                                        <Image src={livelocationIcon} alt="livelocationIcon" />
                                        <div className="livelocationContent">Detect current location<span>Using GPS</span></div>
                                    </a></span>
                                </div>
                                <div className={`newAddress ${!authrize?'d-none':''}`}>
                                    <span role="button"><a onClick={handelLocation}><Image src={plusIcon} alt="plusIcon" /><span>Add Your Address</span></a></span>
                                </div>
                                <div className={`savedAdd ${!authrize?'d-none':''}`}>
                                    <span className="addTitle">Saved Address</span>
                                    <ul>
                                        {
                                            !myAddress.isLoading
                                                ?   myAddress.data.length == 0
                                                    ?   <li>
                                                            <span role="button">
                                                                <a>
                                                                    <div className="addContent">
                                                                        <span>No Address Found</span>
                                                                    </div>
                                                                </a>
                                                            </span>
                                                        </li> 
                                                    :   myAddress.data.map(list=>(
                                                            <li key={list._id} 
                                                                value={list._id} 
                                                                onClick={selectAddress}
                                                            >
                                                                <span role="button">
                                                                    <a>
                                                                        <Image 
                                                                            src={
                                                                                list.tag == "Home"? 
                                                                                    homeIcon
                                                                                :
                                                                                list.tag=="Office"?
                                                                                    officeIcon
                                                                                :officeIcon
                                                                            } 
                                                                            alt="Home Icon" 
                                                                        />
                                                                        <div className="addContent">
                                                                            <span 
                                                                                className="saveTitle"
                                                                            >
                                                                                {list.tag}
                                                                            </span>
                                                                            <span>
                                                                                {list.address}
                                                                            </span>
                                                                        </div>
                                                                    </a>
                                                                </span>
                                                            </li>
                                                        ))
                                                :   null
                                        }
                                        {/* <li>
                                            <span role="button"><a>
                                                <Image src={officeIcon} alt="Office Icon" />
                                                <div className="addContent">
                                                    <span>Home</span>
                                                    <span>70 US, Located Inside Walmart, Carson City, United States</span>
                                                </div>
                                            </a></span>
                                        </li> */}
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li className="searchIocn">
                            {/* <span role="button" ><a onClick={searchBox}><Image src={searchIocn} alt="Search Iocn" /></a></span>
                            <Form>
                                <FormGroup>
                                    <span className="searchinner"><Image src={innerSearch} alt="Cart Icon" /></span>
                                    <Input type="search" name="filter" onClick={()=>setSearchModal(!searchModal)}  onChange={e => setSearchText(e.target.value)} placeholder="Search for Restaurant or Dishes" />
                                    <span className="search-close" onClick={searchBox}><Image src={closeIcon} alt="Cart Icon" /></span>
                                </FormGroup>
                            </Form> */}
                            <SearchMenuItems />
                        </li>
                        <li ref={CartDropDowns}>
                            <span role="button" className='addToCartBoxWraper'>
                                {
                                    cartData.totalQuantity > 0
                                        ? <span className="cartBageIcon cartBadge">{ cartData.totalQuantity }</span>
                                        : ''
                                }  
                                <a onClick={cartBox}><Image src={cart} alt="Cart Icon" /></a>
                            </span>
                            <div className="cartBlock cartBoxBlock">
                                <div className="cartTitle">
                                    <h6>Cart <span>({cartData.totalQuantity})</span></h6>
                                </div>
                                <div className={`${Object.keys(cartData?.orderItems).length > 3 ? "cartItems" : ""}`}>
                                    {Object.keys(cartData.orderItems).map(list=>(
                                        Object.keys(cartData.orderItems[list].selectedGroup).map(group=>(
                                            <div className="cartInfo" key={group}>
                                                <div className="imgBlock">
                                                    <img src={cartData.orderItems[list].menuitem.image} alt="Cart" />
                                                </div>
                                                <div className="cartContent">
                                                    <div className="cartContentInner">
                                                        <h6>{cartData.orderItems[list].menuitem.title}</h6>
                                                        <span>{getCustomeTypeToString(cartData.orderItems[list].selectedGroup[group].group)} </span>
                                                    </div>
                                                    <div className="AddCart">
                                                        <span className="cartPrice">£{cartData.orderItems[list].selectedGroup[group].price}</span>  
                                                        <QuantityBtn
                                                            defvalue={cartData.orderItems[list].selectedGroup[group].quantity}
                                                            grpCus={true}
                                                            groupId={group}
                                                            itemId={list}
                                                            getQuantity={()=>{ }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ))}
                                </div>
                                <div className="btnBlock">
                                    <span role="button"><a onClick={checkOut} cart={cartData.totalQuantity?1:0}>Checkout</a></span>
                                </div>
                            </div>
                        </li>
                        <li className="toggle-block" onClick={navWrap}><span role="button"><a className="toggle-btn"><span></span></a></span></li>
                    </ul>
                    </div>
                </Col>
            </Row> 
        </Container>      
        <SideMenu
            closeNavWrap={navWrap}
            authrize={authrize}
        />
    </header>
    {authrize?
        <Location
            isOpen={locationModal}
            handelLocation={handelLocation}
            locationData={
                {
                    location:{
                        address:"",
                        area:'',
                        lat:"",
                        lng:""
                    },
                    tag:"Home"
                }
            }
        />
    :null}
    </>
  )


}
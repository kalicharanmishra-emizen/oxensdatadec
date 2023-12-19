import { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { createAddress, updateAddress } from '../../reducers/addressSlice';
import { unSetApiFail } from '../../reducers/mainSlice';
import { Alert, Col,Input, Label, Modal, ModalBody, ModalFooter } from 'reactstrap';
import AutoPicker from '../Map/AutoPicker';
import MapWrapper from '../Map/MapWrapper';
import _ from "lodash";
function Location(props) {
    const dispatch = useDispatch()
    const [formData,setFormData]= useState({})
    const apiFail = useSelector(state=>state.mainSlice.failed)
    const addressList = useSelector(state=>state.addressSlice.list)
    const [alert,setAlert] = useState({
        status:false,
        message:"",
    })
    const getLocation = (location) =>{
        let area = location.address_components.find(temp=>
                _.isEqual(temp.types,[
                    "political",
                    "sublocality",
                    "sublocality_level_1"
                ])
            )
        formData.location = {
            address:location.formatted_address,
            area:area?area.long_name:null,
            lat:location.geometry.location.lat(),
            lng:location.geometry.location.lng()
        }
        setFormData({...formData})
    }    
    const handelTag = (e) =>{
        formData.tag = e.target.value
        setFormData({...formData})
    }
    const submitLocation = () => {
        if ('id' in formData) {
            dispatch(updateAddress(formData))
        }else{
            dispatch(createAddress(formData))
        }
    }
    useEffect(() => {
        setFormData(props.locationData)
    }, [props.locationData]);
    useEffect(() => {
        if (props.isOpen && !addressList.isLoading) {
            setFormData(
                {
                    location:{
                        address:"",
                        area:'',
                        lat:"",
                        lng:""
                    },
                    tag:"Home"
                }
            )
            props.handelLocation()
        }
    }, [addressList]);
    
    useEffect(() => {
      if (apiFail) {
        if(apiFail.statusCode >= 400 && apiFail.statusCode <= 500){
            setAlert({
                status:true,
                message: apiFail.message,
            })
            // nProgress.done()
            dispatch(unSetApiFail())
            setTimeout(() => {
                setAlert({
                    status:false,
                    message: '',
                })
            }, 3000);
        }
      }
    }, [apiFail]);
    
    return (
        <>
            <Modal isOpen={props.isOpen} toggle={props.handelLocation} className="ModalCustom deliveryLocation">
                <ModalBody className="p-0">
                    <MapWrapper
                        location={formData.location}
                        getLocation={getLocation}
                    />
                    <div className="setLocation">                
                        <div className="locationFrom">
                            <h6>Set your Delivery Location <span className="locationClose" onClick={props.handelLocation}></span></h6>
                            <Alert isOpen={alert.status} color='danger'>
                                    {alert.message}
                            </Alert>
                            <AutoPicker
                                location={formData.location}
                                getLocation={getLocation}
                            />
                        </div>
                        <div className="locationBottom">
                            <span className="tagTitle">Select tag for later use</span>
                            <Label check>
                                <Input type="radio" name="tag" value='Home' className="checkInput" onChange={handelTag} defaultChecked={formData.tag=='Home'?true:false} />
                                <span className="checkmark"></span>
                                <span className="checktext">Home</span>
                            </Label>
                            <Label check> 
                                <Input type="radio" name="tag" onChange={handelTag} value='Office' className="checkInput" defaultChecked={formData.tag=='Office'?true:false}/>
                                <span className="checkmark"></span>
                                <span className="checktext">Office</span> 
                            </Label>
                            <Label check> 
                                <Input type="radio" name="tag" onChange={handelTag} value='Other' className="checkInput" defaultChecked={formData.tag=='Other'?true:false}/>
                                <span className="checkmark"></span>
                                <span className="checktext">Other</span> 
                            </Label>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="p-0">
                    <Col sm="12 m-0">
                        <div className="btnBlock">
                            <span role="button" onClick={submitLocation}><a className="themeBtn">Save and Proceed</a></span>
                        </div>
                    </Col>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default Location;

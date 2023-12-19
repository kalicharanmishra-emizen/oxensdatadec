import React, { useEffect, useState } from 'react'
import MapWrapper from "../../components/Map/MapWrapper";
import AutoPicker from "../../components/Map/AutoPicker";
import { Modal, ModalBody } from 'reactstrap';
export default function LocationCom(props) {
    const [mapToggle,setMapToggle] = useState(false)
    const [location,setLocation] = useState({
        address:"",
        lat:"",
        lng:""
    })
    useEffect(()=>{
        setLocation({
            address:props.defValue.address?props.defValue.address:'',
            lat:props.defValue.lat?props.defValue.lat:'',
            lng:props.defValue.lng?props.defValue.lng:''
        })
    },[props.defValue])
    const getLocation = (location) =>{
            props.getValue('location',{
                address:location.formatted_address,
                lat:location.geometry.location.lat(),
                lng:location.geometry.location.lng()
            })
    }
    const toggleMap = () =>{
        setMapToggle(!mapToggle)
    }
    return (
        <>
            <span role="botton" onClick={toggleMap} className="custom-input">{location.address!=""?location.address:"Store Location"}</span>
            {props.error?<div className="validation-error-custome">{props.error?props.error.address:""}</div>:''}
            <Modal className="location-modal"
                isOpen={mapToggle}
            >
                <ModalBody>
                    <MapWrapper
                        getLocation={getLocation}
                        location={location}
                    />
                    <AutoPicker
                        toggleMap={toggleMap}
                        getLocation={getLocation}
                        location={location}
                    />
                </ModalBody>
            </Modal>
        </>
    )
}


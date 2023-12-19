import styles from "../../styles/my-order.module.css";
import Driver from '../../public/images/driver.png';
import { Modal, ModalBody } from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DriverTrack from "../Map/driverTrack";
import StatusTrack from '../order/statusTrack'
import { callLatlong } from "../../reducers/frontSlice";

function Tracking(props) {

    const dispatch = useDispatch()
    const getAllLatLng = useSelector(state => state.frontSlice.data)
    const [data, setData] = useState({})
    const [allLatLng, setAllLatLng] = useState({})

    useEffect(() => {
        dispatch(callLatlong({orderId:props?.trackingOrder?._id}))
    }, [props?.trackingOrder?._id])

    useEffect(()=>{
        if (Object.keys(props.trackingOrder).length!=0) {
            setData(props.trackingOrder)
            setAllLatLng(getAllLatLng)  
        }else{
            setData({})
            setAllLatLng({})
        }
    },[getAllLatLng])
    
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className={`${styles.trackOrder} trackOrderpopup`}>
            <span className={`${styles.closeButton}`} onClick={props.toggle}></span>
            <ModalBody className="p-0">
                <div className={`${styles.map} driverTracker`}>
                   { 
                      Object.keys(allLatLng).length > 0 
                        ? <DriverTrack
                                socket={props.socket}
                                data={data}
                                allLatLng={allLatLng}
                            />
                        : ""
                    }
                </div>
                <div className={`${styles.trackInfo}`}>
                    { 
                      Object.keys(allLatLng).length > 0 
                        ? <StatusTrack
                                type={data.type}
                                status={data.status}
                                driver={{
                                    status:data.driverAssignStatus,
                                    detail:data.driverDetail
                                }}
                            />
                        : ""
                    }
                </div>
            </ModalBody>
        </Modal>
    )
}

export default Tracking
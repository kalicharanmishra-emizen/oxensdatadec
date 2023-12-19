import { Container, Row, Col} from 'reactstrap'
import IinnerLayout from "../layouts/linnerlayout"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import styles from "../styles/address.module.css";
import editIcon from "../public/images/editIcon.svg";
import tarshIcon from "../public/images/tarsh_Icon.svg";
import addAddress from "../public/images/addAddress.svg";
import { useSelector,useDispatch } from 'react-redux';
import Location from '../componets/Model/location';
import {destoryAddress, getAddress} from '../reducers/addressSlice';

function Address() {
	const dispatch = useDispatch()
	const myAddress = useSelector(state => state.addressSlice.list)
	const [locationModal, setLocationModal] = useState(false);
	const [locationData,setLocationData] = useState({
		location:{
			address:"",
			area:'',
			lat:"",
			lng:""
		},
		tag:"Home"
	})
	useEffect(() => {
        if (myAddress.isLoading) {
            dispatch(getAddress())
        }
    }, [myAddress])
	const handalUpdate = (e) =>{
		let addressID = e.currentTarget.getAttribute('value')
		let address= myAddress.data.find(temp=>temp._id==addressID)
		if (address!=undefined) {
			setLocationData({
				id:address._id,
				location:{
					address:address.address,
					area:address.area,
					lat:address.lat,
					lng:address.lng
				},
				tag:address.tag
			})
			setLocationModal(!locationModal)
		} 

	}
	const handalDelete = (e) =>{
		let addressId = e.currentTarget.getAttribute('value')
		dispatch(destoryAddress({addressId}))
	}
	const handelAddNew = () =>{
		setLocationData({
			location:{
				address:"",
				area:'',
				lat:"",
				lng:""
			},
			tag:"Home"
		})
		setLocationModal(!locationModal)
	}
	const handelLocation = () => {
		setLocationData({
			location:{
				address:"",
				area:'',
				lat:"",
				lng:""
			},
			tag:"Home"
		})
        setLocationModal(!locationModal)
    }
  return (
    <>
				<section className={styles.banner}>                
					<div className={`${styles.tableWrap}`}>
						<div className={`${styles.alignWrap}`}>
							<Container>
								<h2>My Address</h2>
							</Container>
						</div>
					</div>                
				</section>
				<section className={`${styles.address_page}`}>
					<Container>
						<Row>
							<Col lg="4" md="6">
								<div role="button" onClick={handelAddNew} className={`${styles.addInfo}`}>
									<div className={`${styles.tableWrap}`}>
										<div className={`${styles.alignWrap}`}>
											<Image src={addAddress} alt="Add" />
											<h4>Add Address</h4>
										</div>
									</div>
								</div>
							</Col>
							{
								!myAddress.isLoading?
									myAddress.data.length!=0?
										myAddress.data.map((list)=>(
											<Col lg="4" md="6" key={list._id}>
												<div className={`${styles.addInfo}`}>
													<div className={`${styles.addBtn}`}>
														<span 
															role="button" 
															value={list._id}
															onClick={handalUpdate}
														>
															<Image src={editIcon} alt="editIcon"/>
														</span>
														<span 
															role="button"
															value={list._id}
															onClick={handalDelete}
														>
															<Image src={tarshIcon} alt="tarshIcon" />
														</span>
													</div>
													<h4>{list.tag}</h4>
													<p>{list.address}</p>
												</div>
											</Col>
										))
									:'no data found'
								:null
							}
						</Row>
					</Container>
				</section>
				<Location
					isOpen={locationModal}
					handelLocation={handelLocation}
					locationData={locationData}
				/>
    </>
  )
}
Address.layout = IinnerLayout
export default Address